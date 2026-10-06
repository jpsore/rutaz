import { soles } from "./dinero";
import type { TipoPlan } from "./contenido/tipos";

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/**
 * Agrega los UTM de "compartido" a un path o URL, reemplazando los UTM que ya tenga
 * (así un link que llegó de TikTok y se vuelve a compartir no arrastra el UTM viejo).
 */
export function armarLinkCompartido(pathOUrl: string, plan: { tipo: TipoPlan; slug: string }): string {
  const esAbsoluta = /^https?:\/\//.test(pathOUrl);
  const url = new URL(pathOUrl, "https://rutaz.local");
  for (const k of UTM) url.searchParams.delete(k);
  url.searchParams.delete("ttclid");
  url.searchParams.set("utm_source", "compartido");
  url.searchParams.set("utm_medium", "share");
  url.searchParams.set("utm_content", `${plan.tipo}-${plan.slug}`);
  return esAbsoluta ? url.toString() : `${url.pathname}${url.search}`;
}

export type ContextoCompartir =
  | { origen: "itinerario" | "mis-rutas"; plan: string; dias: number; total: number }
  | { origen: "ficha"; nombre: string };

export function textoCompartir(c: ContextoCompartir): string {
  if (c.origen === "ficha") return `Mira esto para este mes: ${c.nombre}`;
  return `Mira esta escapada: ${c.plan}, ${c.dias} ${c.dias === 1 ? "día" : "días"}, ${soles(c.total)} por persona`;
}

export type ParametrosRuta = {
  tipo: TipoPlan;
  slug: string;
  presupuesto: number;
  dias: number;
  quitadas?: string[];
};

/** Link del itinerario: reproducible desde la URL. */
export function rutaItinerario(p: ParametrosRuta): string {
  const q = new URLSearchParams({
    tipo: p.tipo,
    slug: p.slug,
    presupuesto: String(p.presupuesto),
    dias: String(p.dias),
  });
  if (p.quitadas && p.quitadas.length > 0) q.set("quitar", [...p.quitadas].sort().join(","));
  return `/planificar/ruta?${q.toString()}`;
}
