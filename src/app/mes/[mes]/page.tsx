import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { MESES_ADELANTE, VistaMesPagina } from "@/components/mes/VistaMesPagina";
import { esMesValido, mesActualLima, mesesEntre, nombreMes } from "@/lib/fechas";
import { ahora } from "@/lib/reloj";

export async function generateMetadata({ params }: PageProps<"/mes/[mes]">): Promise<Metadata> {
  const { mes } = await params;
  if (!esMesValido(mes)) return {};
  const titulo = `¿Qué hay en ${nombreMes(mes)}? Escapadas cerca de Lima`;
  return { title: { absolute: titulo }, openGraph: { title: titulo, images: ["/og-mes.jpg"] } };
}

export default async function PaginaMes({ params }: PageProps<"/mes/[mes]">) {
  await connection();
  const { mes } = await params;
  const actual = mesActualLima(ahora());
  // No se va a meses pasados ni más de 2 meses adelante; el mes actual vive en "/".
  if (!esMesValido(mes)) redirect("/");
  const distancia = mesesEntre(actual, mes);
  if (distancia <= 0 || distancia > MESES_ADELANTE) redirect("/");
  return <VistaMesPagina mes={mes} />;
}
