import { estadoVerificacion } from "@/lib/verificacion";
import { Tag } from "./ui/Tag";

/** "Verificado: 28 sep" y, si pasaron más de 60 días, "Confirmar antes de viajar". */
export function TramoVerificado({ fecha, hoy }: { fecha: string; hoy: string }) {
  const e = estadoVerificacion(fecha, hoy);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-sm text-texto-suave">{e.texto}</span>
      {e.confirmarAntes && <Tag tipo="confirmar" />}
    </span>
  );
}
