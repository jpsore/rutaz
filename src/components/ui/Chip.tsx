"use client";
import type { ReactNode } from "react";

type Props = {
  seleccionado: boolean;
  deshabilitado?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

/** Chip seleccionable de un toque (mínimo 48px de alto). */
export function Chip({ seleccionado, deshabilitado, onClick, children, className = "" }: Props) {
  return (
    <button
      type="button"
      aria-pressed={seleccionado}
      disabled={deshabilitado}
      onClick={onClick}
      className={[
        "min-h-12 rounded-full border px-5 text-base font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento",
        deshabilitado
          ? "cursor-not-allowed border-dashed border-borde bg-gris text-texto-suave"
          : seleccionado
            ? "border-texto bg-texto text-white"
            : "border-[#8a93a6] bg-superficie text-texto hover:bg-gris",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
