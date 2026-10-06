import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cómo usamos tu correo" };

// TODO antes de lanzar: poner el correo de contacto real (ver PLAN.md, "Antes de lanzar").
const CORREO_CONTACTO = "hola@rutaz.pe";

export default function Privacidad() {
  return (
    <main className="px-5 pb-10 pt-6 leading-relaxed">
      <Link href="/" className="-ml-2 inline-flex min-h-12 items-center px-2 font-semibold text-acento-fuerte">
        ← Volver a Rutaz
      </Link>
      <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.6px]">Cómo usamos tu correo</h1>

      <h2 className="mt-6 text-lg font-bold">Qué guardamos</h2>
      <p className="mt-1">Solo tu correo, y solo si lo dejas en “Sí, avísame” y marcas la casilla de consentimiento.</p>

      <h2 className="mt-5 text-lg font-bold">Para qué</h2>
      <p className="mt-1">Para avisarte cuando puedas crear tu cuenta en Rutaz y no perder tus rutas. Nada más.</p>

      <h2 className="mt-5 text-lg font-bold">Con quién lo compartimos</h2>
      <p className="mt-1">Con nadie. No vendemos ni compartimos tu correo.</p>

      <h2 className="mt-5 text-lg font-bold">Cómo pedir que lo borremos</h2>
      <p className="mt-1">
        Escríbenos a{" "}
        <a href={`mailto:${CORREO_CONTACTO}`} className="font-semibold text-acento-fuerte underline underline-offset-2">
          {CORREO_CONTACTO}
        </a>{" "}
        y lo borramos.
      </p>

      <h2 className="mt-5 text-lg font-bold">Tus derechos</h2>
      <p className="mt-1">
        Tratamos tus datos según la Ley 29733, Ley de Protección de Datos Personales del Perú. Puedes pedir acceder,
        corregir o borrar tu correo cuando quieras.
      </p>

      <h2 className="mt-5 text-lg font-bold">Tus rutas</h2>
      <p className="mt-1">Tus rutas guardadas se quedan en tu celular. No las subimos a ningún lado.</p>
    </main>
  );
}
