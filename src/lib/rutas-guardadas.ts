// Rutas guardadas en el celular (spec 05). En R2 se suma un SupabaseStore con la misma interfaz.
import { escribirJSON, leerJSON, nuevoId } from "./almacen";
import type { TipoPlan } from "./contenido/tipos";
import type { Resultado } from "./planner";

export const CLAVE_RUTAS = "rutaz.rutas.v1";
/** Guardar la misma combinación dentro de este tiempo no crea otra ruta. */
export const VENTANA_DUPLICADO_MS = 60_000;

export type RutaGuardada = {
  id: string;
  creada_en: string; // ISO
  plan: {
    tipo: TipoPlan;
    slug: string;
    nombre: string;
    imagen: string;
    fechas: string | null; // "3 – 6 oct" o "Fecha por confirmar · …"
    fecha_inicio: string | null; // para abrir "hoy" durante el viaje
  };
  parametros: { presupuesto: number; dias: number; paradas_quitadas: string[] };
  snapshot: Resultado;
};

export type NuevaRuta = Omit<RutaGuardada, "id" | "creada_en">;

export interface AlmacenRutas {
  listar(): RutaGuardada[];
  obtener(id: string): RutaGuardada | null;
  /** Lanza ErrorAlmacen si no se puede guardar en este celular. */
  guardar(ruta: NuevaRuta, ahora?: Date): { ruta: RutaGuardada; nueva: boolean };
  borrar(id: string): void;
}

export class ErrorAlmacen extends Error {
  constructor() {
    super("No se pudo guardar en este celular");
    this.name = "ErrorAlmacen";
  }
}

export function claveCombinacion(r: Pick<RutaGuardada, "plan" | "parametros">): string {
  const q = [...r.parametros.paradas_quitadas].sort().join(",");
  return `${r.plan.tipo}|${r.plan.slug}|${r.parametros.dias}|${r.parametros.presupuesto}|${q}`;
}

export class LocalStore implements AlmacenRutas {
  constructor(private readonly storage: Storage | null) {}

  private leer(): RutaGuardada[] {
    const v = leerJSON<RutaGuardada[]>(this.storage, CLAVE_RUTAS);
    return Array.isArray(v) ? v : [];
  }

  listar(): RutaGuardada[] {
    return this.leer().sort((a, b) => b.creada_en.localeCompare(a.creada_en));
  }

  obtener(id: string): RutaGuardada | null {
    return this.leer().find((r) => r.id === id) ?? null;
  }

  guardar(nueva: NuevaRuta, ahora: Date = new Date()): { ruta: RutaGuardada; nueva: boolean } {
    if (!this.storage) throw new ErrorAlmacen();
    const rutas = this.leer();
    const clave = claveCombinacion(nueva);
    const reciente = rutas.find(
      (r) => claveCombinacion(r) === clave && ahora.getTime() - new Date(r.creada_en).getTime() < VENTANA_DUPLICADO_MS,
    );
    if (reciente) return { ruta: reciente, nueva: false };

    const ruta: RutaGuardada = { ...nueva, id: nuevoId(), creada_en: ahora.toISOString() };
    if (!escribirJSON(this.storage, CLAVE_RUTAS, [...rutas, ruta])) throw new ErrorAlmacen();
    return { ruta, nueva: true };
  }

  borrar(id: string): void {
    escribirJSON(this.storage, CLAVE_RUTAS, this.leer().filter((r) => r.id !== id));
  }
}
