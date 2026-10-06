import { diasEntre, formatoFechaCorta } from "./fechas";

/** Más de estos días desde la verificación pide "Confirmar antes de viajar". */
export const DIAS_VIGENCIA_VERIFICACION = 60;

export type EstadoVerificacion = {
  texto: string; // "Verificado: 28 sep"
  confirmarAntes: boolean;
};

/** Regla única para fichas e itinerarios. Fechas "AAAA-MM-DD"; `hoy` en Lima. */
export function estadoVerificacion(fecha: string, hoy: string): EstadoVerificacion {
  return {
    texto: `Verificado: ${formatoFechaCorta(fecha)}`,
    confirmarAntes: diasEntre(fecha, hoy) > DIAS_VIGENCIA_VERIFICACION,
  };
}
