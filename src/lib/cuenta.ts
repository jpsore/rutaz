"use client";
import { anonId } from "./analytics";
import { almacenLocal, escribirJSON, leerJSON } from "./almacen";
import { CLAVE_OFERTA, debeMostrarOferta, type EstadoOferta } from "./oferta-cuenta";
import { clienteNavegador } from "./supabase/navegador";

export function leerEstadoOferta(): EstadoOferta | null {
  return leerJSON<EstadoOferta>(almacenLocal(), CLAVE_OFERTA);
}

export function tocaMostrarOferta(): boolean {
  return debeMostrarOferta(leerEstadoOferta(), new Date());
}

export function marcarOfertaCerrada(): void {
  escribirJSON(almacenLocal(), CLAVE_OFERTA, { ...leerEstadoOferta(), cerrado_en: new Date().toISOString() });
}

export function marcarCorreoDejado(): void {
  escribirJSON(almacenLocal(), CLAVE_OFERTA, { ...leerEstadoOferta(), correo_dejado: true });
}

/** Inserta en account_interest sin pedir la fila de vuelta (no hay política de lectura). */
export async function enviarCorreo(correo: string): Promise<boolean> {
  const db = clienteNavegador();
  if (!db) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[account_interest] sin Supabase, se simula el envío");
      return true;
    }
    return false;
  }
  try {
    const { error } = await db.from("account_interest").insert({ correo: correo.trim(), anon_id: anonId(), acepta_avisos: true });
    return !error;
  } catch {
    return false;
  }
}
