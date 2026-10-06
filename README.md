# sdd-rutaz · specs SDD del MVP de Rutaz (versión lean)

## Cómo se trabaja con estas specs (Spec-Driven Development)

1. **La spec manda.** Cada historia tiene su archivo en `specs/` con criterios de aceptación (CA-x.y) en formato Dado / Cuando / Entonces. Cada CA es un requisito verificable.
2. **Primero el plan.** En cada paso de `PLAN.md`, Claude Code lee `CLAUDE.md` y la spec, propone un plan en modo plan que nombra los CA que cubre, y recién ahí programa.
3. **Primero los tests** de la lógica pura (fechas, motor del planificador, compartir, "Sí, avísame"), después el código.
4. **Lo que no está en la spec** se resuelve con la opción más simple y se anota en "Decisiones tomadas" de esa spec.
5. **El diseño pone la cara, no el alcance.** `design/` es solo referencia visual.


Todo lo necesario para construir el MVP de Rutaz con Claude Code. Copia esta carpeta completa a la raíz de tu proyecto, pon el código de Claude Design en `design/` y sigue `PLAN.md`.

| Archivo | Para qué |
|---|---|
| `PLAN.md` | **Empieza aquí.** 10 pasos con el prompt para pegar en Claude Code en cada uno. |
| `CLAUDE.md` | Reglas que Claude Code lee solo en cada sesión: stack, convenciones, lo que no se rompe. |
| `specs/00-vision-y-alcance.md` | Hipótesis, indicadores, recorrido, qué entra y qué no (y por qué no hay login). |
| `specs/01` a `07` | Una spec por grupo de historias del MVP, con criterios de aceptación verificables. |
| `docs/modelo-de-datos.md` | Tablas, reglas de acceso y cómo cargar un mes nuevo. |
| `docs/mvp-lean.md` | Por qué este MVP: supuestos de riesgo, smoke test y criterios de pivot. |
| `docs/medicion.md` | Eventos, indicadores con metas y alarmas, consultas y cómo leer los resultados. |
| `supabase/migrations/` | SQL listo para aplicar (probado en Postgres 16). |
| `supabase/seed.sql` | Contenido de ejemplo de octubre 2026 para construir y probar. |
| `design/` (lo agregas tú) | El prototipo de Claude Design. Solo referencia visual. |

**Stack:** Next.js + TypeScript + Tailwind, Supabase (base de datos, sin login), Vercel. Es web app para que el link de TikTok abra directo sin tienda de apps.

**Qué cambió frente a la primera versión:** sin login (en su lugar, "Sí, avísame" para medir interés), con Compartir, con los datos del diseño que suman confianza (altitud, dificultad, "Cuándo ir", "Verificado", "Fecha por confirmar", "Joya escondida") y un paso para pasar el estilo de Claude Design a la app.
