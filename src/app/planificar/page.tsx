import type { Metadata } from "next";
import { MensajeAmable } from "@/components/MensajeAmable";
import { CabeceraPlan } from "@/components/planificador/CabeceraPlan";
import { PlannerForm } from "@/components/planificador/PlannerForm";
import { TrackVista } from "@/components/Track";
import { cargarContenido } from "@/lib/contenido/cargar";
import { esTipoPlan, plantillasDelPlan, resumenPlan } from "@/lib/contenido/consultas";
import { diasDisponibles } from "@/lib/planner";

export const metadata: Metadata = { title: "Arma tu ruta", robots: { index: false } };

export default async function Planificar({ searchParams }: PageProps<"/planificar">) {
  const q = await searchParams;
  const tipo = q.tipo;
  const slug = typeof q.slug === "string" ? q.slug : "";
  const c = await cargarContenido();
  const plan = esTipoPlan(tipo) ? resumenPlan(c, tipo, slug) : null;
  const dias = plan ? diasDisponibles(plantillasDelPlan(c, plan.tipo, plan.slug)) : [];

  if (!plan || dias.length === 0) {
    return (
      <MensajeAmable
        titulo="Elige primero un plan"
        texto="Toca “Armar mi ruta con esto” en una tarjeta de este mes y aquí armamos tu ruta."
      />
    );
  }

  return (
    <main className="px-5 pb-8 pt-6">
      <TrackVista evento="planner_view" props={{ tipo: plan.tipo, slug: plan.slug }} />
      <h1 className="text-[28px] font-bold tracking-[-0.6px]">Arma tu ruta</h1>
      <p className="mb-4 mt-1 text-texto-suave">Precios de referencia en soles, por persona.</p>
      <CabeceraPlan titulo={plan.titulo} imagen={plan.imagen} fechas={plan.fechas} cambiarHref="/" cambiarTexto="Cambiar" />
      <PlannerForm tipo={plan.tipo} slug={plan.slug} diasDisponibles={dias} />
    </main>
  );
}
