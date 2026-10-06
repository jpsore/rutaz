import type { Metadata } from "next";
import { connection } from "next/server";
import { ItineraryView } from "@/components/itinerario/ItineraryView";
import { MensajeAmable } from "@/components/MensajeAmable";
import { cargarContenido } from "@/lib/contenido/cargar";
import { avisosDelPlan, esTipoPlan, plantillasDelPlan, resumenPlan } from "@/lib/contenido/consultas";
import type { Contenido } from "@/lib/contenido/tipos";
import { hoyLima } from "@/lib/fechas";
import { ahora } from "@/lib/reloj";
import { DIAS, PRESUPUESTOS, planificar, type Dias, type Presupuesto } from "@/lib/planner";
import { soles } from "@/lib/dinero";

type Q = Record<string, string | string[] | undefined>;

function leerParametros(c: Contenido, q: Q) {
  const tipo = q.tipo;
  const slug = typeof q.slug === "string" ? q.slug : "";
  const presupuesto = Number(q.presupuesto) as Presupuesto;
  const dias = Number(q.dias) as Dias;
  if (!esTipoPlan(tipo) || !PRESUPUESTOS.includes(presupuesto) || !DIAS.includes(dias)) return null;
  const plan = resumenPlan(c, tipo, slug);
  if (!plan) return null;
  const plantillas = plantillasDelPlan(c, tipo, slug);
  const plantilla = plantillas.find((p) => p.dias === dias);
  if (!plantilla) return null;
  // Solo se aceptan paradas opcionales de esta plantilla.
  const opcionales = new Set(plantilla.paradas.filter((p) => p.opcional).map((p) => p.id));
  const quitadas = (typeof q.quitar === "string" ? q.quitar.split(",") : []).filter((id) => opcionales.has(id));
  return { plan, plantillas, presupuesto, dias, quitadas };
}

export async function generateMetadata({ searchParams }: PageProps<"/planificar/ruta">): Promise<Metadata> {
  const c = await cargarContenido();
  const p = leerParametros(c, await searchParams);
  if (!p) return { title: "Arma tu ruta" };
  const r = planificar({ plantillas: p.plantillas, dias: p.dias, presupuesto: p.presupuesto, paradasQuitadas: p.quitadas });
  const titulo = `${p.plan.nombre} · ${p.dias} ${p.dias === 1 ? "día" : "días"} desde ${soles(r.total)}`;
  const descripcion = "Itinerario día a día con costos por persona. Ármalo con tu presupuesto en Rutaz.";
  return {
    title: { absolute: titulo },
    description: descripcion,
    robots: { index: false },
    openGraph: { title: titulo, description: descripcion, images: [{ url: p.plan.imagen, width: 800, height: 600 }] },
  };
}

export default async function Itinerario({ searchParams }: PageProps<"/planificar/ruta">) {
  await connection();
  const c = await cargarContenido();
  const p = leerParametros(c, await searchParams);
  if (!p) {
    return (
      <MensajeAmable
        titulo="No pudimos armar esa ruta"
        texto="El link está incompleto o ese plan ya no está disponible. Elige otro plan de este mes."
      />
    );
  }
  const hoy = hoyLima(ahora());
  const { evento, ...plan } = p.plan;
  return (
    <ItineraryView
      key={`${plan.tipo}-${plan.slug}-${p.presupuesto}-${p.dias}`}
      plan={{ ...plan, fechaInicio: evento?.fecha_inicio ?? null }}
      plantillas={p.plantillas}
      presupuesto={p.presupuesto}
      dias={p.dias}
      quitadasIniciales={p.quitadas}
      avisos={avisosDelPlan(c, p.plan, hoy)}
      hoy={hoy}
    />
  );
}
