import Link from "next/link";
import { BotonVolver } from "../BotonVolver";
import { CtaArmarRuta } from "../CtaArmarRuta";
import { IconoAviso, IconoBus } from "../iconos";
import { ShareButton } from "../ShareButton";
import { TrackVista } from "../Track";
import { TramoVerificado } from "../TramoVerificado";
import { AlertBanner } from "../ui/AlertBanner";
import { Imagen } from "../ui/Imagen";
import { CalendarioMeses } from "./CalendarioMeses";
import { formatoDuracion, rutaFicha, type Ficha } from "@/lib/contenido/consultas";
import { textoCompartir } from "@/lib/compartir";

const DIFICULTAD = { baja: "Baja", media: "Media", alta: "Alta" } as const;
export const ALTITUD_ACLIMATACION = 3000;

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-xl font-bold tracking-[-0.2px]">{titulo}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex-1 rounded-xl border border-borde bg-superficie p-3">
      <p className="text-[13px] text-texto-suave">{etiqueta}</p>
      <p className="mt-0.5 font-bold">{valor}</p>
    </div>
  );
}

const formatoAltitud = new Intl.NumberFormat("es-PE", { useGrouping: true });
function altitud(m: number) {
  // "3 800 m s. n. m." con espacio fino de miles
  return `${formatoAltitud.format(m).replace(/,/g, " ")} m s. n. m.`;
}

/** Ficha compartida por destinos, eventos y rutas temáticas. */
export function DetailLayout({ ficha: f, hoy, mesActual, origen }: { ficha: Ficha; hoy: string; mesActual: number; origen: "inicio" | "directo" }) {
  const d = f.destino;
  const conDatosSeguridad = d && f.tipo !== "tematica";
  return (
    <main className="pb-28">
      <TrackVista evento="detail_view" props={{ tipo: f.tipo, slug: f.slug, origen }} />
      <div className="relative">
        <Imagen src={f.imagen} alt={f.nombre} sizes="(max-width: 480px) 100vw, 480px" priority className="aspect-[4/3] w-full" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-[max(16px,env(safe-area-inset-top))]">
          <BotonVolver />
          <ShareButton
            forma="icono"
            origen="ficha"
            path={rutaFicha(f.tipo, f.slug)}
            plan={{ tipo: f.tipo, slug: f.slug }}
            titulo={f.nombre}
            texto={textoCompartir({ origen: "ficha", nombre: f.nombre })}
          />
        </div>
      </div>

      <div className="px-5 pt-5">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.6px]">{f.nombre}</h1>
        {d && (
          <p className="mt-1 text-texto-suave">
            {d.zona} · a {formatoDuracion(d.tiempo_desde_lima_min)} de Lima
          </p>
        )}

        {conDatosSeguridad && (
          <>
            <div className="mt-4 flex gap-2">
              {d.altitud_m !== null && <Dato etiqueta="Altitud" valor={altitud(d.altitud_m)} />}
              <Dato etiqueta="Dificultad" valor={DIFICULTAD[d.dificultad]} />
              <Dato etiqueta="Mínimo" valor={`${d.dias_minimos} ${d.dias_minimos === 1 ? "día" : "días"}`} />
            </div>
            {d.altitud_m !== null && d.altitud_m > ALTITUD_ACLIMATACION && (
              <div role="note" className="mt-3 flex gap-3 rounded-2xl border border-[#f5d9b8] bg-aviso-suave px-4 py-3">
                <IconoAviso className="mt-0.5 h-5 w-5 shrink-0 text-aviso" />
                <p className="text-[15px] leading-snug">
                  <strong>Más de 3 000 m s. n. m.:</strong> aclimátate, sube despacio y toma mucha agua.
                </p>
              </div>
            )}
          </>
        )}

        {f.porQueAhora && (
          <Seccion titulo="Por qué ahora">
            <p className="leading-relaxed">{f.porQueAhora}</p>
          </Seccion>
        )}

        <Seccion titulo="Qué es">
          <p className="leading-relaxed">{f.queEs}</p>
          {f.evento && d && (
            <p className="mt-3">
              Es en{" "}
              <Link href={rutaFicha("destino", d.slug)} className="font-semibold text-acento-fuerte underline underline-offset-2">
                {d.nombre}
              </Link>
            </p>
          )}
        </Seccion>

        {f.tematica && f.tematica.lugares.length > 0 && (
          <Seccion titulo="Lugares que incluye">
            <ol className="space-y-2">
              {f.tematica.lugares.map((l, i) => (
                <li key={l} className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-acento text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{l}</span>
                </li>
              ))}
            </ol>
          </Seccion>
        )}

        <Seccion titulo="Cuándo ir">
          <p className="mb-3 font-semibold">{f.cuandoIr}</p>
          {d && f.tipo !== "tematica" && (
            <CalendarioMeses ideales={d.meses_ideales} evitar={d.meses_evitar} mesActual={mesActual} />
          )}
        </Seccion>

        {d && (
          <Seccion titulo="Cómo llegar desde Lima">
            <p>
              {d.como_llegar} · {formatoDuracion(d.tiempo_desde_lima_min)}
            </p>
            {f.tramos.length > 0 && (
              <ul className="mt-3 space-y-2">
                {f.tramos.map((t) => (
                  <li key={t.id} className="flex gap-3 rounded-xl border border-borde bg-superficie p-3">
                    <IconoBus className="mt-0.5 h-5 w-5 shrink-0 text-acento" />
                    <div>
                      <p className="font-semibold leading-snug">{t.actividad}</p>
                      {t.detalle && <p className="text-sm text-texto-suave">{t.detalle}</p>}
                      <TramoVerificado fecha={t.verificado_el} hoy={hoy} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Seccion>
        )}

        {f.avisos.length > 0 && (
          <Seccion titulo="Avisos">
            <div className="space-y-2">
              {f.avisos.map((a) => (
                <AlertBanner key={a.id} titulo={a.titulo} detalle={a.detalle} desde={a.desde} hasta={a.hasta} />
              ))}
            </div>
          </Seccion>
        )}
      </div>

      {f.puedePlanificar && <CtaArmarRuta tipo={f.tipo} slug={f.slug} />}
    </main>
  );
}
