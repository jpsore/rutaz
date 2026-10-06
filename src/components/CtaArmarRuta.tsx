"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { rutaPlanificador } from "@/lib/contenido/consultas";
import type { TipoPlan } from "@/lib/contenido/tipos";
import { clasesBoton } from "./ui/Button";

/** Botón fijo abajo (sobre la barra inferior), siempre visible. */
export function CtaArmarRuta({ tipo, slug }: { tipo: TipoPlan; slug: string }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-20">
      <div className="mx-auto max-w-[480px] border-t border-borde bg-fondo/95 px-5 py-3 backdrop-blur">
        <Link
          href={rutaPlanificador(tipo, slug)}
          onClick={() => track("card_cta_click", { tipo, slug, origen: "ficha" })}
          className={clasesBoton("principal", true, "w-full")}
        >
          Armar mi ruta con esto
        </Link>
      </div>
    </div>
  );
}
