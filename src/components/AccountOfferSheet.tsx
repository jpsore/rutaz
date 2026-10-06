"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { enviarCorreo, marcarCorreoDejado, marcarOfertaCerrada } from "@/lib/cuenta";
import { correoValido } from "@/lib/oferta-cuenta";
import { BottomSheet } from "./ui/BottomSheet";
import { Button } from "./ui/Button";

type Paso = "oferta" | "formulario" | "enviando" | "listo" | "error";

/** Puerta falsa de cuenta (spec 06): solo pide el correo, con consentimiento. */
export function AccountOfferSheet({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const [paso, setPaso] = useState<Paso>("oferta");
  const [correo, setCorreo] = useState("");
  const [acepta, setAcepta] = useState(false);
  const mostrado = useRef(false);

  useEffect(() => {
    if (abierto && !mostrado.current) {
      mostrado.current = true;
      track("account_offer_shown", {});
    }
  }, [abierto]);

  const cerrar = useCallback(() => {
    if (paso !== "listo") {
      marcarOfertaCerrada();
      track("account_offer_dismissed", {});
    }
    onCerrar();
  }, [paso, onCerrar]);

  async function enviar() {
    if (!correoValido(correo) || !acepta) return;
    setPaso("enviando");
    const ok = await enviarCorreo(correo);
    if (!ok) {
      setPaso("error");
      return;
    }
    marcarCorreoDejado();
    track("account_interest_submitted", {}); // nunca el correo
    setPaso("listo");
    window.setTimeout(onCerrar, 2000);
  }

  const valido = correoValido(correo) && acepta;

  return (
    <BottomSheet abierto={abierto} onCerrar={cerrar} titulo="¿Creamos tu cuenta para no perder tus rutas?">
      {paso === "listo" ? (
        <div className="py-4 text-center" role="status">
          <p className="text-xl font-bold">Listo ✓</p>
          <p className="mt-2 text-texto-suave">Te escribimos cuando las cuentas estén listas. Tu ruta sigue guardada aquí.</p>
        </div>
      ) : (
        <>
          <h2 className="pr-10 text-xl font-bold leading-snug">¿Creamos tu cuenta para no perder tus rutas?</h2>
          <p className="mt-2 leading-snug text-texto-suave">
            Tus rutas están guardadas en este celular. Si borras el historial o cambias de celular, se van. Estamos
            preparando las cuentas: déjanos tu correo y te avisamos.
          </p>

          {paso === "oferta" ? (
            <div className="mt-5">
              <Button grande className="w-full" onClick={() => setPaso("formulario")}>
                Sí, avísame
              </Button>
              <button type="button" onClick={cerrar} className="mt-2 min-h-12 w-full font-semibold text-texto-suave underline underline-offset-2">
                Ahora no
              </button>
            </div>
          ) : (
            <form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                void enviar();
              }}
            >
              <label htmlFor="correo" className="font-semibold">
                Tu correo
              </label>
              <input
                id="correo"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                placeholder="tucorreo@gmail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1.5 min-h-12 w-full rounded-[14px] border border-[#8a93a6] bg-superficie px-4 text-base outline-none focus:border-acento focus:ring-2 focus:ring-acento-suave"
              />
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  className="mt-0.5 h-6 w-6 shrink-0 accent-acento"
                />
                <span className="leading-snug">
                  Acepto que Rutaz me escriba para avisarme de las cuentas.{" "}
                  <Link href="/privacidad" target="_blank" className="font-semibold text-acento-fuerte underline underline-offset-2">
                    Cómo usamos tu correo
                  </Link>
                </span>
              </label>
              {paso === "error" && (
                <p role="alert" className="mt-3 rounded-xl bg-peligro-suave px-3 py-2 text-peligro">
                  No pudimos enviarlo. Intenta otra vez.
                </p>
              )}
              <Button type="submit" grande disabled={!valido || paso === "enviando"} className="mt-5 w-full">
                {paso === "enviando" ? "Enviando…" : paso === "error" ? "Reintentar" : "Enviar"}
              </Button>
              <button type="button" onClick={cerrar} className="mt-2 min-h-12 w-full font-semibold text-texto-suave underline underline-offset-2">
                Ahora no
              </button>
            </form>
          )}
        </>
      )}
    </BottomSheet>
  );
}
