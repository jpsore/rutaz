import { creditoDe } from "@/lib/creditos";

/** "Foto: autor · CC BY-SA 4.0" con link a la fuente (lo pide la licencia). */
export function CreditoFoto({ imagen, className = "" }: { imagen: string; className?: string }) {
  const c = creditoDe(imagen);
  if (!c) return null;
  return (
    <p className={`text-xs text-texto-suave ${className}`}>
      Foto:{" "}
      <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {c.autor}
      </a>{" "}
      · {c.licenciaUrl ? (
        <a href={c.licenciaUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {c.licencia}
        </a>
      ) : (
        c.licencia
      )}
    </p>
  );
}
