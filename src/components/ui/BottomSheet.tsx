"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { IconoCerrar } from "../iconos";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
};

/** Hoja inferior que siempre se puede cerrar (botón, fondo o tecla Esc). */
export function BottomSheet({ abierto, onCerrar, titulo, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alTeclear);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Cerrar" className="absolute inset-0 bg-texto/50" onClick={onCerrar} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        className="relative w-full max-w-[480px] rounded-t-3xl bg-superficie px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 shadow-2xl outline-none"
      >
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-borde" aria-hidden="true" />
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-texto-suave hover:bg-gris"
        >
          <IconoCerrar />
        </button>
        {children}
      </div>
    </div>
  );
}
