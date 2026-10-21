"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { rutaItinerario } from "@/lib/compartir";
import type { TipoPlan } from "@/lib/contenido/tipos";
import { DIAS, PRESUPUESTOS, type Presupuesto } from "@/lib/planner/tipos";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";

type Props = { tipo: TipoPlan; slug: string; diasDisponibles: number[] };

/** "Este plan es de 2 días", "Este plan es de 1 o 2 días". */
export function notaDiasDelPlan(dias: number[]): string {
  return `Este plan es de ${dias.join(" o ")} ${dias.length === 1 && dias[0] === 1 ? "día" : "días"}`;
}

export function etiquetaPresupuesto(p: number): string {
  return p === 500 ? "S/ 500+" : `S/ ${p}`;
}

/** Solo dos preguntas: presupuesto por persona y días. */
export function PlannerForm({ tipo, slug, diasDisponibles }: Props) {
  const router = useRouter();
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [dias, setDias] = useState<number | null>(diasDisponibles[0] ?? null);
  const sinRuta = DIAS.filter((d) => !diasDisponibles.includes(d));
  const listo = presupuesto !== null && dias !== null;

  function verRuta() {
    if (!listo) return;
    track("planner_submit", { tipo, slug, presupuesto, dias });
    router.push(rutaItinerario({ tipo, slug, presupuesto, dias }));
  }

  return (
    <div className="mt-6">
      <fieldset>
        <legend className="text-lg font-bold">Presupuesto por persona</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESUPUESTOS.map((p) => (
            <Chip key={p} seleccionado={presupuesto === p} onClick={() => setPresupuesto(p)}>
              {etiquetaPresupuesto(p)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-lg font-bold">¿Cuántos días?</legend>
        <p className="mt-0.5 text-sm text-texto-suave">
          1 día = ida y vuelta el mismo día
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DIAS.map((d) => (
            <Chip
              key={d}
              seleccionado={dias === d}
              deshabilitado={!diasDisponibles.includes(d)}
              onClick={() => setDias(d)}
              className="min-w-16"
            >
              {d}
            </Chip>
          ))}
        </div>
        {sinRuta.length > 0 && diasDisponibles.length > 0 && (
          <p className="mt-3 rounded-xl bg-gris px-3 py-2 text-sm font-semibold">
            {notaDiasDelPlan(diasDisponibles)}
          </p>
        )}
      </fieldset>

      <Button grande disabled={!listo} onClick={verRuta} className="mt-8 w-full">
        Ver mi ruta
      </Button>
      {!listo && <p className="mt-2 text-center text-sm text-texto-suave">Elige tu presupuesto para ver la ruta</p>}
    </div>
  );
}
