import type { MetadataRoute } from "next";
import { NOMBRE_APP } from "@/lib/sitio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NOMBRE_APP,
    short_name: NOMBRE_APP,
    description: "Qué hay este mes cerca de Lima, con tu ruta día a día y cuánto te cuesta.",
    lang: "es-PE",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f6fa",
    theme_color: "#5b3df5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
