import { soles } from "@/lib/dinero";
import { margenImprevistos, type Categoria, type Nivel, type Resultado } from "@/lib/planner";

export const NOMBRE_NIVEL: Record<Nivel, string> = { economico: "Económico", estandar: "Estándar", comodo: "Cómodo" };
const NOMBRE_CATEGORIA: Record<Categoria, string> = {
  transporte: "Transporte",
  comida: "Comida",
  hospedaje: "Hospedaje",
  actividad: "Entradas y actividades",
};

/** Total por persona, desglose y si alcanza. */
export function ResumenCosto({ r, presupuesto }: { r: Resultado; presupuesto: number }) {
  const presupuestoTexto = presupuesto === 500 ? "S/ 500+" : soles(presupuesto);
  return (
    <section aria-label="Costo estimado" className="rounded-2xl border border-borde bg-superficie p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-texto-suave">Costo estimado por persona</p>
          <p className={`text-[32px] font-bold leading-tight tracking-[-0.3px] ${r.alcanza ? "text-secundario" : "text-peligro"}`}>
            {soles(r.total)}
          </p>
        </div>
        <div className="shrink-0 whitespace-nowrap text-right text-sm text-texto-suave">
          <p>Tu presupuesto {presupuestoTexto}</p>
          <p className="mt-0.5">Nivel {NOMBRE_NIVEL[r.nivel].toLowerCase()}</p>
        </div>
      </div>

      <p
        className={`mt-3 rounded-xl px-3 py-2 font-semibold ${r.alcanza ? "bg-secundario-suave text-secundario" : "bg-peligro-suave text-peligro"}`}
      >
        {r.alcanza
          ? presupuesto === 500
            ? "Te alcanza ✓"
            : r.diferencia === 0
              ? "Te alcanza ✓ justo"
              : `Te alcanza ✓ · te sobran ${soles(r.diferencia)}`
          : `Te faltan ${soles(-r.diferencia)}`}
      </p>

      <dl className="mt-3 space-y-1.5">
        {(Object.keys(NOMBRE_CATEGORIA) as Categoria[]).map((c) => (
          <div key={c} className="flex justify-between text-[15px]">
            <dt className="text-texto-suave">{NOMBRE_CATEGORIA[c]}</dt>
            <dd className="font-semibold">{soles(r.desglose[c])}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-sm text-texto-suave">Costos de referencia por persona. Pueden variar.</p>
      <p className="mt-1 text-sm text-texto-suave">
        Suma un margen de imprevistos de 10 % ({soles(margenImprevistos(r.total))})
      </p>
    </section>
  );
}
