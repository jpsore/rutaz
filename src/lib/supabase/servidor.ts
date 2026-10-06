import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Segundos que se cachean las lecturas de contenido (los cambios del Table Editor se ven en máximo 1 h). */
export const REVALIDAR_CONTENIDO = 3600;

/** Cliente para Server Components: clave anon, sin sesión, lecturas cacheadas una hora. */
export function clienteServidor(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDAR_CONTENIDO } }),
    },
  });
}
