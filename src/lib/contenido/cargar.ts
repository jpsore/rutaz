import "server-only";
import { cache } from "react";
import { clienteServidor } from "../supabase/servidor";
import { supabaseConfigurado } from "../supabase/config";
import { contenidoLocal } from "./seed-local";
import type { Contenido } from "./tipos";

async function desdeSupabase(): Promise<Contenido> {
  const db = clienteServidor();
  const [destinos, eventos, tematicas, feriados, picks, avisos, plantillas, paradas] = await Promise.all([
    db.from("destinations").select("*").eq("publicado", true),
    db.from("festivities").select("*").eq("publicado", true),
    db.from("themes").select("*").eq("publicado", true),
    db.from("holidays").select("*"),
    db.from("month_picks").select("*"),
    db.from("alerts").select("*").eq("publicado", true),
    db.from("itinerary_templates").select("*").eq("publicado", true),
    db.from("template_stops").select("*"),
  ]);
  const error = [destinos, eventos, tematicas, feriados, picks, avisos, plantillas, paradas].find((r) => r.error)?.error;
  if (error) throw new Error(`No se pudo leer el contenido: ${error.message}`);
  return {
    destinos: destinos.data ?? [],
    eventos: eventos.data ?? [],
    tematicas: tematicas.data ?? [],
    feriados: feriados.data ?? [],
    picks: picks.data ?? [],
    avisos: avisos.data ?? [],
    plantillas: plantillas.data ?? [],
    paradas: paradas.data ?? [],
  };
}

/**
 * Todo el contenido publicado. Con Supabase configurado lo lee de ahí (cacheado 1 h);
 * sin Supabase, fuera de producción, usa la copia local del seed para poder desarrollar y probar.
 */
export const cargarContenido = cache(async (): Promise<Contenido> => {
  if (process.env.RUTAZ_CONTENIDO_LOCAL === "1") return contenidoLocal; // pruebas
  if (supabaseConfigurado()) return desdeSupabase();
  if (process.env.NODE_ENV === "production") {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return contenidoLocal;
});
