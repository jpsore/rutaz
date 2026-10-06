"use client";
// Medición propia en Supabase (docs/medicion.md). No bloquea la UI y nunca lanza errores.
import { almacenLocal, almacenSesion, leerJSON, escribirJSON, nuevoId } from "./almacen";
import { clienteNavegador } from "./supabase/navegador";
import { esWebview } from "./webview";

export const EVENTOS = [
  "app_open",
  "month_view",
  "month_next_click",
  "card_open",
  "card_cta_click",
  "detail_view",
  "planner_view",
  "planner_submit",
  "itinerary_view",
  "suggestion_click",
  "route_saved",
  "saved_route_open",
  "saved_route_delete",
  "share_click",
  "share_completed",
  "account_offer_shown",
  "account_offer_dismissed",
  "account_interest_submitted",
] as const;

export type NombreEvento = (typeof EVENTOS)[number];

const CLAVE_ANON = "rutaz.anon_id";
const CLAVE_SESION = "rutaz.sesion";
const CLAVE_UTM = "rutaz.utm";
const SESION_MS = 30 * 60_000;

type Sesion = { id: string; ultimo: number };
type Utm = { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null; ttclid: string | null };

// Si no hay localStorage, el visitante vive mientras dure la pestaña.
let anonMemoria: string | null = null;
let sesionMemoria: Sesion | null = null;

export function anonId(): string {
  const s = almacenLocal();
  const guardado = s?.getItem(CLAVE_ANON);
  if (guardado) return guardado;
  const id = anonMemoria ?? nuevoId();
  anonMemoria = id;
  try {
    s?.setItem(CLAVE_ANON, id);
  } catch {
    /* sin almacenamiento */
  }
  return id;
}

/** Devuelve la sesión y si es nueva (para disparar app_open una vez por sesión). */
function sesion(ahora = Date.now()): { id: string; nueva: boolean } {
  const s = almacenSesion();
  const actual = leerJSON<Sesion>(s, CLAVE_SESION) ?? sesionMemoria;
  if (actual && ahora - actual.ultimo < SESION_MS) {
    const sig = { id: actual.id, ultimo: ahora };
    sesionMemoria = sig;
    escribirJSON(s, CLAVE_SESION, sig);
    return { id: actual.id, nueva: false };
  }
  const nueva = { id: nuevoId(), ultimo: ahora };
  sesionMemoria = nueva;
  escribirJSON(s, CLAVE_SESION, nueva);
  return { id: nueva.id, nueva: true };
}

/** UTM y ttclid: se leen de la URL en la primera página y quedan para toda la sesión. */
function utm(): Utm {
  const s = almacenSesion();
  const guardado = leerJSON<Utm>(s, CLAVE_UTM);
  if (guardado) return guardado;
  const q = new URLSearchParams(window.location.search);
  const valor: Utm = {
    utm_source: q.get("utm_source"),
    utm_medium: q.get("utm_medium"),
    utm_campaign: q.get("utm_campaign"),
    utm_content: q.get("utm_content"),
    ttclid: q.get("ttclid"),
  };
  escribirJSON(s, CLAVE_UTM, valor);
  return valor;
}

function enviar(nombre: NombreEvento, props: Record<string, unknown>, sessionId: string): void {
  const fila = {
    nombre,
    anon_id: anonId(),
    session_id: sessionId,
    user_id: null,
    ruta: window.location.pathname,
    props,
    ...utm(),
    es_webview: esWebview(navigator.userAgent),
  };
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", nombre, props);
    return;
  }
  const db = clienteNavegador();
  if (!db) return;
  void db.from("analytics_events").insert(fila).then(
    () => undefined,
    () => undefined,
  );
}

/** Registra un evento de docs/medicion.md. Si es el primero de la sesión, antes manda app_open. */
export function track(nombre: NombreEvento, props: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    utm(); // fija los UTM de la página de entrada
    const s = sesion();
    if (s.nueva && nombre !== "app_open") enviar("app_open", { entrada: window.location.pathname }, s.id);
    if (nombre === "app_open" && !s.nueva) return;
    enviar(nombre, props, s.id);
  } catch {
    // La medición nunca rompe la app.
  }
}

/** Se llama en el layout raíz: dispara app_open una vez por sesión. */
export function registrarApertura(): void {
  track("app_open", { entrada: typeof window === "undefined" ? "" : window.location.pathname });
}
