import Link from "next/link";
import { Imagen } from "../ui/Imagen";

type Props = { titulo: string; imagen: string; fechas: string | null; cambiarHref: string; cambiarTexto: string };

/** El destino elegido arriba, con su foto. No se puede borrar: viene en la URL. */
export function CabeceraPlan({ titulo, imagen, fechas, cambiarHref, cambiarTexto }: Props) {
  const porConfirmar = fechas?.startsWith("Fecha por confirmar");
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-borde bg-superficie p-3">
      <Imagen src={imagen} alt={titulo} sizes="72px" priority className="h-[72px] w-[72px] shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="font-bold leading-snug">{titulo}</p>
        {fechas && (
          <p className={`mt-0.5 text-sm font-semibold ${porConfirmar ? "text-aviso" : "text-texto-suave"}`}>
            {porConfirmar ? fechas : `Fechas: ${fechas}`}
          </p>
        )}
      </div>
      <Link href={cambiarHref} className="flex min-h-12 shrink-0 items-center px-2 font-semibold text-acento-fuerte underline underline-offset-2">
        {cambiarTexto}
      </Link>
    </div>
  );
}
