import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "principal" | "secundario" | "fantasma";

const estilos: Record<Variante, string> = {
  principal:
    "bg-acento text-white hover:bg-acento-fuerte active:bg-acento-fuerte disabled:bg-borde disabled:text-texto-suave",
  secundario:
    "bg-superficie text-texto border border-borde hover:bg-gris active:bg-gris disabled:text-texto-suave",
  fantasma: "bg-transparent text-acento hover:bg-acento-suave",
};

export function clasesBoton(variante: Variante = "principal", grande = false, extra = "") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-[14px] px-5 font-semibold transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento",
    "disabled:cursor-not-allowed select-none",
    grande ? "min-h-14 text-[17px]" : "min-h-12 text-base",
    estilos[variante],
    extra,
  ].join(" ");
}

type Comunes = { variante?: Variante; grande?: boolean; className?: string; children: ReactNode };

export function Button({ variante, grande, className, ...props }: Comunes & ComponentProps<"button">) {
  return <button type="button" className={clasesBoton(variante, grande, className)} {...props} />;
}

export function ButtonLink({ variante, grande, className, ...props }: Comunes & ComponentProps<typeof Link>) {
  return <Link className={clasesBoton(variante, grande, className)} {...props} />;
}
