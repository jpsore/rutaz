"use client";
import { useState } from "react";
import type { LugarFila } from "@/lib/contenido/tipos";
import { soles } from "@/lib/dinero";
import { lugaresParaParada } from "@/lib/lugares";
import type { DiaItinerario, Nivel } from "@/lib/planner";
import { IconoChevronAbajo } from "../iconos";
import { TramoVerificado } from "../TramoVerificado";

type Props = {
  dias: DiaItinerario[];
  hoy: string;
  /** Ruta guardada: letra grande y cada día plegable. */
  plegable?: boolean;
  diaAbierto?: number | null;
  /** Lugares sugeridos por id de parada (solo en el itinerario) y nivel que eligió el motor. */
  lugares?: Record<string, LugarFila[]>;
  nivel?: Nivel;
};

type PropsParadas = Pick<Props, "lugares" | "nivel"> & { dia: DiaItinerario; hoy: string; grande: boolean };

function Paradas({ dia, hoy, grande, lugares, nivel }: PropsParadas) {
  return (
    <ol className="space-y-2">
      {dia.paradas.map((p) => {
        const sugeridos = nivel ? lugaresParaParada(lugares?.[p.id], p.categoria, nivel) : [];
        return (
          <li key={p.id} className="flex gap-3 rounded-xl border border-borde bg-superficie p-3">
            <span className={`w-12 shrink-0 font-bold tabular-nums text-acento-fuerte ${grande ? "text-lg" : ""}`}>{p.hora}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-semibold leading-snug ${grande ? "text-lg" : ""}`}>{p.actividad}</p>
                <p className={`shrink-0 font-semibold ${grande ? "text-lg" : ""}`}>{p.costo === 0 ? "Gratis" : soles(p.costo)}</p>
              </div>
              {p.detalle && <p className={`mt-0.5 text-texto-suave ${grande ? "text-base" : "text-sm"}`}>{p.detalle}</p>}
              {sugeridos.length > 0 && (
                <ul aria-label={`Lugares sugeridos: ${p.actividad}`} className="mt-2 space-y-1.5">
                  {sugeridos.map((l) => (
                    <li key={l.id} className="leading-snug">
                      <p className="text-[15px]">
                        <span className="font-semibold">{l.nombre}</span> · {l.precio}
                      </p>
                      <p className="text-xs text-texto-suave">{l.revisado}</p>
                    </li>
                  ))}
                </ul>
              )}
              {p.categoria === "transporte" && p.verificado_el && (
                <div className="mt-1">
                  <TramoVerificado fecha={p.verificado_el} hoy={hoy} />
                </div>
              )}
              {p.opcional && <p className="mt-1 text-sm text-texto-suave">Opcional</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ListaDias({ dias, hoy, plegable = false, diaAbierto = null, lugares, nivel }: Props) {
  const [abiertos, setAbiertos] = useState<Set<number>>(
    () => new Set(plegable ? (diaAbierto ? [diaAbierto] : dias.map((d) => d.dia)) : []),
  );

  if (!plegable) {
    return (
      <div className="space-y-6">
        {dias.map((d) => (
          <section key={d.dia} aria-labelledby={`dia-${d.dia}`}>
            <h2 id={`dia-${d.dia}`} className="mb-2 text-xl font-bold">
              Día {d.dia}
            </h2>
            <Paradas dia={d} hoy={hoy} grande={false} lugares={lugares} nivel={nivel} />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dias.map((d) => {
        const abierto = abiertos.has(d.dia);
        return (
          <section key={d.dia}>
            <button
              type="button"
              aria-expanded={abierto}
              onClick={() =>
                setAbiertos((s) => {
                  const n = new Set(s);
                  if (n.has(d.dia)) n.delete(d.dia);
                  else n.add(d.dia);
                  return n;
                })
              }
              className="flex min-h-14 w-full items-center justify-between rounded-xl bg-texto px-4 text-left text-xl font-bold text-white"
            >
              Día {d.dia}
              {d.dia === diaAbierto && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-sm">Hoy</span>}
              <IconoChevronAbajo className={`ml-auto h-6 w-6 transition-transform ${abierto ? "rotate-180" : ""}`} />
            </button>
            {abierto && (
              <div className="mt-2">
                <Paradas dia={d} hoy={hoy} grande />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
