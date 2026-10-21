import { describe, expect, it } from "vitest";
import type { LugarFila } from "./contenido/tipos";
import { contenidoLocal as c } from "./contenido/seed-local";
import { lugaresParaParada, lugaresPorParada, textoPrecioLugar } from "./lugares";

function lugar(p: Partial<LugarFila> & Pick<LugarFila, "id">): LugarFila {
  return {
    stop_id: 1, nivel: null, orden: 1, nombre: `Lugar ${p.id}`, precio_min: 10, precio_max: 20,
    referencia: null, maps_url: null, verificado_el: "2026-10-15", ...p,
  };
}

describe("lugaresParaParada", () => {
  const lugares = [
    lugar({ id: 1, nivel: "economico", orden: 1, nombre: "Menú del mercado" }),
    lugar({ id: 2, nivel: "estandar", orden: 2, nombre: "Truchas El Mirador" }),
    lugar({ id: 3, nivel: "estandar", orden: 1, nombre: "Doña Rosa", precio_min: 20, precio_max: 25 }),
    lugar({ id: 4, nivel: "comodo", orden: 1, nombre: "Hotel" }),
  ];

  it("filtra por el nivel elegido y ordena por orden", () => {
    expect(lugaresParaParada(lugares, "comida", "estandar").map((l) => l.nombre)).toEqual(["Doña Rosa", "Truchas El Mirador"]);
    expect(lugaresParaParada(lugares, "comida", "economico").map((l) => l.nombre)).toEqual(["Menú del mercado"]);
  });

  it("nivel null sirve para todos los niveles", () => {
    const todos = [lugar({ id: 9, nivel: null, nombre: "Hospedaje comunal" })];
    for (const nivel of ["economico", "estandar", "comodo"] as const) {
      expect(lugaresParaParada(todos, "hospedaje", nivel).map((l) => l.nombre)).toEqual(["Hospedaje comunal"]);
    }
  });

  it("máximo 2 lugares y, a igual orden, primero el del nivel", () => {
    const muchos = [
      lugar({ id: 1, nivel: null, orden: 1, nombre: "Genérico 1" }),
      lugar({ id: 2, nivel: "comodo", orden: 1, nombre: "Cómodo 1" }),
      lugar({ id: 3, nivel: "comodo", orden: 2, nombre: "Cómodo 2" }),
    ];
    expect(lugaresParaParada(muchos, "comida", "comodo").map((l) => l.nombre)).toEqual(["Cómodo 1", "Genérico 1"]);
  });

  it("texto de precio y de revisión", () => {
    const [l] = lugaresParaParada(lugares, "comida", "estandar");
    expect(l.precio).toBe("S/ 20–25 por persona");
    expect(l.revisado).toBe("Precio aprox. · revisado oct 2026");
    expect(textoPrecioLugar(30, 30)).toBe("S/ 30 por persona");
    expect(textoPrecioLugar(800, 1250)).toBe("S/ 800–1,250 por persona");
  });

  it("sin lugares, o en una parada que no es comida ni hospedaje, no muestra nada", () => {
    expect(lugaresParaParada(undefined, "comida", "estandar")).toEqual([]);
    expect(lugaresParaParada([], "hospedaje", "estandar")).toEqual([]);
    expect(lugaresParaParada(lugares, "transporte", "estandar")).toEqual([]);
    expect(lugaresParaParada(lugares, "actividad", "estandar")).toEqual([]);
  });

  it("sin lugares del nivel elegido", () => {
    expect(lugaresParaParada([lugar({ id: 1, nivel: "comodo" })], "comida", "economico")).toEqual([]);
  });
});

describe("lugaresPorParada", () => {
  it("agrupa por parada solo las de la plantilla", () => {
    const porParada = lugaresPorParada(c.lugares, ["3", "4", "5", "6"]);
    expect(Object.keys(porParada).sort()).toEqual(["3", "6"]);
    expect(porParada["3"]).toHaveLength(3);
  });

  it("tabla vacía (migración aún no aplicada)", () => {
    expect(lugaresPorParada([], ["3"])).toEqual({});
  });
});
