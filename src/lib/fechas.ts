// Fechas siempre en la zona de Lima. Las fechas "de calendario" viajan como texto "AAAA-MM-DD".

export const ZONA_LIMA = "America/Lima";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Fecha de hoy en Lima, "AAAA-MM-DD", sin importar la zona del servidor. */
export function hoyLima(ahora: Date = new Date()): string {
  // en-CA da el formato AAAA-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_LIMA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

/** Mes actual en Lima, "AAAA-MM". */
export function mesActualLima(ahora: Date = new Date()): string {
  return hoyLima(ahora).slice(0, 7);
}

export function esMesValido(yyyyMm: string): boolean {
  const m = /^(\d{4})-(\d{2})$/.exec(yyyyMm);
  if (!m) return false;
  const mes = Number(m[2]);
  return mes >= 1 && mes <= 12;
}

function partes(yyyyMm: string): [number, number] {
  const [a, m] = yyyyMm.split("-").map(Number);
  return [a, m];
}

/** Suma (o resta) meses a "AAAA-MM". */
export function sumarMeses(yyyyMm: string, n: number): string {
  const [a, m] = partes(yyyyMm);
  const total = a * 12 + (m - 1) + n;
  const anio = Math.floor(total / 12);
  const mes = (total % 12) + 1;
  return `${anio}-${String(mes).padStart(2, "0")}`;
}

/** Diferencia en meses entre dos "AAAA-MM" (b - a). */
export function mesesEntre(a: string, b: string): number {
  const [aa, am] = partes(a);
  const [ba, bm] = partes(b);
  return ba * 12 + bm - (aa * 12 + am);
}

/** Primer y último día del mes. */
export function rangoDelMes(yyyyMm: string): { inicio: string; fin: string } {
  const [a, m] = partes(yyyyMm);
  const ultimo = new Date(Date.UTC(a, m, 0)).getUTCDate();
  const mm = String(m).padStart(2, "0");
  return { inicio: `${a}-${mm}-01`, fin: `${a}-${mm}-${String(ultimo).padStart(2, "0")}` };
}

function aUTC(fecha: string): Date {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d));
}

/** Días de b menos a (fechas "AAAA-MM-DD"). */
export function diasEntre(a: string, b: string): number {
  return Math.round((aUTC(b).getTime() - aUTC(a).getTime()) / 86_400_000);
}

export function sumarDias(fecha: string, n: number): string {
  const d = aUTC(fecha);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** ¿Se cruzan los rangos [a1, a2] y [b1, b2]? (inclusive) */
export function seCruzan(a1: string, a2: string, b1: string, b2: string): boolean {
  return a1 <= b2 && b1 <= a2;
}

/** "octubre" */
export function nombreMes(yyyyMm: string): string {
  return MESES[partes(yyyyMm)[1] - 1];
}

/** "28 sep" */
export function formatoFechaCorta(fecha: string): string {
  const d = aUTC(fecha);
  return `${d.getUTCDate()} ${MESES_CORTOS[d.getUTCMonth()]}`;
}

/** "3 – 6 oct", "29 oct – 2 nov" o "31 oct" si es un solo día. */
export function formatoRango(inicio: string, fin: string): string {
  if (inicio === fin) return formatoFechaCorta(inicio);
  const a = aUTC(inicio);
  const b = aUTC(fin);
  const mismoMes = a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear();
  if (mismoMes) return `${a.getUTCDate()} – ${b.getUTCDate()} ${MESES_CORTOS[b.getUTCMonth()]}`;
  return `${formatoFechaCorta(inicio)} – ${formatoFechaCorta(fin)}`;
}

/** "Jue 8 de octubre" */
export function formatoDiaLargo(fecha: string): string {
  const d = aUTC(fecha);
  return `${DIAS_CORTOS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

/** Inicial de cada mes para el calendario "Cuándo ir". */
export const INICIALES_MESES = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
export const NOMBRES_MESES = MESES;
