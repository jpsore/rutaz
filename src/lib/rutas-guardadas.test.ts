import { beforeEach, describe, expect, it } from "vitest";
import { ErrorAlmacen, LocalStore, type NuevaRuta } from "./rutas-guardadas";

class MemoriaStorage implements Storage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  clear() { this.m.clear(); }
  getItem(k: string) { return this.m.get(k) ?? null; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  removeItem(k: string) { this.m.delete(k); }
  setItem(k: string, v: string) { this.m.set(k, v); }
}

const nueva = (presupuesto = 300, quitadas: string[] = []): NuevaRuta => ({
  plan: { tipo: "destino", slug: "barranco", nombre: "Barranco", imagen: "/img/barranco.jpg", fechas: null, fecha_inicio: null },
  parametros: { presupuesto, dias: 1, paradas_quitadas: quitadas },
  snapshot: { nivel: "estandar", dias: [], total: 118, desglose: { transporte: 23, comida: 45, hospedaje: 0, actividad: 50 }, alcanza: true, diferencia: 182, sugerencias: [] },
});

describe("LocalStore", () => {
  let store: LocalStore;
  beforeEach(() => { store = new LocalStore(new MemoriaStorage()); });

  it("guarda, lista (más reciente primero), obtiene y borra", () => {
    const a = store.guardar(nueva(150), new Date("2026-10-06T10:00:00Z")).ruta;
    const b = store.guardar(nueva(300), new Date("2026-10-06T11:00:00Z")).ruta;
    expect(store.listar().map((r) => r.id)).toEqual([b.id, a.id]);
    expect(store.obtener(a.id)?.parametros.presupuesto).toBe(150);
    store.borrar(a.id);
    expect(store.listar().map((r) => r.id)).toEqual([b.id]);
  });

  it("no duplica la misma combinación en menos de un minuto", () => {
    const t = new Date("2026-10-06T10:00:00Z");
    const r1 = store.guardar(nueva(300, ["2", "1"]), t);
    const r2 = store.guardar(nueva(300, ["1", "2"]), new Date(t.getTime() + 30_000));
    expect(r2.nueva).toBe(false);
    expect(r2.ruta.id).toBe(r1.ruta.id);
    expect(store.listar()).toHaveLength(1);
    const r3 = store.guardar(nueva(300, ["1", "2"]), new Date(t.getTime() + 61_000));
    expect(r3.nueva).toBe(true);
  });

  it("sin localStorage avisa con ErrorAlmacen", () => {
    expect(() => new LocalStore(null).guardar(nueva())).toThrow(ErrorAlmacen);
    expect(new LocalStore(null).listar()).toEqual([]);
  });
});
