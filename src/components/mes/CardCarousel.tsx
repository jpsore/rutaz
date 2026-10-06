import type { Bloque } from "@/lib/contenido/consultas";
import { PlanCard } from "../ui/PlanCard";

export function CardCarousel({ bloque, mes, primero }: { bloque: Bloque; mes: string; primero: boolean }) {
  const id = `bloque-${bloque.tipo}`;
  return (
    <section aria-labelledby={id} className="pt-6">
      <h2 id={id} className="px-5 text-xl font-bold tracking-[-0.2px]">
        {bloque.titulo}
      </h2>
      <div className="sin-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1">
        {bloque.tarjetas.map((t, i) => (
          <PlanCard key={`${t.tipo}-${t.slug}`} tarjeta={t} mes={mes} prioridad={primero && i === 0} />
        ))}
      </div>
    </section>
  );
}
