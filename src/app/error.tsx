"use client";
import { Button, ButtonLink } from "@/components/ui/Button";

/** Nunca una pantalla en blanco: si algo falla, se puede reintentar o volver a "Este mes". */
export default function ErrorPagina({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl" aria-hidden="true">🌧️</p>
      <h1 className="mt-4 text-2xl font-bold">Algo no cargó bien</h1>
      <p className="mt-2 text-texto-suave">Puede ser la señal. Intenta otra vez en un ratito.</p>
      <Button grande onClick={() => retry()} className="mt-6 w-full max-w-xs">
        Intentar otra vez
      </Button>
      <ButtonLink href="/" variante="secundario" grande className="mt-2 w-full max-w-xs">
        Ver qué hay este mes
      </ButtonLink>
    </main>
  );
}
