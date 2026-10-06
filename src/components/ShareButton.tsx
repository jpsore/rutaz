"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { armarLinkCompartido } from "@/lib/compartir";
import type { TipoPlan } from "@/lib/contenido/tipos";
import { IconoCompartir } from "./iconos";
import { BottomSheet } from "./ui/BottomSheet";
import { clasesBoton } from "./ui/Button";

type Props = {
  path: string; // "/destino/x" o "/planificar/ruta?…"
  plan: { tipo: TipoPlan; slug: string };
  titulo: string;
  texto: string;
  origen: "itinerario" | "ficha" | "mis-rutas";
  forma?: "icono" | "boton";
  className?: string;
};

/** Menú nativo de compartir; si no hay, copia el link; si tampoco, lo muestra para copiarlo a mano. */
export function ShareButton({ path, plan, titulo, texto, origen, forma = "boton", className = "" }: Props) {
  const [aviso, setAviso] = useState<string | null>(null);
  const [linkManual, setLinkManual] = useState<string | null>(null);

  function mostrarAviso(t: string) {
    setAviso(t);
    window.setTimeout(() => setAviso(null), 2500);
  }

  async function copiar(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      track("share_completed", { metodo: "copiar" });
      mostrarAviso("Link copiado ✓");
    } catch {
      setLinkManual(url);
    }
  }

  async function compartir() {
    track("share_click", { origen, tipo: plan.tipo, slug: plan.slug });
    const url = new URL(armarLinkCompartido(path, plan), window.location.origin).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        track("share_completed", { metodo: "nativo" });
      } catch (e) {
        // Cancelar el menú no es un error.
        if (e instanceof DOMException && e.name === "AbortError") return;
        await copiar(url);
      }
      return;
    }
    await copiar(url);
  }

  return (
    <>
      {forma === "icono" ? (
        <button
          type="button"
          onClick={compartir}
          aria-label="Compartir"
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-superficie/95 text-texto shadow-sm hover:bg-superficie ${className}`}
        >
          <IconoCompartir />
        </button>
      ) : (
        <button type="button" onClick={compartir} className={clasesBoton("secundario", true, className)}>
          <IconoCompartir />
          Compartir
        </button>
      )}

      {aviso && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-[calc(150px+env(safe-area-inset-bottom))] z-50 mx-auto w-fit rounded-full bg-texto px-5 py-3 font-semibold text-white shadow-lg"
        >
          {aviso}
        </div>
      )}

      <BottomSheet abierto={linkManual !== null} onCerrar={() => setLinkManual(null)} titulo="Copia el link">
        <h2 className="pr-10 text-xl font-bold">Copia el link</h2>
        <p className="mt-1 text-texto-suave">Mantén presionado el link para copiarlo y pégalo en WhatsApp.</p>
        <input
          readOnly
          value={linkManual ?? ""}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Link para compartir"
          className="mt-4 min-h-12 w-full rounded-[14px] border border-borde bg-fondo px-4 text-base"
        />
      </BottomSheet>
    </>
  );
}
