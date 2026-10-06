import { describe, expect, it } from "vitest";
import { planificar } from "../planner";
import { armarFicha, armarMes, avisosDelPlan, formatoDuracion, plantillasDelPlan, resumenPlan, textoFechaEvento } from "./consultas";
import { contenidoLocal as c } from "./seed-local";

describe("armarMes (octubre 2026 del seed)", () => {
  const vista = armarMes(c, "2026-10", "2026-10-06");

  it("tres bloques en orden fijo", () => {
    expect(vista.bloques.map((b) => b.titulo)).toEqual([
      "Fiestas y eventos",
      "Destinos en su mejor momento",
      "Rutas temáticas",
    ]);
  });

  it("oculta eventos pasados y marca los que están en curso", () => {
    const eventos = vista.bloques[0].tarjetas;
    expect(eventos.map((t) => t.slug)).toEqual(["senor-de-los-milagros", "dia-cancion-criolla"]);
    expect(eventos[0].ahora).toBe(true);
    expect(eventos[1].ahora).toBe(false);
  });

  it("fiesta con fecha por confirmar", () => {
    const antes = armarMes(c, "2026-10", "2026-10-01");
    const agua = antes.bloques[0].tarjetas.find((t) => t.slug === "fiesta-del-agua")!;
    expect(agua.fecha).toBe("Fecha por confirmar · inicios de oct");
  });

  it("destinos con temporada y etiqueta", () => {
    const d = vista.bloques[1].tarjetas[0];
    expect(d).toMatchObject({ slug: "san-pedro-de-casta", fecha: "Época seca", etiqueta: "joya-escondida", puedePlanificar: true });
  });

  it("feriados largos del mes que no pasaron", () => {
    expect(vista.feriados.map((f) => f.fecha)).toEqual(["2026-10-08"]);
    expect(armarMes(c, "2026-10", "2026-10-09").feriados).toEqual([]);
  });

  it("avisos que se cruzan con el mes, el más próximo primero, sin los ya terminados", () => {
    expect(vista.avisos.map((a) => a.id)).toEqual([2]);
    expect(armarMes(c, "2026-10", "2026-10-01").avisos.map((a) => a.id)).toEqual([1, 2]);
  });

  it("mes sin contenido queda vacío", () => {
    const nov = armarMes(c, "2026-11", "2026-10-06");
    expect(nov.vacio).toBe(true);
    expect(nov.bloques).toEqual([]);
  });
});

describe("planes y fichas", () => {
  it("un evento sin plantillas usa las de su destino", () => {
    expect(plantillasDelPlan(c, "evento", "fiesta-del-agua").map((p) => p.dias)).toEqual([2]);
  });

  it("resumen del evento con destino", () => {
    expect(resumenPlan(c, "evento", "fiesta-del-agua")?.titulo).toBe("Fiesta del Agua · San Pedro de Casta y Marcahuasi");
    expect(resumenPlan(c, "destino", "no-existe")).toBeNull();
  });

  it("ficha de destino con tramos verificados de la plantilla más corta", () => {
    const f = armarFicha(c, "destino", "san-pedro-de-casta", "2026-10", "2026-10-01")!;
    expect(f.destino?.altitud_m).toBe(4000);
    expect(f.tramos.map((t) => t.actividad)).toEqual([
      "Bus Lima → Chosica",
      "Colectivo Chosica → San Pedro de Casta",
      "Regreso San Pedro → Chosica → Lima",
    ]);
    expect(f.porQueAhora).toBe("Cielos despejados para acampar en la meseta.");
    expect(f.avisos).toHaveLength(1);
  });

  it("ficha de evento usa los datos de su destino", () => {
    const f = armarFicha(c, "evento", "fiesta-del-agua", "2026-10", "2026-10-01")!;
    expect(f.destino?.slug).toBe("san-pedro-de-casta");
    expect(f.cuandoIr).toBe("Fecha por confirmar · inicios de oct");
  });

  it("sin por qué ahora si no está en ese mes", () => {
    expect(armarFicha(c, "destino", "barranco", "2026-10", "2026-10-06")!.porQueAhora).toBeNull();
  });

  it("avisos del plan en las fechas del evento", () => {
    const plan = resumenPlan(c, "evento", "fiesta-del-agua")!;
    expect(avisosDelPlan(c, plan, "2026-10-01").map((a) => a.id)).toEqual([1]);
  });

  it("textos", () => {
    expect(textoFechaEvento(c.eventos[0])).toBe("1 – 31 oct");
    expect(formatoDuracion(240)).toBe("4 h");
    expect(formatoDuracion(45)).toBe("45 min");
  });
});

describe("motor con datos reales del seed: San Pedro de Casta, 2 días", () => {
  const plantillas = plantillasDelPlan(c, "destino", "san-pedro-de-casta");

  it("S/ 150 no alcanza y sugiere quitar el caballo y el guía", () => {
    const r = planificar({ plantillas, dias: 2, presupuesto: 150 });
    expect(r.alcanza).toBe(false);
    expect(r.nivel).toBe("economico");
    expect(r.total).toBe(190);
    expect(r.sugerencias.map((s) => (s.tipo === "quitar_parada" ? s.actividad : s.tipo))).toEqual([
      "Subida a la meseta en caballo",
      "Amanecer en Marcahuasi con guía",
    ]);
  });

  it("S/ 300 da estándar", () => {
    const r = planificar({ plantillas, dias: 2, presupuesto: 300 });
    expect(r.nivel).toBe("estandar");
    expect(r.total).toBe(258);
  });

  it("S/ 500+ da cómodo", () => {
    expect(planificar({ plantillas, dias: 2, presupuesto: 500 }).nivel).toBe("comodo");
  });
});
