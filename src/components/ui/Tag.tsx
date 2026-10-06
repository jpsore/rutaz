type Tipo = "joya-escondida" | "popular" | "ahora" | "por-confirmar" | "confirmar";

const config: Record<Tipo, { texto: string; clase: string }> = {
  "joya-escondida": { texto: "Joya escondida", clase: "bg-secundario text-white" },
  popular: { texto: "Popular", clase: "bg-superficie text-texto" },
  ahora: { texto: "Ahora", clase: "bg-acento text-white" },
  "por-confirmar": { texto: "Fecha por confirmar", clase: "bg-aviso-suave text-aviso" },
  confirmar: { texto: "Confirmar antes de viajar", clase: "bg-aviso-suave text-aviso" },
};

export function Tag({ tipo, className = "" }: { tipo: Tipo; className?: string }) {
  const c = config[tipo];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${c.clase} ${className}`}>
      {c.texto}
    </span>
  );
}
