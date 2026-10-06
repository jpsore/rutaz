// Lógica pura sobre el contenido ya cargado. Sin base de datos: fácil de probar.
import { formatoRango, rangoDelMes, seCruzan, sumarDias } from "../fechas";
import type { Plantilla } from "../planner";
import type {
  Aviso,
  Contenido,
  Destino,
  Evento,
  Feriado,
  MonthPick,
  ParadaFila,
  PlantillaFila,
  Tematica,
  TipoPlan,
} from "./tipos";

export const MAX_AVISOS_INICIO = 3;
/** La ficha muestra avisos vigentes o que empiezan dentro de estos días. */
export const DIAS_AVISOS_FUTUROS = 60;

export const TITULOS_BLOQUE: Record<TipoPlan, string> = {
  evento: "Fiestas y eventos",
  destino: "Destinos en su mejor momento",
  tematica: "Rutas temáticas",
};

export const RUTA_TIPO: Record<TipoPlan, string> = {
  evento: "evento",
  destino: "destino",
  tematica: "ruta-tematica",
};

export function rutaFicha(tipo: TipoPlan, slug: string): string {
  return `/${RUTA_TIPO[tipo]}/${slug}`;
}

export function rutaPlanificador(tipo: TipoPlan, slug: string): string {
  return `/planificar?tipo=${tipo}&slug=${encodeURIComponent(slug)}`;
}

export function esTipoPlan(valor: unknown): valor is TipoPlan {
  return valor === "evento" || valor === "destino" || valor === "tematica";
}

function slugDe(fila: { evento_slug: string | null; destino_slug: string | null; tematica_slug: string | null }) {
  return fila.evento_slug ?? fila.destino_slug ?? fila.tematica_slug ?? "";
}

export function textoFechaEvento(e: Pick<Evento, "fecha_inicio" | "fecha_fin" | "fecha_confirmada" | "fecha_aprox">): string {
  if (!e.fecha_confirmada) return `Fecha por confirmar · ${e.fecha_aprox ?? "pronto"}`;
  return formatoRango(e.fecha_inicio, e.fecha_fin);
}

// ---------------------------------------------------------------------------
// Plantillas
// ---------------------------------------------------------------------------

function aPlantilla(fila: PlantillaFila, paradas: ParadaFila[]): Plantilla {
  return {
    id: String(fila.id),
    dias: fila.dias,
    paradas: paradas
      .filter((p) => p.template_id === fila.id)
      .map((p) => ({
        id: String(p.id),
        dia: p.dia,
        orden: p.orden,
        hora: p.hora,
        actividad: p.actividad,
        detalle: p.detalle,
        categoria: p.categoria,
        costos: { economico: p.costo_economico, estandar: p.costo_estandar, comodo: p.costo_comodo },
        opcional: p.opcional,
        verificado_el: p.verificado_el,
      })),
  };
}

/** Plantillas del plan. Un evento sin plantillas propias usa las de su destino. */
export function plantillasDelPlan(c: Contenido, tipo: TipoPlan, slug: string): Plantilla[] {
  const propias = c.plantillas.filter((t) => t.tipo === tipo && slugDe(t) === slug);
  if (propias.length > 0 || tipo !== "evento") {
    return propias.map((t) => aPlantilla(t, c.paradas)).sort((a, b) => a.dias - b.dias);
  }
  const evento = c.eventos.find((e) => e.slug === slug);
  if (!evento) return [];
  return plantillasDelPlan(c, "destino", evento.destino_slug);
}

export function puedePlanificar(c: Contenido, tipo: TipoPlan, slug: string): boolean {
  return plantillasDelPlan(c, tipo, slug).length > 0;
}

// ---------------------------------------------------------------------------
// Resumen de un plan (cabecera del planificador, itinerario, compartir)
// ---------------------------------------------------------------------------

export type ResumenPlan = {
  tipo: TipoPlan;
  slug: string;
  nombre: string;
  /** "Fiesta del Agua · San Pedro de Casta" para eventos. */
  titulo: string;
  imagen: string;
  fechas: string | null; // solo eventos
  destinoSlug: string | null;
  evento: Evento | null;
};

export function resumenPlan(c: Contenido, tipo: TipoPlan, slug: string): ResumenPlan | null {
  if (tipo === "evento") {
    const e = c.eventos.find((x) => x.slug === slug);
    if (!e) return null;
    const d = c.destinos.find((x) => x.slug === e.destino_slug);
    return {
      tipo, slug, nombre: e.nombre, titulo: d ? `${e.nombre} · ${d.nombre}` : e.nombre,
      imagen: e.imagen_url, fechas: textoFechaEvento(e), destinoSlug: e.destino_slug, evento: e,
    };
  }
  if (tipo === "destino") {
    const d = c.destinos.find((x) => x.slug === slug);
    if (!d) return null;
    return { tipo, slug, nombre: d.nombre, titulo: d.nombre, imagen: d.imagen_url, fechas: null, destinoSlug: d.slug, evento: null };
  }
  const t = c.tematicas.find((x) => x.slug === slug);
  if (!t) return null;
  return { tipo, slug, nombre: t.nombre, titulo: t.nombre, imagen: t.imagen_url, fechas: null, destinoSlug: t.destino_slug, evento: null };
}

// ---------------------------------------------------------------------------
// "Este mes"
// ---------------------------------------------------------------------------

export type Tarjeta = {
  tipo: TipoPlan;
  slug: string;
  nombre: string;
  imagen: string;
  fecha: string | null;
  porQueAhora: string;
  etiqueta: MonthPick["etiqueta"];
  ahora: boolean;
  puedePlanificar: boolean;
};

export type Bloque = { tipo: TipoPlan; titulo: string; tarjetas: Tarjeta[] };

export type VistaMes = {
  mes: string;
  bloques: Bloque[];
  feriados: Feriado[];
  avisos: Aviso[];
  vacio: boolean;
};

function tarjetaDe(c: Contenido, pick: MonthPick, hoy: string): Tarjeta | null {
  const slug = slugDe(pick);
  const base = { tipo: pick.tipo, slug, porQueAhora: pick.por_que_ahora, etiqueta: pick.etiqueta, puedePlanificar: puedePlanificar(c, pick.tipo, slug) };
  if (pick.tipo === "evento") {
    const e = c.eventos.find((x) => x.slug === slug);
    if (!e || e.fecha_fin < hoy) return null; // eventos pasados no se muestran
    return { ...base, nombre: e.nombre, imagen: e.imagen_url, fecha: textoFechaEvento(e), ahora: e.fecha_inicio <= hoy && hoy <= e.fecha_fin };
  }
  if (pick.tipo === "destino") {
    const d = c.destinos.find((x) => x.slug === slug);
    if (!d) return null;
    return { ...base, nombre: d.nombre, imagen: d.imagen_url, fecha: pick.temporada ?? d.mejor_epoca, ahora: false };
  }
  const t = c.tematicas.find((x) => x.slug === slug);
  if (!t) return null;
  return { ...base, nombre: t.nombre, imagen: t.imagen_url, fecha: pick.temporada, ahora: false };
}

/** Arma "¿Qué hay en {mes}?". `hoy` es la fecha de Lima. */
export function armarMes(c: Contenido, mes: string, hoy: string): VistaMes {
  const { inicio, fin } = rangoDelMes(mes);
  const picks = c.picks.filter((p) => p.mes === inicio).sort((a, b) => a.orden - b.orden);

  const bloques: Bloque[] = (["evento", "destino", "tematica"] as TipoPlan[])
    .map((tipo) => ({
      tipo,
      titulo: TITULOS_BLOQUE[tipo],
      tarjetas: picks
        .filter((p) => p.tipo === tipo)
        .map((p) => tarjetaDe(c, p, hoy))
        .filter((t): t is Tarjeta => t !== null),
    }))
    .filter((b) => b.tarjetas.length > 0);

  const feriados = c.feriados
    .filter((f) => f.es_largo && f.fecha >= inicio && f.fecha <= fin && f.fecha >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const avisos = c.avisos
    .filter((a) => seCruzan(a.desde, a.hasta, inicio, fin) && a.hasta >= hoy)
    .sort((a, b) => a.desde.localeCompare(b.desde))
    .slice(0, MAX_AVISOS_INICIO);

  return { mes, bloques, feriados, avisos, vacio: bloques.length === 0 };
}

// ---------------------------------------------------------------------------
// Ficha
// ---------------------------------------------------------------------------

/** Avisos de un destino vigentes o que empiezan dentro de 60 días. */
export function avisosDelDestino(c: Contenido, destinoSlug: string | null, hoy: string): Aviso[] {
  if (!destinoSlug) return [];
  const limite = sumarDias(hoy, DIAS_AVISOS_FUTUROS);
  return c.avisos
    .filter((a) => a.destino_slugs.includes(destinoSlug) && a.hasta >= hoy && a.desde <= limite)
    .sort((a, b) => a.desde.localeCompare(b.desde));
}

/** Avisos que tocan las fechas del plan (eventos) o los próximos 60 días (resto). */
export function avisosDelPlan(c: Contenido, plan: ResumenPlan, hoy: string): Aviso[] {
  if (!plan.destinoSlug) return [];
  if (plan.evento) {
    const { fecha_inicio, fecha_fin } = plan.evento;
    return c.avisos.filter(
      (a) => a.destino_slugs.includes(plan.destinoSlug!) && seCruzan(a.desde, a.hasta, fecha_inicio, fecha_fin) && a.hasta >= hoy,
    );
  }
  return avisosDelDestino(c, plan.destinoSlug, hoy);
}

export type Tramo = { id: string; actividad: string; detalle: string | null; verificado_el: string };

export type Ficha = {
  tipo: TipoPlan;
  slug: string;
  nombre: string;
  imagen: string;
  queEs: string;
  /** Destino del que salen altitud, dificultad, calendario y cómo llegar. */
  destino: Destino | null;
  evento: Evento | null;
  tematica: Tematica | null;
  cuandoIr: string;
  porQueAhora: string | null;
  avisos: Aviso[];
  tramos: Tramo[];
  puedePlanificar: boolean;
};

export function armarFicha(c: Contenido, tipo: TipoPlan, slug: string, mes: string, hoy: string): Ficha | null {
  const plan = resumenPlan(c, tipo, slug);
  if (!plan) return null;
  const destino = plan.destinoSlug ? c.destinos.find((d) => d.slug === plan.destinoSlug) ?? null : null;
  const tematica = tipo === "tematica" ? c.tematicas.find((t) => t.slug === slug) ?? null : null;
  const queEs = plan.evento?.que_es ?? tematica?.que_es ?? destino?.que_es ?? "";

  const pick = c.picks.find((p) => p.mes === `${mes}-01` && p.tipo === tipo && slugDe(p) === slug);

  const plantillas = plantillasDelPlan(c, tipo, slug);
  const masCorta = plantillas[0];
  const tramos: Tramo[] = (masCorta?.paradas ?? [])
    .filter((p) => p.categoria === "transporte" && p.verificado_el)
    .sort((a, b) => a.dia - b.dia || a.orden - b.orden)
    .map((p) => ({ id: p.id, actividad: p.actividad, detalle: p.detalle, verificado_el: p.verificado_el! }));

  return {
    tipo,
    slug,
    nombre: plan.nombre,
    imagen: plan.imagen,
    queEs,
    destino,
    evento: plan.evento,
    tematica,
    cuandoIr: plan.evento ? textoFechaEvento(plan.evento) : destino?.mejor_epoca ?? "Todo el año",
    porQueAhora: pick?.por_que_ahora ?? null,
    avisos: avisosDelDestino(c, plan.destinoSlug, hoy),
    tramos,
    puedePlanificar: plantillas.length > 0,
  };
}

/** "4 h" o "45 min" */
export function formatoDuracion(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
