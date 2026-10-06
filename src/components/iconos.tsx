// Íconos de línea simples (estilo del prototipo), sin dependencias.
type P = { className?: string };

function Base({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
    >
      {children}
    </svg>
  );
}

export const IconoCalendario = (p: P) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Base>
);
export const IconoGuardado = (p: P) => (
  <Base {...p}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Base>
);
export const IconoCompartir = (p: P) => (
  <Base {...p}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Base>
);
export const IconoAtras = (p: P) => (
  <Base {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Base>
);
export const IconoAdelante = (p: P) => (
  <Base {...p}>
    <path d="M9 18l6-6-6-6" />
  </Base>
);
export const IconoAviso = (p: P) => (
  <Base {...p}>
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
  </Base>
);
export const IconoCheck = (p: P) => (
  <Base {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Base>
);
export const IconoCerrar = (p: P) => (
  <Base {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Base>
);
export const IconoBus = (p: P) => (
  <Base {...p}>
    <rect x="4" y="3" width="16" height="15" rx="2" />
    <path d="M4 11h16M8 21v-3M16 21v-3M8 15h.01M16 15h.01" />
  </Base>
);
export const IconoFiesta = (p: P) => (
  <Base {...p}>
    <path d="M5.8 11.3L2 22l10.7-3.8M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.2.7a2.9 2.9 0 0 0-1.9 3.4c.2.9-.4 1.9-1.4 1.9H16M11 13c1.9 1.9 2.4 4.3 1.2 5.5-1.3 1.2-3.7.7-5.6-1.2-1.9-1.9-2.4-4.3-1.2-5.5C6.6 10.6 9 11.1 11 13z" />
  </Base>
);
export const IconoMontana = (p: P) => (
  <Base {...p}>
    <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
  </Base>
);
export const IconoBasura = (p: P) => (
  <Base {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Base>
);
export const IconoChevronAbajo = (p: P) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
);
