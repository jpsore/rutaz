"use client";
import { useEffect, useRef } from "react";
import { registrarApertura, track, type NombreEvento } from "@/lib/analytics";

/** Registra un evento al mostrarse la pantalla (una vez por montaje). */
export function TrackVista({ evento, props }: { evento: NombreEvento; props?: Record<string, unknown> }) {
  const enviado = useRef(false);
  const clave = JSON.stringify(props ?? {});
  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;
    track(evento, JSON.parse(clave));
  }, [evento, clave]);
  return null;
}

/** app_open una vez por sesión (va en el layout raíz). */
export function TrackApertura() {
  useEffect(() => {
    registrarApertura();
  }, []);
  return null;
}
