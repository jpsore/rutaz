import "server-only";

/**
 * Hora actual del servidor. Solo en modo de pruebas (contenido local) se puede fijar con
 * RUTAZ_AHORA para que los tests de Playwright no dependan del día en que corren.
 */
export function ahora(): Date {
  const fijo = process.env.RUTAZ_AHORA;
  if (fijo && process.env.RUTAZ_CONTENIDO_LOCAL === "1") return new Date(fijo);
  return new Date();
}
