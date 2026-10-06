// Filas de las tablas de contenido (ver supabase/migrations/0001_contenido.sql).

export type TipoPlan = "evento" | "destino" | "tematica";
export const TIPOS_PLAN: TipoPlan[] = ["evento", "destino", "tematica"];

export type Destino = {
  slug: string;
  nombre: string;
  zona: string;
  imagen_url: string;
  que_es: string;
  como_llegar: string;
  tiempo_desde_lima_min: number;
  mejor_epoca: string;
  meses_ideales: number[];
  meses_evitar: number[];
  altitud_m: number | null;
  dificultad: "baja" | "media" | "alta";
  dias_minimos: number;
};

export type Evento = {
  slug: string;
  nombre: string;
  destino_slug: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_confirmada: boolean;
  fecha_aprox: string | null;
  imagen_url: string;
  que_es: string;
};

export type Tematica = {
  slug: string;
  nombre: string;
  imagen_url: string;
  que_es: string;
  lugares: string[];
  destino_slug: string | null;
};

export type Feriado = {
  fecha: string;
  nombre: string;
  es_largo: boolean;
  nota: string | null;
};

export type MonthPick = {
  id: number;
  mes: string; // "2026-10-01"
  tipo: TipoPlan;
  evento_slug: string | null;
  destino_slug: string | null;
  tematica_slug: string | null;
  temporada: string | null;
  por_que_ahora: string;
  etiqueta: "joya-escondida" | "popular" | null;
  orden: number;
};

export type Aviso = {
  id: number;
  titulo: string;
  detalle: string;
  desde: string;
  hasta: string;
  destino_slugs: string[];
};

export type PlantillaFila = {
  id: number;
  tipo: TipoPlan;
  evento_slug: string | null;
  destino_slug: string | null;
  tematica_slug: string | null;
  dias: number;
};

export type ParadaFila = {
  id: number;
  template_id: number;
  dia: number;
  orden: number;
  hora: string;
  actividad: string;
  detalle: string | null;
  categoria: "transporte" | "comida" | "hospedaje" | "actividad";
  costo_economico: number;
  costo_estandar: number;
  costo_comodo: number;
  opcional: boolean;
  verificado_el: string | null;
};

/** Todo el contenido publicado (es chico: se carga entero y se cachea una hora). */
export type Contenido = {
  destinos: Destino[];
  eventos: Evento[];
  tematicas: Tematica[];
  feriados: Feriado[];
  picks: MonthPick[];
  avisos: Aviso[];
  plantillas: PlantillaFila[];
  paradas: ParadaFila[];
};
