import type { Metadata } from "next";
import { connection } from "next/server";
import { VistaMesPagina } from "@/components/mes/VistaMesPagina";
import { mesActualLima, nombreMes } from "@/lib/fechas";
import { ahora } from "@/lib/reloj";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const nombre = nombreMes(mesActualLima(ahora()));
  const titulo = `¿Qué hay en ${nombre}? Escapadas cerca de Lima`;
  return {
    title: { absolute: titulo },
    openGraph: { title: titulo, description: "Fiestas, destinos y rutas para este mes, con tu ruta y costo por persona.", images: ["/og-mes.jpg"] },
  };
}

export default async function Inicio() {
  // El mes actual se calcula en cada visita con la hora de Lima (el contenido se cachea 1 h).
  await connection();
  return <VistaMesPagina mes={mesActualLima(ahora())} />;
}
