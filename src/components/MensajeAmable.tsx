import { ButtonLink } from "./ui/Button";

/** Nunca una pantalla en blanco: mensaje claro y botón a "Este mes". */
export function MensajeAmable({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl" aria-hidden="true">🧭</p>
      <h1 className="mt-4 text-2xl font-bold">{titulo}</h1>
      <p className="mt-2 text-texto-suave">{texto}</p>
      <ButtonLink href="/" grande className="mt-6 w-full max-w-xs">
        Ver qué hay este mes
      </ButtonLink>
    </main>
  );
}
