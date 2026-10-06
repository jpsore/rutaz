"use client";
import { useRouter } from "next/navigation";
import { IconoAtras } from "./iconos";

/** Vuelve a la pantalla anterior; si se llegó directo (TikTok), va a "Este mes". */
export function BotonVolver({ className = "" }: { className?: string }) {
  const router = useRouter();
  function volver() {
    const vieneDeLaApp = document.referrer.startsWith(window.location.origin) && window.history.length > 1;
    if (vieneDeLaApp) router.back();
    else router.push("/");
  }
  return (
    <button
      type="button"
      onClick={volver}
      className={`flex h-12 items-center gap-1 rounded-full bg-superficie/95 pl-3 pr-4 font-semibold text-texto shadow-sm hover:bg-superficie ${className}`}
    >
      <IconoAtras />
      Volver
    </button>
  );
}
