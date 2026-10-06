import { formatoRango } from "@/lib/fechas";
import { IconoAviso } from "../iconos";

type Props = { titulo: string; detalle: string; desde: string; hasta: string; tono?: "aviso" | "info" };

/** Aviso suave: qué pasa, dónde y en qué fechas. */
export function AlertBanner({ titulo, detalle, desde, hasta, tono = "aviso" }: Props) {
  const clases = tono === "aviso" ? "bg-aviso-suave border-[#f5d9b8]" : "bg-acento-suave border-[#d9d2fd]";
  return (
    <div role="note" className={`flex gap-3 rounded-2xl border px-4 py-3 ${clases}`}>
      <IconoAviso className={`mt-0.5 h-5 w-5 shrink-0 ${tono === "aviso" ? "text-aviso" : "text-acento"}`} />
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-snug">{titulo}</p>
        <p className="mt-0.5 text-sm leading-snug text-texto-suave">
          <span className="font-semibold text-texto">{formatoRango(desde, hasta)}</span> · {detalle}
        </p>
      </div>
    </div>
  );
}
