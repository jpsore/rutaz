"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconoAtras, IconoBasura } from "@/components/iconos";
import { ListaDias } from "@/components/itinerario/ListaDias";
import { ResumenCosto } from "@/components/itinerario/ResumenCosto";
import { MensajeAmable } from "@/components/MensajeAmable";
import { useAlmacenRutas } from "@/components/mis-rutas/useRutasGuardadas";
import { ShareButton } from "@/components/ShareButton";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Imagen } from "@/components/ui/Imagen";
import { track } from "@/lib/analytics";
import { rutaItinerario, textoCompartir } from "@/lib/compartir";
import { diasEntre, hoyLima } from "@/lib/fechas";

export default function RutaGuardadaPagina() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const store = useAlmacenRutas();
  const ruta = store?.obtener(id) ?? null;
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const enviado = useRef(false);

  useEffect(() => {
    if (ruta && !enviado.current) {
      enviado.current = true;
      track("saved_route_open", { id_ruta: ruta.id });
    }
  }, [ruta]);

  if (!store) return null;
  if (!ruta) {
    return <MensajeAmable titulo="No encontramos esa ruta" texto="Puede que se haya borrado de este celular." />;
  }

  const hoy = hoyLima();
  const { plan, parametros, snapshot } = ruta;
  let diaHoy: number | null = null;
  if (plan.fecha_inicio) {
    const n = diasEntre(plan.fecha_inicio, hoy) + 1;
    diaHoy = n >= 1 && n <= parametros.dias ? n : 1;
  }

  function borrar() {
    store!.borrar(ruta!.id);
    track("saved_route_delete", { id_ruta: ruta!.id });
    router.replace("/mis-rutas");
  }

  return (
    <main className="px-5 pb-36 pt-4">
      <Link href="/mis-rutas" className="-ml-2 inline-flex min-h-12 items-center gap-1 px-2 font-semibold text-acento-fuerte">
        <IconoAtras /> Mis rutas
      </Link>
      <div className="mt-2 flex items-center gap-3">
        <Imagen src={plan.imagen} alt={plan.nombre} sizes="72px" className="h-[72px] w-[72px] shrink-0 rounded-xl" />
        <div>
          <h1 className="text-2xl font-bold leading-tight">{plan.nombre}</h1>
          <p className="text-texto-suave">
            {parametros.dias} {parametros.dias === 1 ? "día" : "días"}
            {plan.fechas ? ` · ${plan.fechas}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ResumenCosto r={snapshot} presupuesto={parametros.presupuesto} />
      </div>

      <div className="mt-5">
        <ListaDias dias={snapshot.dias} hoy={hoy} plegable diaAbierto={diaHoy} />
      </div>

      <button
        type="button"
        onClick={() => setConfirmarBorrar(true)}
        className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] font-semibold text-peligro hover:bg-peligro-suave"
      >
        <IconoBasura /> Borrar esta ruta
      </button>

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-20">
        <div className="mx-auto max-w-[480px] border-t border-borde bg-fondo/95 px-5 py-3 backdrop-blur">
          <ShareButton
            origen="mis-rutas"
            className="w-full"
            path={rutaItinerario({ tipo: plan.tipo, slug: plan.slug, presupuesto: parametros.presupuesto, dias: parametros.dias, quitadas: parametros.paradas_quitadas })}
            plan={{ tipo: plan.tipo, slug: plan.slug }}
            titulo={plan.nombre}
            texto={textoCompartir({ origen: "mis-rutas", plan: plan.nombre, dias: parametros.dias, total: snapshot.total })}
          />
        </div>
      </div>

      <BottomSheet abierto={confirmarBorrar} onCerrar={() => setConfirmarBorrar(false)} titulo="¿Borrar esta ruta?">
        <h2 className="pr-10 text-xl font-bold">¿Borrar esta ruta?</h2>
        <p className="mt-2 text-texto-suave">Se borra de este celular y no se puede recuperar.</p>
        <div className="mt-5 flex flex-col gap-2">
          <Button grande onClick={borrar} className="w-full bg-peligro hover:bg-[#912018]">
            Sí, borrar
          </Button>
          <Button grande variante="secundario" onClick={() => setConfirmarBorrar(false)} className="w-full">
            No, dejarla
          </Button>
        </div>
      </BottomSheet>
    </main>
  );
}
