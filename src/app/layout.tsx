import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TrackApertura } from "@/components/Track";
import { BottomNav } from "@/components/ui/BottomNav";
import { NOMBRE_APP, urlSitio } from "@/lib/sitio";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlSitio()),
  title: { default: `${NOMBRE_APP} · ¿A dónde me escapo este finde?`, template: `%s · ${NOMBRE_APP}` },
  description: "Qué hay este mes cerca de Lima, con tu ruta día a día y cuánto te cuesta.",
  applicationName: NOMBRE_APP,
  appleWebApp: { capable: true, title: NOMBRE_APP, statusBarStyle: "default" },
  openGraph: { siteName: NOMBRE_APP, locale: "es_PE", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#5b3df5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <div className="mx-auto min-h-dvh max-w-[480px] bg-fondo pb-[calc(64px+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomNav />
        <TrackApertura />
      </body>
    </html>
  );
}
