const formato = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

/** "S/ 1,250" (soles enteros, formato es-PE). */
export function soles(monto: number): string {
  return `S/ ${formato.format(Math.round(monto))}`;
}
