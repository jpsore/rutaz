import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CREDITOS_FOTOS } from "@/lib/creditos";

export const metadata: Metadata = { title: "Créditos de las fotos" };

export default function Creditos() {
  return (
    <main className="px-5 pb-10 pt-6">
      <Link href="/" className="-ml-2 inline-flex min-h-12 items-center px-2 font-semibold text-acento-fuerte">
        ← Volver a Rutaz
      </Link>
      <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.6px]">Créditos de las fotos</h1>
      <p className="mt-2 text-texto-suave">Fotos de Wikimedia Commons con licencias libres. Gracias a sus autores.</p>
      <ul className="mt-5 space-y-3">
        {Object.entries(CREDITOS_FOTOS).map(([imagen, c]) => (
          <li key={imagen} className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-3">
            <Image src={imagen} alt="" width={64} height={48} quality={60} className="h-12 w-16 shrink-0 rounded-md object-cover" />
            <div className="min-w-0 text-sm">
              <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                {c.autor}
              </a>
              <p className="text-texto-suave">{c.licencia}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
