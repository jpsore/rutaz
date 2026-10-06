"use client";
import Link from "next/link";
import { useAlmacenRutas } from "@/components/mis-rutas/useRutasGuardadas";
import { ButtonLink } from "@/components/ui/Button";
import { Imagen } from "@/components/ui/Imagen";
import { soles } from "@/lib/dinero";

export default function MisRutas() {
  const store = useAlmacenRutas();
  const rutas = store?.listar() ?? null;

  return (
    <main className="px-5 pb-8 pt-6">
      <h1 className="text-[28px] font-bold tracking-[-0.6px]">Mis rutas</h1>
      <p className="mt-1 text-texto-suave">Guardadas en este celular.</p>

      {rutas === null ? null : rutas.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-borde bg-superficie p-6 text-center">
          <p className="text-lg font-bold">Aún no guardas rutas</p>
          <p className="mt-1 text-texto-suave">Elige un plan de este mes, arma tu ruta y guárdala para tenerla a la mano.</p>
          <ButtonLink href="/" className="mt-5 w-full">
            Ver qué hay este mes
          </ButtonLink>
        </section>
      ) : (
        <ul className="mt-5 space-y-3">
          {rutas.map((r) => (
            <li key={r.id}>
              <Link href={`/mis-rutas/${r.id}`} className="flex gap-3 rounded-2xl border border-borde bg-superficie p-3 hover:bg-gris">
                <Imagen src={r.plan.imagen} alt={r.plan.nombre} sizes="80px" className="h-20 w-20 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-snug">{r.plan.nombre}</p>
                  {r.plan.fechas && <p className="text-sm text-texto-suave">{r.plan.fechas}</p>}
                  <p className="mt-1 text-sm">
                    {r.parametros.dias} {r.parametros.dias === 1 ? "día" : "días"} ·{" "}
                    <span className="font-semibold">{soles(r.snapshot.total)}</span> por persona
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
