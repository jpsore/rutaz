import { describe, expect, it } from "vitest";
import { correoValido, debeMostrarOferta } from "./oferta-cuenta";

const ahora = new Date("2026-10-10T12:00:00Z");
const haceDias = (d: number) => new Date(ahora.getTime() - d * 86_400_000).toISOString();

describe("debeMostrarOferta", () => {
  it("nunca visto: sí", () => expect(debeMostrarOferta(null, ahora)).toBe(true));
  it("cerrado hace 3 días: no", () => expect(debeMostrarOferta({ cerrado_en: haceDias(3) }, ahora)).toBe(false));
  it("cerrado hace 8 días: sí", () => expect(debeMostrarOferta({ cerrado_en: haceDias(8) }, ahora)).toBe(true));
  it("correo dejado: nunca", () =>
    expect(debeMostrarOferta({ correo_dejado: true, cerrado_en: haceDias(30) }, ahora)).toBe(false));
});

describe("correoValido", () => {
  it("acepta correos con forma válida", () => {
    expect(correoValido("ana@gmail.com")).toBe(true);
    expect(correoValido(" ana@correo.pe ")).toBe(true);
  });
  it("rechaza lo demás", () => {
    expect(correoValido("ana")).toBe(false);
    expect(correoValido("ana@gmail")).toBe(false);
    expect(correoValido("a na@gmail.com")).toBe(false);
  });
});
