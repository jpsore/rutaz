import { describe, expect, it } from "vitest";
import { estadoVerificacion } from "./verificacion";

describe("estadoVerificacion", () => {
  it("muestra la fecha corta", () => {
    expect(estadoVerificacion("2026-09-28", "2026-10-06").texto).toBe("Verificado: 28 sep");
  });
  it("hasta 60 días no pide confirmar", () => {
    expect(estadoVerificacion("2026-09-28", "2026-10-06").confirmarAntes).toBe(false);
    expect(estadoVerificacion("2026-09-28", "2026-11-27").confirmarAntes).toBe(false); // 60 días justos
  });
  it("con más de 60 días pide confirmar antes de viajar", () => {
    expect(estadoVerificacion("2026-09-28", "2026-11-28").confirmarAntes).toBe(true);
  });
});
