import { defineConfig } from "@playwright/test";

// Todo se prueba primero en viewport de celular (390×844), como el navegador de TikTok.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "es-PE",
    timezoneId: "America/Lima",
    // Usa el Chrome instalado si no hay navegadores de Playwright descargados.
    channel: process.env.PW_CHANNEL ?? "chrome",
  },
  webServer: {
    // Contenido local del seed y fecha fija (6 oct 2026, Lima) para que los tests no dependan del día.
    command: "npm run build && npx next start -p 3100",
    // Sin Supabase en el navegador: los tests no ensucian la medición real.
    env: {
      RUTAZ_CONTENIDO_LOCAL: "1",
      RUTAZ_AHORA: "2026-10-06T15:00:00Z",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    },
    url: "http://localhost:3100",
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
