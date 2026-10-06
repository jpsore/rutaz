import { formatoDiaLargo } from "@/lib/fechas";
import type { Feriado } from "@/lib/contenido/tipos";
import { IconoCalendario } from "../iconos";

/** Franja destacada por cada feriado largo del mes. */
export function HolidayStrip({ feriados }: { feriados: Feriado[] }) {
  if (feriados.length === 0) return null;
  return (
    <section aria-label="Feriados largos" className="space-y-2">
      {feriados.map((f) => (
        <div key={f.fecha} className="flex items-start gap-3 rounded-2xl bg-secundario p-4 text-white">
          <IconoCalendario className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="leading-snug">
            <span className="font-bold">
              {formatoDiaLargo(f.fecha)} · {f.nombre}
            </span>
            {": "}
            {(f.nota ?? "Arma una escapada de fin de semana largo").replace(/^./, (c) => c.toLowerCase())}
          </p>
        </div>
      ))}
    </section>
  );
}
