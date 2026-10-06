# Plan de construcción en Claude Code

Diez pasos chicos, cada uno deja algo que funciona y se puede ver en el celular. Cada paso trae el prompt para pegar en Claude Code y cómo saber que quedó.

Esta es la **versión lean** del MVP: sin login. Al guardar una ruta se ofrece "Sí, avísame" (solo correo) para medir si a la gente le importa tener cuenta, y se suma **Compartir**. El porqué está en `specs/00-vision-y-alcance.md`.

## Cómo trabajar con Claude Code (plan Pro)

- **Un paso = una sesión.** Al terminar un paso, haz commit y escribe `/clear` antes del siguiente. Así cada sesión arranca liviana y rinde más tu cuota del plan Pro.
- **Primero el plan, después el código.** Al empezar cada paso entra en modo plan (`Shift+Tab` hasta ver "plan mode"), pega el prompt, revisa lo que propone y recién ahí acéptalo.
- **Las specs mandan; el diseño solo pone la cara.** Todos los prompts dicen "lee CLAUDE.md y la spec X". Si Claude Code se desvía, o empieza a construir algo que vio en `design/` y no está en la spec, respóndele "eso no está en la spec, vuelve a la spec".
- **Prueba en tu celular de verdad** al final de cada paso, no solo en la compu.
- **Si se te acaba la cuota** a mitad de un paso, no pasa nada: al volver dile "continúa el paso N, revisa `git status` para ver dónde quedaste".
- **Nunca pegues claves en el chat.** Van en `.env.local` (que no se sube a GitHub) y en las variables de entorno de Vercel.

---

## Paso 0 · Preparación (lo haces tú)

1. Crea cuentas gratis en **GitHub**, **Supabase** y **Vercel** (entra a Vercel con tu GitHub).
2. Instala Node.js LTS y Claude Code, y verifica con `claude --version`.
3. Crea una carpeta `rutaz`, copia dentro todo el contenido de esta carpeta (`CLAUDE.md`, `PLAN.md`, `specs/`, `docs/`, `supabase/`). `CLAUDE.md` va en la raíz, porque Claude Code lo lee solo.
4. Exporta el código del prototipo de Claude Design y ponlo en `rutaz/design/` (tal cual lo baja, sin ordenarlo). Es la referencia visual.
5. **Elige el nombre**: el diseño dice "Rutas Lima" y las specs "Rutaz". Si cambias a otro, reemplázalo en `CLAUDE.md` antes del Paso 1.
6. En Supabase crea un proyecto en la región más cercana (São Paulo). Guarda la contraseña de la base en tu gestor de contraseñas.
7. Abre Claude Code en la carpeta con `claude`.

Así queda la carpeta:

```
rutaz/
├── CLAUDE.md
├── PLAN.md
├── design/      ← código de Claude Design (solo referencia)
├── docs/
├── specs/
└── supabase/
```

---

## Paso 1 · Esqueleto de la app

```
Lee CLAUDE.md y specs/00-vision-y-alcance.md.
Crea el proyecto Next.js (App Router, TypeScript estricto, Tailwind, ESLint) en esta carpeta
sin borrar los archivos que ya existen (no toques design/, docs/, specs/ ni supabase/).
Excluye design/ de ESLint, TypeScript y del build. Agrega Vitest y Playwright con los scripts de CLAUDE.md.
Arma el layout mobile first con barra inferior de dos ítems: "Este mes" y "Mis rutas".
Páginas vacías para / y /mis-rutas. Manifest PWA con el nombre de CLAUDE.md e íconos de placeholder.
No definas todavía colores ni tipografía: eso sale del diseño en el paso 2.
Inicializa git y haz el primer commit.
```

**Listo cuando:** `npm run dev` abre la app, en 390px de ancho se ve la barra inferior, y `npm run lint && npm run typecheck && npm test` pasa.

## Paso 2 · Sistema visual desde Claude Design

```
Lee CLAUDE.md y revisa el prototipo en design/ (solo como referencia visual, no copies su código).
1. Hazme primero un resumen corto de lo que encontraste: paleta, tipografía, radios, sombras,
   espaciados, íconos y cómo se ven tarjetas, chips, botones, barra inferior y bottom sheet.
2. Pásalo a tokens de Tailwind (colores con nombre: acento, secundario, fondo, texto, aviso, etc.)
   y carga la fuente con next/font.
3. Crea en src/components/ui/ los componentes base, reescritos con Tailwind:
   Button (principal y secundario, mínimo 48px de alto), Chip (seleccionable), Tag ("Joya escondida",
   "Popular", "Ahora", "Fecha por confirmar"), PlanCard, AlertBanner, BottomSheet, BottomNav (solo 2 ítems).
4. Haz una página temporal /dev/ui que muestre todos los componentes con datos de ejemplo.
Respeta contraste AA aunque el diseño no lo cumpla. No construyas pantallas que no estén en specs/
(el diseño trae Inicio con 4 pestañas, login, guías, mapa: nada de eso entra).
```

**Listo cuando:** `/dev/ui` en tu celular se parece al prototipo de Claude Design y todos los botones se tocan fácil con el pulgar.

## Paso 3 · Base de datos

Antes: copia en `.env.local` la URL del proyecto y la clave `anon` (Supabase → Project Settings → API).

```
Lee CLAUDE.md y docs/modelo-de-datos.md.
Instala la Supabase CLI como dependencia de desarrollo y enlaza el proyecto (te daré el project ref y
la contraseña de la base en la terminal cuando me lo pidas, no en el chat).
Aplica supabase/migrations con `supabase db push` y luego carga supabase/seed.sql.
Genera los tipos TypeScript en src/lib/database.types.ts y crea src/lib/supabase/ con un cliente
para Server Components y otro para el navegador, ambos con la clave anon. No configures Auth.
Haz una página temporal /dev/contenido que liste los month_picks de octubre 2026 para probar.
```

**Listo cuando:** `/dev/contenido` muestra las 6 tarjetas del seed y `select * from chequeo_contenido` sale vacío.

## Paso 4 · "Este mes"

```
Lee CLAUDE.md y specs/01-este-mes.md. Implementa la spec completa, criterio por criterio,
usando los componentes de src/components/ui/.
Empieza por src/lib/fechas.ts con sus tests (mes actual en America/Lima, rangos, formato "3 – 6 oct").
Usa las imágenes del seed como placeholders (crea /public/img con imágenes simples si no existen).
Los botones "Armar mi ruta con esto" pueden apuntar a /planificar?tipo=…&slug=… aunque esa página aún no exista.
Deja track() como función vacía en src/lib/analytics.ts; la medición real va en el paso 9.
Al final agrega un test de Playwright que abre / en 390×844 y verifica los tres bloques.
Borra /dev/contenido.
```

**Listo cuando:** en tu celular ves octubre con el feriado del 8, los avisos, los tres carruseles con las etiquetas "Joya escondida" y "Popular", la Fiesta del Agua con "Fecha por confirmar", y puedes pasar a noviembre (estado vacío) y volver.

## Paso 5 · Ficha

```
Lee CLAUDE.md y specs/02-ficha.md. Implementa la spec completa: altitud, dificultad y días mínimos,
aviso de aclimatación, calendario "Cuándo ir" y tramos con "Verificado".
Crea src/lib/verificacion.ts con estadoVerificacion(fecha, hoy) y sus tests (60 días es el límite).
Incluye los metadatos og: de cada ficha y la página "No encontramos ese lugar".
El ícono de compartir puede quedar sin acción por ahora (va en el paso 8).
Agrega al test de Playwright: abrir una tarjeta, ver la ficha, volver al mes.
```

**Listo cuando:** puedes abrir `/destino/san-pedro-de-casta` directo desde el celular y ver la altitud con el aviso de aclimatación, el calendario y los tramos verificados, con el botón fijo abajo.

## Paso 6 · Motor del planificador (solo lógica, con tests)

```
Lee CLAUDE.md y specs/04-itinerario.md, sección "Motor del planificador".
Implementa src/lib/planner/ como funciones puras, escribiendo PRIMERO los tests en Vitest
(todos los "Tests mínimos" de la spec) y después el código hasta que pasen.
Agrega un test con los datos reales del seed: San Pedro de Casta, 2 días, S/ 150 no alcanza
y sugiere quitar el caballo y el guía; con S/ 300 da estándar; con S/ 500+ da cómodo.
No toques la UI en este paso.
```

**Listo cuando:** `npm test` en verde y los casos del seed dan lo esperado.

## Paso 7 · Planificador e itinerario

```
Lee CLAUDE.md, specs/03-planificador.md y specs/04-itinerario.md. Implementa ambas specs
usando el motor de src/lib/planner/, incluido el margen de imprevistos de 10 % y los tramos verificados.
Los botones "Guardar ruta" y "Compartir" pueden quedar sin acción por ahora.
Agrega al test de Playwright el recorrido: tarjeta → planificador → elegir S/ 300 y 2 días → ver itinerario.
```

**Listo cuando:** desde una tarjeta llegas al itinerario en 3 toques, ves "Te alcanza ✓" o las sugerencias, y quitar una parada recalcula.

## Paso 8 · Guardar, Compartir y "Sí, avísame"

```
Lee CLAUDE.md, specs/05-guardar-y-mis-rutas.md, specs/06-avisame-cuenta.md y specs/07-compartir.md.
Implementa las tres specs:
- Guardar y Mis rutas solo con LocalStore (localStorage). No implementes SupabaseStore ni login.
- Compartir con Web Share API y respaldo de copiar link, en itinerario, ficha y ruta guardada.
- El bottom sheet "Sí, avísame" que inserta en account_interest, con debeMostrarOferta() y sus tests,
  y la página /privacidad.
Agrega al test de Playwright: guardar, ver el sheet y tocar "Ahora no", ir a Mis rutas, abrir la ruta, borrarla.
```

**Listo cuando:** guardas una ruta en el celular, cierras el navegador, vuelves y sigue en "Mis rutas"; compartes una ruta por WhatsApp y el link se ve con foto y abre el itinerario; dejas tu correo y aparece en Supabase → Table Editor → `account_interest`.

## Paso 9 · Medición

```
Lee CLAUDE.md y docs/medicion.md. Implementa src/lib/analytics.ts tal cual la sección "Cliente",
con anon_id, session_id, UTM, ttclid y detección de webview (src/lib/webview.ts con tests de
user agents reales de TikTok, Instagram, Facebook, Chrome y Safari).
Conecta todos los eventos de la tabla en las pantallas que ya existen, incluidos share_* y account_*.
Nunca mandes el correo en props.
```

**Listo cuando:** haces el recorrido completo en el celular con `?utm_source=tiktok`, compartes y dejas tu correo, y en Supabase `select * from kpi_semanal` te muestra tu visita con activación, valor, intención y correo al 100%. Abre el link compartido en otro celular y verás `llegan_por_compartido_pct` mayor a 0.

## Paso 10 · Listo para TikTok y deploy

Antes: conecta el repo de GitHub a Vercel y copia las variables de `.env.local` a Vercel.

```
Lee CLAUDE.md. Revisa la app para lanzarla con tráfico de TikTok:
- Lighthouse móvil en /, una ficha y un itinerario: LCP < 2.5 s, accesibilidad ≥ 90. Corrige lo que falle.
- Imágenes og: atractivas para el inicio, cada ficha y el itinerario compartido.
- Página 404 y error amables, sin pantallas en blanco.
- Que nada se rompa si localStorage no está disponible (guardar ofrece compartir en su lugar).
- Compartir dentro del navegador de TikTok: si no hay menú nativo, que copie el link.
- Corre todos los tests de Playwright en viewport 390×844.
- Confirma que design/ no entra al build ni al deploy.
Hazme una lista de lo que no pudiste verificar tú y tengo que probar yo en el celular.
```

**Listo cuando:** la URL de Vercel abre rápido desde el navegador de TikTok en Android y en iPhone, y haces el recorrido completo en ambos, compartir incluido.

---

## Antes de lanzar

- **Carga noviembre completo** (ver "Cómo cargar un mes nuevo" en `docs/modelo-de-datos.md`). Sin mes siguiente no hay retorno.
- **Verifica los datos del seed**: fechas de fiestas (marca `fecha_confirmada` cuando salga la oficial), costos, tiempos, altitudes, y pon en `verificado_el` el día en que confirmaste cada tramo de transporte. Hoy son de ejemplo.
- **Pon tu correo de contacto** en `/privacidad`.
- **Prueba con 5 personas** que no conozcan la app: dales el link y míralas usarlo sin ayudar. Anota dónde dudan.
- **Links para TikTok**: en la bio, el inicio con `?utm_source=tiktok&utm_medium=bio`; en cada video que hable de un plan, el link a su ficha con `utm_campaign` = nombre del video. Así sabes qué video trae gente que arma rutas.

## Después de lanzar: rutina mensual

- Semana 3 de cada mes: carga el mes siguiente, re-verifica los tramos que `chequeo_contenido` marque y córrelo hasta que salga vacío.
- Cada lunes: mira `kpi_semanal` y `kpi_retorno`, y compara contra las metas y alarmas de `docs/medicion.md`.
- A las 8 semanas: decide con los números si sigues, cambias o pivoteas (criterios en `docs/mvp-lean.md`). Si `correo_de_guardan_pct` ≥ 20 %, el login real entra en R2 y les escribes a esos correos.
