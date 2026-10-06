import { describe, expect, it } from "vitest";
import { planificar, diasDisponibles, margenImprevistos, ErrorPlanificador, type Parada, type Plantilla } from ".";

let n = 0;
function parada(p: Partial<Omit<Parada, "costos">> & { costos: [number, number, number] }): Parada {
  const [economico, estandar, comodo] = p.costos;
  n += 1;
  return {
    id: p.id ?? `p${n}`,
    dia: p.dia ?? 1,
    orden: p.orden ?? n,
    hora: p.hora ?? "08:00",
    actividad: p.actividad ?? `Parada ${n}`,
    detalle: null,
    categoria: p.categoria ?? "actividad",
    costos: { economico, estandar, comodo },
    opcional: p.opcional ?? false,
    verificado_el: p.verificado_el ?? null,
  };
}

// 1 día: económico 100, estándar 200, cómodo 280
const unDia: Plantilla = {
  id: "t1",
  dias: 1,
  paradas: [
    parada({ id: "bus", categoria: "transporte", costos: [20, 40, 80], verificado_el: "2026-09-28" }),
    parada({ id: "almuerzo", categoria: "comida", costos: [30, 60, 100] }),
    parada({ id: "caballo", categoria: "actividad", costos: [50, 100, 100], opcional: true }),
  ],
};
// 2 días: económico 220, estándar 320, cómodo 560
const dosDias: Plantilla = {
  id: "t2",
  dias: 2,
  paradas: [
    parada({ id: "b1", dia: 1, categoria: "transporte", costos: [20, 30, 60], verificado_el: "2026-09-28" }),
    parada({ id: "hotel", dia: 1, categoria: "hospedaje", costos: [60, 100, 200] }),
    parada({ id: "guia", dia: 2, categoria: "actividad", costos: [30, 40, 60], opcional: true }),
    parada({ id: "peña", dia: 2, categoria: "actividad", costos: [80, 120, 200], opcional: true }),
    parada({ id: "b2", dia: 2, categoria: "transporte", costos: [30, 30, 40], verificado_el: "2026-09-28" }),
  ],
};

describe("planificar", () => {
  it("elige cómodo cuando entra", () => {
    const r = planificar({ plantillas: [unDia], dias: 1, presupuesto: 300 });
    expect(r.nivel).toBe("comodo");
    expect(r.total).toBe(280);
    expect(r.alcanza).toBe(true);
    expect(r.diferencia).toBe(20);
    expect(r.sugerencias).toEqual([]);
  });

  it("baja a estándar y a económico", () => {
    expect(planificar({ plantillas: [unDia], dias: 1, presupuesto: 150 }).nivel).toBe("economico");
    const r = planificar({ plantillas: [dosDias], dias: 2, presupuesto: 300 });
    expect(r.nivel).toBe("economico");
    const conQuitar = planificar({ plantillas: [unDia], dias: 1, presupuesto: 150, paradasQuitadas: ["caballo"] });
    // sin caballo: 50 / 100 / 180 → estándar entra en 150
    expect(conQuitar.nivel).toBe("estandar");
  });

  it("500+ siempre es cómodo y alcanza", () => {
    const r = planificar({ plantillas: [dosDias], dias: 2, presupuesto: 500 });
    expect(r.nivel).toBe("comodo");
    expect(r.alcanza).toBe(true);
    expect(r.total).toBe(560);
  });

  it("no alcanza: sugiere un día menos si hay plantilla, y quitar opcionales de mayor a menor ahorro", () => {
    const r = planificar({ plantillas: [unDia, dosDias], dias: 2, presupuesto: 150 });
    expect(r.alcanza).toBe(false);
    expect(r.nivel).toBe("economico");
    expect(r.total).toBe(220);
    expect(r.diferencia).toBe(-70);
    expect(r.sugerencias).toEqual([
      { tipo: "menos_dias", dias: 1, total: 100 },
      { tipo: "quitar_parada", paradaId: "peña", actividad: expect.any(String), ahorro: 80 },
      { tipo: "quitar_parada", paradaId: "guia", actividad: expect.any(String), ahorro: 30 },
    ]);
  });

  it("no alcanza sin plantilla de un día menos: solo sugiere quitar paradas", () => {
    const r = planificar({ plantillas: [dosDias], dias: 2, presupuesto: 150 });
    expect(r.sugerencias.every((s) => s.tipo === "quitar_parada")).toBe(true);
    expect(r.sugerencias).toHaveLength(2);
  });

  it("quitar una parada opcional recalcula total, desglose y sugerencias", () => {
    const r = planificar({ plantillas: [dosDias], dias: 2, presupuesto: 150, paradasQuitadas: ["peña"] });
    expect(r.total).toBe(140);
    expect(r.alcanza).toBe(true);
    expect(r.dias.flatMap((d) => d.paradas.map((p) => p.id))).not.toContain("peña");
    expect(r.desglose).toEqual({ transporte: 50, comida: 0, hospedaje: 60, actividad: 30 });
  });

  it("nunca sugiere ni permite quitar una parada no opcional", () => {
    const r = planificar({ plantillas: [dosDias], dias: 2, presupuesto: 150, paradasQuitadas: ["hotel"] });
    expect(r.dias.flatMap((d) => d.paradas.map((p) => p.id))).toContain("hotel");
    const ids = r.sugerencias.flatMap((s) => (s.tipo === "quitar_parada" ? [s.paradaId] : []));
    expect(ids).not.toContain("hotel");
    expect(ids).not.toContain("b1");
  });

  it("monotonía: más presupuesto nunca da un nivel peor ni una ruta más barata", () => {
    const orden = { economico: 0, estandar: 1, comodo: 2 };
    for (const plantillas of [[unDia], [dosDias]]) {
      const dias = plantillas[0].dias as 1 | 2;
      const rs = ([150, 300, 500] as const).map((presupuesto) => planificar({ plantillas, dias, presupuesto }));
      for (let i = 1; i < rs.length; i++) {
        expect(orden[rs[i].nivel]).toBeGreaterThanOrEqual(orden[rs[i - 1].nivel]);
        expect(rs[i].total).toBeGreaterThanOrEqual(rs[i - 1].total);
      }
    }
  });

  it("agrupa por día en orden y copia verificado_el", () => {
    const r = planificar({ plantillas: [dosDias], dias: 2, presupuesto: 500 });
    expect(r.dias.map((d) => d.dia)).toEqual([1, 2]);
    expect(r.dias[0].paradas[0]).toMatchObject({ id: "b1", costo: 60, verificado_el: "2026-09-28" });
  });

  it("sin plantilla para esos días da un error controlado", () => {
    expect(() => planificar({ plantillas: [unDia], dias: 3, presupuesto: 300 })).toThrow(ErrorPlanificador);
  });
});

describe("ayudas", () => {
  it("días disponibles", () => {
    expect(diasDisponibles([dosDias, unDia])).toEqual([1, 2]);
  });
  it("margen de imprevistos del 10 %", () => {
    expect(margenImprevistos(258)).toBe(26);
  });
});
