"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { rutaFicha, rutaPlanificador, type Tarjeta } from "@/lib/contenido/consultas";
import { clasesBoton } from "./Button";
import { Imagen } from "./Imagen";
import { Tag } from "./Tag";

type Props = { tarjeta: Tarjeta; mes: string; prioridad?: boolean };

/** Tarjeta del mes: tocarla abre la ficha; el botón va al planificador. */
export function PlanCard({ tarjeta: t, mes, prioridad }: Props) {
  const bloque = t.tipo;
  const porConfirmar = t.fecha?.startsWith("Fecha por confirmar");
  return (
    <article className="relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-borde bg-superficie">
      <div className="relative">
        <Imagen src={t.imagen} alt={t.nombre} sizes="280px" priority={prioridad} className="aspect-[4/3] w-full" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {t.ahora && <Tag tipo="ahora" />}
          {t.etiqueta && <Tag tipo={t.etiqueta} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {t.fecha && (
          <p className={`text-sm font-semibold ${porConfirmar ? "text-aviso" : "text-acento-fuerte"}`}>{t.fecha}</p>
        )}
        <h3 className="mt-1 text-lg font-bold leading-tight">
          <Link
            href={`${rutaFicha(t.tipo, t.slug)}?mes=${mes}`}
            onClick={() => track("card_open", { tipo: t.tipo, slug: t.slug, bloque })}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-acento"
          >
            {t.nombre}
          </Link>
        </h3>
        <p className="mt-1 text-[15px] leading-snug text-texto-suave">{t.porQueAhora}</p>
        <div className="mt-auto pt-4">
          {t.puedePlanificar && (
            <Link
              href={rutaPlanificador(t.tipo, t.slug)}
              onClick={() => track("card_cta_click", { tipo: t.tipo, slug: t.slug, bloque, origen: "inicio" })}
              className={clasesBoton("principal", false, "relative z-10 w-full")}
            >
              Armar mi ruta con esto
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
