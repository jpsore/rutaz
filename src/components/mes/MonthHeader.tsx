"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { IconoAdelante, IconoAtras } from "../iconos";

type Props = {
  titulo: string;
  mes: string;
  anterior: string | null; // href o null si no se puede
  siguiente: { href: string; mes: string } | null;
};

const clasesFlecha =
  "flex h-12 w-12 items-center justify-center rounded-full border border-borde bg-superficie text-texto hover:bg-gris";

export function MonthHeader({ titulo, mes, anterior, siguiente }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 pb-2 pt-6">
      <h1 className="text-[28px] font-bold leading-tight tracking-[-0.6px]">{titulo}</h1>
      <div className="flex shrink-0 gap-2">
        {anterior ? (
          <Link href={anterior} aria-label="Mes anterior" className={clasesFlecha}>
            <IconoAtras />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${clasesFlecha} opacity-40`}>
            <IconoAtras />
          </span>
        )}
        {siguiente ? (
          <Link
            href={siguiente.href}
            aria-label="Mes siguiente"
            className={clasesFlecha}
            onClick={() => track("month_next_click", { desde: mes, hacia: siguiente.mes })}
          >
            <IconoAdelante />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${clasesFlecha} opacity-40`}>
            <IconoAdelante />
          </span>
        )}
      </div>
    </header>
  );
}
