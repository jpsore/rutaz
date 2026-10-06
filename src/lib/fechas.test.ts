import { describe, expect, it } from "vitest";
import {
  diasEntre,
  esMesValido,
  formatoDiaLargo,
  formatoFechaCorta,
  formatoRango,
  hoyLima,
  mesActualLima,
  mesesEntre,
  nombreMes,
  rangoDelMes,
  seCruzan,
  sumarDias,
  sumarMeses,
} from "./fechas";

describe("hora de Lima", () => {
  it("usa Lima y no la hora del servidor: 1 nov 03:00 UTC sigue siendo 31 oct en Lima", () => {
    const ahora = new Date("2026-11-01T03:00:00Z");
    expect(hoyLima(ahora)).toBe("2026-10-31");
    expect(mesActualLima(ahora)).toBe("2026-10");
  });

  it("primer día del mes a medianoche en Lima ya es el mes nuevo", () => {
    const ahora = new Date("2026-11-01T05:00:00Z"); // 00:00 en Lima
    expect(mesActualLima(ahora)).toBe("2026-11");
  });
});

describe("meses", () => {
  it("valida AAAA-MM", () => {
    expect(esMesValido("2026-10")).toBe(true);
    expect(esMesValido("2026-13")).toBe(false);
    expect(esMesValido("oct")).toBe(false);
  });

  it("suma meses cruzando el año", () => {
    expect(sumarMeses("2026-11", 2)).toBe("2027-01");
    expect(sumarMeses("2027-01", -1)).toBe("2026-12");
    expect(mesesEntre("2026-11", "2027-01")).toBe(2);
  });

  it("rango del mes", () => {
    expect(rangoDelMes("2026-10")).toEqual({ inicio: "2026-10-01", fin: "2026-10-31" });
    expect(rangoDelMes("2028-02")).toEqual({ inicio: "2028-02-01", fin: "2028-02-29" });
  });

  it("nombre del mes", () => {
    expect(nombreMes("2026-10")).toBe("octubre");
  });
});

describe("formatos", () => {
  it("rango dentro del mes", () => {
    expect(formatoRango("2026-10-03", "2026-10-06")).toBe("3 – 6 oct");
  });
  it("rango que cruza meses", () => {
    expect(formatoRango("2026-10-29", "2026-11-02")).toBe("29 oct – 2 nov");
  });
  it("un solo día", () => {
    expect(formatoRango("2026-10-31", "2026-10-31")).toBe("31 oct");
  });
  it("fecha corta y día largo", () => {
    expect(formatoFechaCorta("2026-09-28")).toBe("28 sep");
    expect(formatoDiaLargo("2026-10-08")).toBe("Jue 8 de octubre");
  });
});

describe("aritmética de días", () => {
  it("días entre y sumar días", () => {
    expect(diasEntre("2026-09-28", "2026-11-27")).toBe(60);
    expect(sumarDias("2026-10-31", 1)).toBe("2026-11-01");
  });
  it("rangos que se cruzan", () => {
    expect(seCruzan("2026-09-25", "2026-10-05", "2026-10-01", "2026-10-31")).toBe(true);
    expect(seCruzan("2026-09-01", "2026-09-30", "2026-10-01", "2026-10-31")).toBe(false);
  });
});
