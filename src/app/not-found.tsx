import { ButtonLink } from "@/components/ui/Button";

export default function NoEncontrado() {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl" aria-hidden="true">🧭</p>
      <h1 className="mt-4 text-2xl font-bold">No encontramos ese lugar</h1>
      <p className="mt-2 text-texto-suave">Puede que el link esté incompleto o que ya no esté publicado.</p>
      <ButtonLink href="/" className="mt-6 w-full max-w-xs" grande>
        Ver qué hay este mes
      </ButtonLink>
    </main>
  );
}
