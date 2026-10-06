import {
  CATEGORIAS,
  type Categoria,
  type DiaItinerario,
  type EntradaPlanificador,
  type Nivel,
  type Parada,
  type Plantilla,
  type Resultado,
  type Sugerencia,
} from "./tipos";

export * from "./tipos";

export const MAX_SUGERENCIAS_QUITAR = 3;
/** Margen de imprevistos que se muestra aparte (no entra en el total). */
export const MARGEN_IMPREVISTOS = 0.1;

export class ErrorPlanificador extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorPlanificador";
  }
}

/** Días con plantilla cargada, ordenados. */
export function diasDisponibles(plantillas: Plantilla[]): number[] {
  return [...new Set(plantillas.map((p) => p.dias))].sort((a, b) => a - b);
}

function paradasActivas(plantilla: Plantilla, quitadas: Set<string>): Parada[] {
  return plantilla.paradas.filter((p) => !(p.opcional && quitadas.has(p.id)));
}

function totalNivel(paradas: Parada[], nivel: Nivel): number {
  return Math.round(paradas.reduce((s, p) => s + p.costos[nivel], 0));
}

export function margenImprevistos(total: number): number {
  return Math.round(total * MARGEN_IMPREVISTOS);
}

/** Motor del planificador: puro, sin base de datos. Ver specs/04-itinerario.md. */
export function planificar(entrada: EntradaPlanificador): Resultado {
  const { plantillas, dias, presupuesto } = entrada;
  const quitadas = new Set(entrada.paradasQuitadas ?? []);

  const plantilla = plantillas.find((p) => p.dias === dias);
  if (!plantilla) throw new ErrorPlanificador(`No hay plantilla de ${dias} días`);

  const paradas = paradasActivas(plantilla, quitadas);

  let nivel: Nivel;
  let alcanza: boolean;
  if (presupuesto === 500) {
    // 500 = "500 o más": se considera que alcanza para cómodo.
    nivel = "comodo";
    alcanza = true;
  } else {
    const entra = (["comodo", "estandar", "economico"] as Nivel[]).find(
      (n) => totalNivel(paradas, n) <= presupuesto,
    );
    nivel = entra ?? "economico";
    alcanza = entra !== undefined;
  }

  const total = totalNivel(paradas, nivel);

  const desglose = Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as Record<Categoria, number>;
  for (const p of paradas) desglose[p.categoria] += p.costos[nivel];
  for (const c of CATEGORIAS) desglose[c] = Math.round(desglose[c]);

  const porDia = new Map<number, DiaItinerario>();
  for (const p of [...paradas].sort((a, b) => a.dia - b.dia || a.orden - b.orden)) {
    const { costos, ...resto } = p;
    if (!porDia.has(p.dia)) porDia.set(p.dia, { dia: p.dia, paradas: [] });
    porDia.get(p.dia)!.paradas.push({ ...resto, costo: Math.round(costos[nivel]) });
  }

  const sugerencias: Sugerencia[] = [];
  if (!alcanza) {
    const menor = plantillas.find((p) => p.dias === dias - 1);
    if (menor) {
      const totalMenor = totalNivel(menor.paradas, "economico");
      if (totalMenor <= presupuesto || totalMenor < total) {
        sugerencias.push({ tipo: "menos_dias", dias: dias - 1, total: totalMenor });
      }
    }
    paradas
      .filter((p) => p.opcional)
      .map((p) => ({ p, ahorro: Math.round(p.costos.economico) }))
      .filter(({ ahorro }) => ahorro > 0)
      .sort((a, b) => b.ahorro - a.ahorro)
      .slice(0, MAX_SUGERENCIAS_QUITAR)
      .forEach(({ p, ahorro }) =>
        sugerencias.push({ tipo: "quitar_parada", paradaId: p.id, actividad: p.actividad, ahorro }),
      );
  }

  return {
    nivel,
    dias: [...porDia.values()],
    total,
    desglose,
    alcanza,
    diferencia: presupuesto - total,
    sugerencias,
  };
}
