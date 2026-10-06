import { ButtonLink } from "../ui/Button";
import { AlertBanner } from "../ui/AlertBanner";
import { TrackVista } from "../Track";
import { CardCarousel } from "./CardCarousel";
import { HolidayStrip } from "./HolidayStrip";
import { MonthHeader } from "./MonthHeader";
import { cargarContenido } from "@/lib/contenido/cargar";
import { armarMes } from "@/lib/contenido/consultas";
import { ahora as reloj } from "@/lib/reloj";
import { hoyLima, mesActualLima, mesesEntre, nombreMes, sumarMeses } from "@/lib/fechas";

/** Se puede avanzar hasta 2 meses desde el actual. */
export const MESES_ADELANTE = 2;

export function hrefMes(mes: string, actual: string): string {
  return mes === actual ? "/" : `/mes/${mes}`;
}

/** "Este mes" y "/mes/AAAA-MM" usan este mismo Server Component. */
export async function VistaMesPagina({ mes }: { mes: string }) {
  const ahora = reloj();
  const hoy = hoyLima(ahora);
  const actual = mesActualLima(ahora);
  const contenido = await cargarContenido();
  const vista = armarMes(contenido, mes, hoy);
  const distancia = mesesEntre(actual, mes);
  const nombre = nombreMes(mes);

  return (
    <main>
      <TrackVista evento="month_view" props={{ mes }} />
      <MonthHeader
        titulo={`¿Qué hay en ${nombre}?`}
        mes={mes}
        anterior={distancia > 0 ? hrefMes(sumarMeses(mes, -1), actual) : null}
        siguiente={
          distancia < MESES_ADELANTE ? { href: hrefMes(sumarMeses(mes, 1), actual), mes: sumarMeses(mes, 1) } : null
        }
      />

      {vista.vacio ? (
        <section className="mx-5 mt-6 rounded-2xl border border-borde bg-superficie p-6 text-center">
          <p className="text-lg font-bold">Estamos armando lo de {nombre}.</p>
          <p className="mt-1 text-texto-suave">Mientras, mira lo de este mes.</p>
          <ButtonLink href="/" className="mt-5 w-full">
            Ver lo de {nombreMes(actual)}
          </ButtonLink>
        </section>
      ) : (
        <>
          {(vista.feriados.length > 0 || vista.avisos.length > 0) && (
            <div className="mt-3 space-y-2 px-5">
              <HolidayStrip feriados={vista.feriados} />
              {vista.avisos.map((a) => (
                <AlertBanner key={a.id} titulo={a.titulo} detalle={a.detalle} desde={a.desde} hasta={a.hasta} />
              ))}
            </div>
          )}
          {vista.bloques.map((b, i) => (
            <CardCarousel key={b.tipo} bloque={b} mes={mes} primero={i === 0} />
          ))}
          <p className="px-5 pb-6 pt-8 text-center text-sm text-texto-suave">
            Costos y fechas de referencia. Confírmalos antes de viajar.
          </p>
        </>
      )}
    </main>
  );
}
