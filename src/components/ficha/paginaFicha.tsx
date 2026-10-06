import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { DetailLayout } from "./DetailLayout";
import { cargarContenido } from "@/lib/contenido/cargar";
import { armarFicha, rutaFicha } from "@/lib/contenido/consultas";
import type { TipoPlan } from "@/lib/contenido/tipos";
import { esMesValido, hoyLima, mesActualLima } from "@/lib/fechas";
import { ahora } from "@/lib/reloj";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

function mesDe(q: Record<string, string | string[] | undefined>): string | null {
  const m = typeof q.mes === "string" ? q.mes : null;
  return m && esMesValido(m) ? m : null;
}

/** Arma page + generateMetadata para cada tipo de ficha. */
export function paginaFicha(tipo: TipoPlan) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const c = await cargarContenido();
    const f = armarFicha(c, tipo, slug, mesActualLima(ahora()), hoyLima(ahora()));
    if (!f) return { title: "No encontramos ese lugar" };
    const descripcion = f.porQueAhora ?? f.queEs;
    return {
      title: f.nombre,
      description: descripcion,
      alternates: { canonical: rutaFicha(tipo, slug) },
      openGraph: { title: f.nombre, description: descripcion, images: [{ url: f.imagen, width: 800, height: 600 }], url: rutaFicha(tipo, slug) },
    };
  }

  async function Pagina({ params, searchParams }: Props) {
    await connection();
    const [{ slug }, q] = await Promise.all([params, searchParams]);
    const mesParam = mesDe(q);
    const hoy = hoyLima(ahora());
    const actual = mesActualLima(ahora());
    const c = await cargarContenido();
    const ficha = armarFicha(c, tipo, slug, mesParam ?? actual, hoy);
    if (!ficha) notFound();
    return <DetailLayout ficha={ficha} hoy={hoy} mesActual={Number(actual.slice(5))} origen={mesParam ? "inicio" : "directo"} />;
  }

  return { Pagina, generateMetadata };
}
