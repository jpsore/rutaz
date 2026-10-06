"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconoCalendario, IconoGuardado } from "../iconos";

/** Barra inferior del MVP: solo "Este mes" y "Mis rutas". */
export function BottomNav() {
  const ruta = usePathname();
  const enMisRutas = ruta.startsWith("/mis-rutas");
  const items = [
    { href: "/", texto: "Este mes", activo: !enMisRutas, Icono: IconoCalendario },
    { href: "/mis-rutas", texto: "Mis rutas", activo: enMisRutas, Icono: IconoGuardado },
  ];
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-borde bg-superficie/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex h-16 max-w-[480px] items-stretch gap-2 px-4 py-2">
        {items.map(({ href, texto, activo, Icono }) => (
          <li key={href} className="flex-1">
            <Link
              href={href}
              aria-current={activo ? "page" : undefined}
              className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-[14px] text-[13px] font-semibold ${
                activo ? "bg-acento-suave text-acento-fuerte" : "text-texto-suave hover:bg-gris"
              }`}
            >
              <Icono className="h-5 w-5" />
              {texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
