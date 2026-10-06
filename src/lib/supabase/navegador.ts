"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

let cliente: SupabaseClient | null = null;

/** Cliente del navegador con la clave anon. Solo inserta (eventos y correos); no hay Auth. */
export function clienteNavegador(): SupabaseClient | null {
  if (!supabaseConfigurado()) return null;
  cliente ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    // keepalive: el evento llega aunque la persona cambie de página o cierre
    global: { fetch: (input, init) => fetch(input, { ...init, keepalive: true }) },
  });
  return cliente;
}
