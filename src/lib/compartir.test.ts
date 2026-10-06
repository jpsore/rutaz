import { describe, expect, it } from "vitest";
import { armarLinkCompartido, rutaItinerario, textoCompartir } from "./compartir";

describe("armarLinkCompartido", () => {
  it("agrega los UTM de compartido a un path", () => {
    expect(armarLinkCompartido("/destino/barranco", { tipo: "destino", slug: "barranco" })).toBe(
      "/destino/barranco?utm_source=compartido&utm_medium=share&utm_content=destino-barranco",
    );
  });

  it("conserva los parámetros del itinerario y no duplica UTM", () => {
    const link = armarLinkCompartido(
      "https://rutaz.pe/planificar/ruta?tipo=evento&slug=fiesta-del-agua&presupuesto=300&dias=2&utm_source=tiktok&utm_campaign=video1&ttclid=abc",
      { tipo: "evento", slug: "fiesta-del-agua" },
    );
    const url = new URL(link);
    expect(url.origin).toBe("https://rutaz.pe");
    expect(url.searchParams.getAll("utm_source")).toEqual(["compartido"]);
    expect(url.searchParams.get("utm_campaign")).toBeNull();
    expect(url.searchParams.get("ttclid")).toBeNull();
    expect(url.searchParams.get("dias")).toBe("2");
    expect(url.searchParams.get("utm_content")).toBe("evento-fiesta-del-agua");
  });

  it("aplicarlo dos veces da lo mismo", () => {
    const una = armarLinkCompartido("/evento/x", { tipo: "evento", slug: "x" });
    expect(armarLinkCompartido(una, { tipo: "evento", slug: "x" })).toBe(una);
  });
});

describe("textoCompartir", () => {
  it("itinerario", () => {
    expect(textoCompartir({ origen: "itinerario", plan: "Barranco", dias: 1, total: 113 })).toBe(
      "Mira esta escapada: Barranco, 1 día, S/ 113 por persona",
    );
    expect(textoCompartir({ origen: "mis-rutas", plan: "Marcahuasi", dias: 2, total: 1250 })).toBe(
      "Mira esta escapada: Marcahuasi, 2 días, S/ 1,250 por persona",
    );
  });
  it("ficha", () => {
    expect(textoCompartir({ origen: "ficha", nombre: "Fiesta del Agua" })).toBe("Mira esto para este mes: Fiesta del Agua");
  });
});

describe("rutaItinerario", () => {
  it("arma la URL reproducible con paradas quitadas ordenadas", () => {
    expect(rutaItinerario({ tipo: "destino", slug: "barranco", presupuesto: 300, dias: 1 })).toBe(
      "/planificar/ruta?tipo=destino&slug=barranco&presupuesto=300&dias=1",
    );
    expect(rutaItinerario({ tipo: "destino", slug: "a", presupuesto: 150, dias: 2, quitadas: ["7", "5"] })).toBe(
      "/planificar/ruta?tipo=destino&slug=a&presupuesto=150&dias=2&quitar=5%2C7",
    );
  });
});
