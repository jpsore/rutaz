"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Foto con respaldo: si se rompe, fondo de color con el nombre (nunca un ícono roto). */
export function Imagen({ src, alt, sizes, priority, className = "" }: Props) {
  const [rota, setRota] = useState(!src);
  if (rota) {
    return (
      <div className={`flex items-end bg-gradient-to-br from-acento to-[#8b6cff] p-3 ${className}`} role="img" aria-label={alt}>
        <span className="text-lg font-bold leading-tight text-white">{alt}</span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-gris ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={60}
        preload={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover"
        onError={() => setRota(true)}
      />
    </div>
  );
}
