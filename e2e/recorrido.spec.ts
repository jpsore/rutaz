import { expect, test } from "@playwright/test";

// Fecha fija del servidor: 6 oct 2026 en Lima (ver playwright.config.ts).

test.describe("Este mes", () => {
  test("abre en octubre con feriado, avisos y los tres bloques en orden", async ({ page }) => {
    await page.goto("/?utm_source=tiktok");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("¿Qué hay en octubre?");
    await expect(page.getByText("Jue 8 de octubre · Combate de Angamos")).toBeVisible();
    await expect(page.getByText("Centro de Lima con desvíos por procesión")).toBeVisible();

    const bloques = page.getByRole("heading", { level: 2 });
    await expect(bloques).toHaveText(["Fiestas y eventos", "Destinos en su mejor momento", "Rutas temáticas"]);

    await expect(page.getByText("Popular").first()).toBeVisible();
    await expect(page.getByText("Joya escondida").first()).toBeVisible();
    await expect(page.getByText("Ahora", { exact: true }).first()).toBeVisible();
    // La Fiesta del Agua (2–5 oct) ya pasó
    await expect(page.getByText("Fiesta del Agua")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
  });

  test("pasa a noviembre (vacío) y vuelve", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Mes siguiente" }).click();
    await expect(page).toHaveURL(/\/mes\/2026-11$/);
    await expect(page.getByText("Estamos armando lo de noviembre.")).toBeVisible();
    await page.getByRole("link", { name: "Mes anterior" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("¿Qué hay en octubre?");
  });

  test("no deja ir a meses pasados ni muy lejanos", async ({ page }) => {
    await page.goto("/mes/2026-09");
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/mes/2027-01");
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Ficha", () => {
  test("abrir una tarjeta, ver la ficha y volver al mes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "San Pedro de Casta y Marcahuasi" }).click();
    await expect(page).toHaveURL(/\/destino\/san-pedro-de-casta\?mes=2026-10/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("San Pedro de Casta y Marcahuasi");
    await expect(page.getByText("4 000 m s. n. m.")).toBeVisible();
    await expect(page.getByText(/aclimátate, sube despacio/)).toBeVisible();
    await expect(page.getByText("Verificado: 28 sep").first()).toBeVisible();
    await expect(page.getByText("Cielos despejados para acampar en la meseta.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Armar mi ruta con esto" })).toBeInViewport();
    await page.getByRole("button", { name: "Volver" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("link directo desde TikTok y slug que no existe", async ({ page }) => {
    await page.goto("/evento/fiesta-del-agua?utm_source=tiktok");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fiesta del Agua");
    await expect(page.getByText("Fecha por confirmar · inicios de oct").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Este mes" })).toBeVisible();
    await page.goto("/destino/no-existe");
    await expect(page.getByText("No encontramos ese lugar")).toBeVisible();
  });
});

test.describe("Planificador e itinerario", () => {
  test("tarjeta → planificador → S/ 300 y 2 días → itinerario", async ({ page }) => {
    await page.goto("/");
    const tarjeta = page.getByRole("article").filter({ hasText: "San Pedro de Casta y Marcahuasi" });
    await tarjeta.getByRole("link", { name: "Armar mi ruta con esto" }).click();
    await expect(page).toHaveURL(/\/planificar\?tipo=destino&slug=san-pedro-de-casta/);
    await expect(page.getByText("San Pedro de Casta y Marcahuasi")).toBeVisible();

    const ver = page.getByRole("button", { name: "Ver mi ruta" });
    await expect(ver).toBeDisabled();
    await expect(page.getByRole("button", { name: "1", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "S/ 300" }).click();
    await page.getByRole("button", { name: "2", exact: true }).click();
    await ver.click();

    await expect(page).toHaveURL(/\/planificar\/ruta\?tipo=destino&slug=san-pedro-de-casta&presupuesto=300&dias=2/);
    await expect(page.getByText("S/ 258").first()).toBeVisible();
    await expect(page.getByText("Te alcanza ✓ · te sobran S/ 42")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Día 1" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Día 2" })).toBeVisible();
    await expect(page.getByText(/margen de imprevistos de 10 % \(S\/ 26\)/)).toBeVisible();
  });

  test("con S/ 150 no alcanza y quitar una parada recalcula", async ({ page }) => {
    await page.goto("/planificar/ruta?tipo=destino&slug=san-pedro-de-casta&presupuesto=150&dias=2");
    await expect(page.getByText("Te faltan S/ 40")).toBeVisible();
    await page.getByRole("button", { name: "Quitar" }).first().click();
    await expect(page.getByText("Te alcanza ✓ justo")).toBeVisible();
    await expect(page).toHaveURL(/quitar=5/);
  });

  test("parámetros inválidos muestran un mensaje amable", async ({ page }) => {
    await page.goto("/planificar/ruta?tipo=destino&slug=san-pedro-de-casta&presupuesto=999&dias=2");
    await expect(page.getByText("No pudimos armar esa ruta")).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver qué hay este mes" })).toBeVisible();
  });
});

test.describe("Guardar, Mis rutas y compartir", () => {
  test("guardar, cerrar el sheet, abrir en Mis rutas y borrar", async ({ page }) => {
    await page.goto("/planificar/ruta?tipo=destino&slug=barranco&presupuesto=300&dias=1");
    await page.getByRole("button", { name: "Guardar ruta" }).click();
    await expect(page.getByText("Ruta guardada ✓")).toBeVisible();
    await expect(page.getByRole("button", { name: "Guardada ✓" })).toBeDisabled();

    const sheet = page.getByRole("dialog", { name: "¿Creamos tu cuenta para no perder tus rutas?" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Ahora no" }).click();
    await expect(sheet).toBeHidden();

    await page.getByRole("link", { name: "Mis rutas" }).click();
    await expect(page.getByRole("heading", { name: "Mis rutas" })).toBeVisible();
    await page.getByRole("link", { name: /Barranco/ }).click();
    await expect(page.getByRole("button", { name: /Día 1/ })).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Peña criolla")).toBeVisible();

    await page.getByRole("button", { name: "Borrar esta ruta" }).click();
    await page.getByRole("button", { name: "Sí, borrar" }).click();
    await expect(page.getByText("Aún no guardas rutas")).toBeVisible();
  });

  test("dejar el correo en Sí, avísame", async ({ page }) => {
    await page.goto("/planificar/ruta?tipo=destino&slug=lomas-de-lachay&presupuesto=150&dias=1");
    await page.getByRole("button", { name: "Guardar ruta" }).click();
    const sheet = page.getByRole("dialog");
    await sheet.getByRole("button", { name: "Sí, avísame" }).click();
    const enviar = sheet.getByRole("button", { name: "Enviar" });
    await sheet.getByRole("textbox", { name: "Tu correo" }).fill("prueba@correo.pe");
    await expect(enviar).toBeDisabled();
    await sheet.getByRole("checkbox").check();
    await expect(enviar).toBeEnabled();
  });

  test("compartir sin menú nativo copia el link", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      // Simula un webview sin Web Share API
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    });
    await page.goto("/destino/barranco");
    await page.getByRole("button", { name: "Compartir" }).click();
    await expect(page.getByText("Link copiado ✓")).toBeVisible();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toContain("/destino/barranco?utm_source=compartido&utm_medium=share&utm_content=destino-barranco");
  });
});
