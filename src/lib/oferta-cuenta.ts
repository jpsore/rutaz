// Frecuencia del sheet "Sí, avísame" (spec 06).

export const CLAVE_OFERTA = "rutaz.oferta_cuenta.v1";
export const DIAS_SIN_MOSTRAR = 7;

export type EstadoOferta = { cerrado_en?: string; correo_dejado?: true };

export function debeMostrarOferta(estado: EstadoOferta | null | undefined, ahora: Date): boolean {
  if (!estado) return true;
  if (estado.correo_dejado) return false;
  if (!estado.cerrado_en) return true;
  const cerrado = new Date(estado.cerrado_en).getTime();
  if (Number.isNaN(cerrado)) return true;
  return ahora.getTime() - cerrado >= DIAS_SIN_MOSTRAR * 86_400_000;
}

/** Misma regla que el check de la base (account_interest.correo). */
export function correoValido(correo: string): boolean {
  const c = correo.trim();
  return c.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c);
}
