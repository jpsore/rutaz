import { INICIALES_MESES, NOMBRES_MESES } from "@/lib/fechas";

type Props = { ideales: number[]; evitar: number[]; mesActual: number };

/** Fila E F M A M J J A S O N D con meses ideales, a evitar y el actual. */
export function CalendarioMeses({ ideales, evitar, mesActual }: Props) {
  return (
    <div>
      <ol className="grid grid-cols-12 gap-1" aria-label="Meses para ir">
        {INICIALES_MESES.map((inicial, i) => {
          const mes = i + 1;
          const ideal = ideales.includes(mes);
          const malo = evitar.includes(mes);
          const actual = mes === mesActual;
          const estado = ideal ? "ideal" : malo ? "evitar: lluvias" : "regular";
          return (
            <li
              key={mes}
              aria-label={`${NOMBRES_MESES[i]}: ${estado}${actual ? " (este mes)" : ""}`}
              className={[
                "flex h-9 items-center justify-center rounded-md text-xs font-bold",
                ideal ? "bg-secundario text-white" : malo ? "bg-gris text-texto-suave" : "border border-borde bg-superficie text-texto",
                actual ? "outline-2 outline-offset-2 outline-acento" : "",
              ].join(" ")}
            >
              {inicial}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-texto-suave">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-secundario" aria-hidden="true" /> Ideal
        </span>
        {evitar.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-gris ring-1 ring-borde" aria-hidden="true" /> Evitar: lluvias
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm outline-2 outline-acento" aria-hidden="true" /> Este mes
        </span>
      </div>
    </div>
  );
}
