"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { almacenLocal } from "@/lib/almacen";
import { rutaItinerario, textoCompartir } from "@/lib/compartir";
import type { ResumenPlan } from "@/lib/contenido/consultas";
import type { Aviso, LugarFila } from "@/lib/contenido/tipos";
import { tocaMostrarOferta } from "@/lib/cuenta";
import { soles } from "@/lib/dinero";
import { contarLugares } from "@/lib/lugares";
import { planificar, type Dias, type Plantilla, type Presupuesto } from "@/lib/planner";
import { ErrorAlmacen, LocalStore, claveCombinacion } from "@/lib/rutas-guardadas";
import { AccountOfferSheet } from "../AccountOfferSheet";
import { IconoAtras } from "../iconos";
import { ShareButton } from "../ShareButton";
import { AlertBanner } from "../ui/AlertBanner";
import { BottomSheet } from "../ui/BottomSheet";
import { Button, ButtonLink } from "../ui/Button";
import { CabeceraPlan } from "../planificador/CabeceraPlan";
import { ListaDias } from "./ListaDias";
import { ResumenCosto } from "./ResumenCosto";

type Props = {
  plan: Omit<ResumenPlan, "evento"> & { fechaInicio: string | null };
  plantillas: Plantilla[];
  presupuesto: Presupuesto;
  dias: Dias;
  quitadasIniciales: string[];
  avisos: Aviso[];
  hoy: string;
  /** Lugares sugeridos por id de parada (vacío si no hay). */
  lugares: Record<string, LugarFila[]>;
};

export function ItineraryView({ plan, plantillas, presupuesto, dias, quitadasIniciales, avisos, hoy, lugares }: Props) {
  const router = useRouter();
  const [quitadas, setQuitadas] = useState<string[]>(quitadasIniciales);
  const [guardadaClave, setGuardadaClave] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState(false);
  const [sinAlmacen, setSinAlmacen] = useState(false);
  const [oferta, setOferta] = useState(false);

  const r = useMemo(() => planificar({ plantillas, dias, presupuesto, paradasQuitadas: quitadas }), [plantillas, dias, presupuesto, quitadas]);
  const path = rutaItinerario({ tipo: plan.tipo, slug: plan.slug, presupuesto, dias, quitadas });
  const nombresQuitadas = plantillas
    .find((p) => p.dias === dias)
    ?.paradas.filter((p) => quitadas.includes(p.id));

  const nLugares = useMemo(() => contarLugares(r.dias, lugares, r.nivel), [r.dias, lugares, r.nivel]);

  const enviado = useRef(false);
  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;
    track("itinerary_view", { tipo: plan.tipo, slug: plan.slug, presupuesto, dias, nivel: r.nivel, total: r.total, alcanza: r.alcanza, lugares: nLugares });
  }, [plan.tipo, plan.slug, presupuesto, dias, r.nivel, r.total, r.alcanza, nLugares]);

  // itinerary_end_view: una vez por itinerario, cuando el bloque de cierre entra en pantalla.
  const cierreRef = useRef<HTMLDivElement>(null);
  const datosCierre = useRef({ tipo: plan.tipo, slug: plan.slug, nivel: r.nivel, total: r.total, alcanza: r.alcanza, lugares: nLugares });
  useEffect(() => {
    datosCierre.current = { tipo: plan.tipo, slug: plan.slug, nivel: r.nivel, total: r.total, alcanza: r.alcanza, lugares: nLugares };
  });
  useEffect(() => {
    const el = cierreRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      track("itinerary_end_view", datosCierre.current);
      obs.disconnect();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // La URL siempre reproduce lo que se ve (incluidas las paradas quitadas).
  useEffect(() => {
    const actual = window.location.pathname + window.location.search;
    if (actual !== path) window.history.replaceState(window.history.state, "", path);
  }, [path]);

  const nuevaRuta = {
    plan: { tipo: plan.tipo, slug: plan.slug, nombre: plan.titulo, imagen: plan.imagen, fechas: plan.fechas, fecha_inicio: plan.fechaInicio },
    parametros: { presupuesto, dias, paradas_quitadas: quitadas },
    snapshot: r,
  };
  const clave = claveCombinacion(nuevaRuta);
  const guardada = guardadaClave === clave;

  function guardar() {
    try {
      const { nueva } = new LocalStore(almacenLocal()).guardar(nuevaRuta);
      setGuardadaClave(clave);
      if (!nueva) return;
      track("route_saved", { tipo: plan.tipo, slug: plan.slug, dias, presupuesto });
      setConfirmacion(true);
      window.setTimeout(() => setConfirmacion(false), 6000);
      if (tocaMostrarOferta()) window.setTimeout(() => setOferta(true), 600);
    } catch (e) {
      if (e instanceof ErrorAlmacen) setSinAlmacen(true);
    }
  }

  const share = {
    path,
    plan: { tipo: plan.tipo, slug: plan.slug },
    titulo: plan.nombre,
    texto: textoCompartir({ origen: "itinerario", plan: plan.nombre, dias, total: r.total }),
  };

  return (
    <main className="px-5 pb-36 pt-4">
      <Link
        href={`/planificar?tipo=${plan.tipo}&slug=${encodeURIComponent(plan.slug)}`}
        className="-ml-2 inline-flex min-h-12 items-center gap-1 px-2 font-semibold text-acento-fuerte"
      >
        <IconoAtras /> Cambiar datos
      </Link>
      <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-[-0.6px]">
        Tu ruta de {dias} {dias === 1 ? "día" : "días"}
      </h1>
      <div className="mt-3">
        <CabeceraPlan titulo={plan.titulo} imagen={plan.imagen} fechas={plan.fechas} cambiarHref="/" cambiarTexto="Cambiar" />
      </div>

      {avisos.length > 0 && (
        <div className="mt-3 space-y-2">
          {avisos.map((a) => (
            <AlertBanner key={a.id} titulo={a.titulo} detalle={a.detalle} desde={a.desde} hasta={a.hasta} />
          ))}
        </div>
      )}

      <div className="mt-4">
        <ResumenCosto r={r} presupuesto={presupuesto} />
      </div>

      {r.sugerencias.length > 0 && (
        <section aria-label="Sugerencias para que te alcance" className="mt-4 space-y-2">
          <h2 className="text-lg font-bold">Para que te alcance</h2>
          {r.sugerencias.map((s) =>
            s.tipo === "menos_dias" ? (
              <div key="menos" className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-3">
                <p className="flex-1 leading-snug">
                  Hazlo en {s.dias} {s.dias === 1 ? "día" : "días"}: te sale <strong>{soles(s.total)}</strong>
                </p>
                <Button
                  variante="secundario"
                  onClick={() => {
                    track("suggestion_click", { tipo: "menos_dias" });
                    router.push(rutaItinerario({ tipo: plan.tipo, slug: plan.slug, presupuesto, dias: s.dias }));
                  }}
                >
                  Probar
                </Button>
              </div>
            ) : (
              <div key={s.paradaId} className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-3">
                <p className="flex-1 leading-snug">
                  Quita {s.actividad.charAt(0).toLowerCase() + s.actividad.slice(1)}: ahorras <strong>{soles(s.ahorro)}</strong>
                </p>
                <Button
                  variante="secundario"
                  onClick={() => {
                    track("suggestion_click", { tipo: "quitar_parada" });
                    setQuitadas((q) => [...q, s.paradaId]);
                  }}
                >
                  Quitar
                </Button>
              </div>
            ),
          )}
        </section>
      )}

      {nombresQuitadas && nombresQuitadas.length > 0 && (
        <div className="mt-3 rounded-xl bg-gris p-3 text-[15px]">
          <p className="font-semibold">Quitaste de tu ruta:</p>
          <ul className="mt-1 space-y-1">
            {nombresQuitadas.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2">
                <span>{p.actividad}</span>
                <button
                  type="button"
                  className="min-h-12 px-2 font-semibold text-acento-fuerte underline underline-offset-2"
                  onClick={() => setQuitadas((q) => q.filter((id) => id !== p.id))}
                >
                  Volver a ponerla
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <ListaDias dias={r.dias} hoy={hoy} lugares={lugares} nivel={r.nivel} />
      </div>

      <div ref={cierreRef}>
      {guardada ? (
        <section aria-labelledby="cierre-guardada" className="mt-8 rounded-2xl bg-secundario-suave p-5">
          <h2 id="cierre-guardada" className="text-xl font-bold">
            Ya está en tu celular
          </h2>
          <p className="mt-1 text-texto-suave">La encuentras en Mis rutas, incluso sin señal.</p>
          <ButtonLink href="/mis-rutas" onClick={() => track("my_routes_click", { origen: "cierre" })} grande className="mt-4 w-full">
            Ver en Mis rutas
          </ButtonLink>
          <Link
            href="/"
            onClick={() => track("another_route_click", { origen: "cierre" })}
            className="mt-2 flex min-h-12 items-center justify-center font-semibold text-acento-fuerte underline underline-offset-2"
          >
            Armar otra ruta
          </Link>
        </section>
      ) : (
        <section aria-labelledby="cierre" className="mt-8 rounded-2xl bg-acento-suave p-5">
          <h2 id="cierre" className="text-xl font-bold">
            ¿Te gusta cómo quedó?
          </h2>
          <p className="mt-1 text-texto-suave">
            {soles(r.total)} por persona · {dias} {dias === 1 ? "día" : "días"}. Se guarda en tu celular.
          </p>
          <Button grande onClick={guardar} className="mt-4 w-full">
            Guardar ruta
          </Button>
          <Link
            href="/"
            onClick={() => track("another_route_click", { origen: "cierre" })}
            className="mt-2 flex min-h-12 items-center justify-center font-semibold text-acento-fuerte underline underline-offset-2"
          >
            Armar otra ruta
          </Link>
        </section>
      )}
      </div>

      {confirmacion && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-[calc(150px+env(safe-area-inset-bottom))] z-40 mx-auto w-fit max-w-[90%] rounded-2xl bg-texto px-5 py-3 text-center text-white shadow-lg"
        >
          <p className="font-semibold">Ruta guardada ✓</p>
          <p className="text-sm opacity-90">La encuentras en Mis rutas</p>
          <div className="mt-1 flex justify-center gap-4">
            <Link
              href="/mis-rutas"
              onClick={() => track("my_routes_click", { origen: "confirmacion" })}
              className="inline-flex min-h-12 items-center font-semibold underline underline-offset-2"
            >
              Ver en Mis rutas
            </Link>
            <Link
              href="/"
              onClick={() => track("another_route_click", { origen: "confirmacion" })}
              className="inline-flex min-h-12 items-center font-semibold underline underline-offset-2"
            >
              Armar otra ruta
            </Link>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-20">
        <div className="mx-auto flex max-w-[480px] gap-2 border-t border-borde bg-fondo/95 px-5 py-3 backdrop-blur">
          <Button grande onClick={guardar} disabled={guardada} variante={guardada ? "secundario" : "principal"} className="flex-1">
            {guardada ? "Guardada ✓" : "Guardar ruta"}
          </Button>
          <ShareButton origen="itinerario" {...share} className="shrink-0" />
        </div>
      </div>

      <BottomSheet abierto={sinAlmacen} onCerrar={() => setSinAlmacen(false)} titulo="No pudimos guardar">
        <h2 className="pr-10 text-xl font-bold">No pudimos guardar en este celular</h2>
        <p className="mt-2 text-texto-suave">Compártela para no perderla: mándatela por WhatsApp.</p>
        <div className="mt-5">
          <ShareButton origen="itinerario" {...share} className="w-full" />
        </div>
      </BottomSheet>

      <AccountOfferSheet abierto={oferta} onCerrar={() => setOferta(false)} />
    </main>
  );
}
