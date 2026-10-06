# Rutaz app · guía para Claude Code

Rutaz es una web app (PWA) mobile first que le resuelve a alguien en Lima la pregunta "¿a dónde me escapo este finde?". Abre en "¿Qué hay en este mes?", la persona toca una tarjeta, pone presupuesto y días, y recibe un itinerario día a día con costo. Lo guarda en el celular o lo comparte por WhatsApp. **No hay login en el MVP.**

La mayoría del tráfico llega desde TikTok, o sea desde el **navegador interno de TikTok** en el celular. Todo se diseña y se prueba primero para eso.

## Antes de tocar código

1. Lee la spec de la historia en `specs/` que te pidieron. Cada criterio de aceptación (CA) es un requisito.
2. Para cómo se ve (colores, tipografía, tarjetas, espaciados, íconos), mira el prototipo de Claude Design en `design/`. Es **referencia visual, no código para copiar**: reescribe con Tailwind y los componentes de este proyecto. Si el prototipo muestra algo que la spec no tiene (pestaña Inicio, login, guías, mapa, multi-destino), **no lo construyas**: manda la spec.
3. Si algo no está en la spec, elige la opción más simple y déjalo anotado en la sección "Decisiones tomadas" de esa spec.
4. No agregues funcionalidades de R2/R3 (login real, filtros, mapa, reservas, reseñas, sincronizar, offline completo, planificador libre, multi-destino, guías). Compartir **sí** entra (spec 07).

## Stack

- Next.js (App Router) + TypeScript estricto + Tailwind CSS.
- Supabase: Postgres para contenido, correos de "Sí, avísame" y eventos de medición. **Sin Supabase Auth** en el MVP.
- Deploy en Vercel. PWA con `manifest.webmanifest` e íconos (sin service worker complejo en el MVP).
- Tests: Vitest para lógica pura (motor del planificador, fechas, medición). Playwright para el recorrido completo en viewport 390×844.

## Reglas del producto que no se rompen

- **No hay login.** El único lugar donde se pide algo es el sheet "Sí, avísame" después de guardar (solo correo, con consentimiento, siempre se puede cerrar).
- Las rutas guardadas viven en `localStorage`.
- Todo dato de transporte muestra su "Verificado: fecha" y "Confirmar antes de viajar" si tiene más de 60 días.
- El destino que viene de una tarjeta **no se pierde** en el planificador (va en la URL).
- Dinero siempre en soles, formato `S/ 1,250` (es-PE), costos **por persona**.
- Fechas y "mes actual" se calculan en la zona `America/Lima`, nunca con la hora del servidor.
- Textos en español de Perú, tuteando, tono cercano. Sin jerga técnica en la UI.

## Convenciones de código

- `src/app/` rutas, `src/components/` UI, `src/lib/` lógica pura y clientes, `src/lib/planner/` motor del planificador.
- La lógica de negocio va en funciones puras con tests; los componentes solo muestran.
- Lecturas de contenido con Supabase desde Server Components (clave `anon`, RLS de solo lectura). Nunca uses la service role key en el cliente.
- Toda interacción que mide un indicador llama a `track()` de `src/lib/analytics.ts` con un nombre de evento de `docs/medicion.md`. No inventes nombres nuevos sin agregarlos ahí.
- Botones de acción grandes (mínimo 48px de alto), contraste AA.

## Comandos

- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`.
- Antes de decir que algo está listo: `npm run lint && npm run typecheck && npm test` en verde.

## Mapa de documentos

- `specs/00-vision-y-alcance.md` qué es el MVP y qué no.
- `specs/01-este-mes.md` … `specs/07-compartir.md` una spec por grupo de historias.
- `design/` el prototipo de Claude Design (lo copias tú). Solo referencia visual.
- `docs/modelo-de-datos.md` tablas y reglas de acceso. La migración real está en `supabase/migrations/`.
- `docs/medicion.md` eventos, indicadores y consultas.
- `PLAN.md` el orden de construcción, paso a paso.
