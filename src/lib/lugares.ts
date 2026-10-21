// Lugares sugeridos en paradas de comida y hospedaje (v2). Lógica pura, sin base de datos.
import type { LugarFila } from "./contenido/tipos";
import { soles } from "./dinero";
import { formatoMesAnio } from "./fechas";
import type { Categoria, Nivel } from "./planner/tipos";

export const MAX_LUGARES_POR_PARADA = 2;
const CATEGORIAS_CON_LUGARES: Categoria[] = ["comida", "hospedaje"];

export type LugarSugerido = {
  id: number;
  nombre: string;
  /** "S/ 20–25 por persona" */
  precio: string;
  /** "Precio aprox. · revisado oct 2026" */
  revisado: string;
};

/** Lugares de las paradas dadas, agrupados por id de parada (como texto, igual que en el planificador). */
export function lugaresPorParada(lugares: LugarFila[], paradaIds: string[]): Record<string, LugarFila[]> {
  const ids = new Set(paradaIds);
  const out: Record<string, LugarFila[]> = {};
  for (const l of lugares) {
    const id = String(l.stop_id);
    if (!ids.has(id)) continue;
    (out[id] ??= []).push(l);
  }
  return out;
}

/** "S/ 20–25 por persona" o "S/ 20 por persona" si el rango es un solo precio. */
export function textoPrecioLugar(min: number, max: number): string {
  return min === max ? `${soles(min)} por persona` : `${soles(min)}–${formatoSinSimbolo(max)} por persona`;
}

function formatoSinSimbolo(monto: number): string {
  return soles(monto).replace(/^S\/\s/, "");
}

/**
 * 1 o 2 lugares de una parada para el nivel que eligió el motor.
 * Sirven los del mismo nivel y los de nivel null (todos). Ordenados por `orden`.
 * Solo paradas de comida u hospedaje; si no hay lugares, devuelve [].
 */
export function lugaresParaParada(
  lugares: LugarFila[] | undefined,
  categoria: Categoria,
  nivel: Nivel,
): LugarSugerido[] {
  if (!lugares || !CATEGORIAS_CON_LUGARES.includes(categoria)) return [];
  return lugares
    .filter((l) => l.nivel === null || l.nivel === nivel)
    // A igual orden, primero el lugar propio del nivel que uno genérico.
    .sort((a, b) => a.orden - b.orden || Number(a.nivel === null) - Number(b.nivel === null))
    .slice(0, MAX_LUGARES_POR_PARADA)
    .map((l) => ({
      id: l.id,
      nombre: l.nombre,
      precio: textoPrecioLugar(l.precio_min, l.precio_max),
      revisado: `Precio aprox. · revisado ${formatoMesAnio(l.verificado_el)}`,
    }));
}
