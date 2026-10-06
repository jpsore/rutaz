# Medición de los indicadores de éxito

Medimos con una tabla propia en Supabase (`analytics_events`) y tres vistas SQL. Es gratis, no necesita otra herramienta y responde exactamente las cuatro preguntas de la hipótesis. Si más adelante pones anuncios pagados en TikTok, ahí sí conviene sumar el Pixel de TikTok (fuera del MVP).

## Identidad del visitante

- `anon_id`: uuid creado la primera vez y guardado en `localStorage` (`rutaz.anon_id`). Es "el visitante".
- `session_id`: uuid en `sessionStorage`; se renueva tras 30 min sin actividad.
- `user_id`: siempre `null` en el MVP (no hay login). La columna queda para R2.
- UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) y `ttclid`: se leen de la URL en la primera página y se guardan en `sessionStorage` para todos los eventos de la sesión.
- `es_webview`: si está dentro del navegador de TikTok, Instagram o Facebook.

## Cliente: `src/lib/analytics.ts`

```ts
track(nombre: NombreEvento, props?: Record<string, unknown>): void
```

- Inserta en `analytics_events` con la clave `anon`, sin esperar respuesta (no bloquea la UI) y con `keepalive`.
- `NombreEvento` es un union type con exactamente la lista de abajo; la base rechaza cualquier otro nombre.
- En desarrollo (`NODE_ENV !== "production"`) solo hace `console.debug`.
- `app_open` se dispara una vez por sesión, en el layout raíz.

## Eventos

| Evento | Cuándo | Props |
|---|---|---|
| `app_open` | Primera página de la sesión | `{ entrada: ruta }` |
| `month_view` | Se ve un mes | `{ mes }` |
| `month_next_click` | Toca "mes siguiente" | `{ desde, hacia }` |
| `card_open` | Toca una tarjeta (abre ficha) | `{ tipo, slug, bloque }` |
| **`card_cta_click`** | Toca "Armar mi ruta con esto" | `{ tipo, slug, origen: "inicio" \| "ficha" }` |
| `detail_view` | Se ve una ficha | `{ tipo, slug, origen }` |
| `planner_view` | Se ve el planificador | `{ tipo, slug }` |
| `planner_submit` | Toca "Ver mi ruta" | `{ tipo, slug, presupuesto, dias }` |
| **`itinerary_view`** | Se ve un itinerario | `{ tipo, slug, presupuesto, dias, nivel, total, alcanza }` |
| `suggestion_click` | Usa una sugerencia | `{ tipo: "menos_dias" \| "quitar_parada" }` |
| **`route_saved`** | Guarda una ruta | `{ tipo, slug, dias, presupuesto }` |
| `saved_route_open` | Abre una ruta guardada | `{ id_ruta }` |
| `saved_route_delete` | Borra una ruta | `{ id_ruta }` |
| `share_click` | Toca "Compartir" | `{ origen: "itinerario" \| "ficha" \| "mis-rutas", tipo, slug }` |
| **`share_completed`** | Compartió (menú nativo sin cancelar) o copió el link | `{ metodo: "nativo" \| "copiar" }` |
| `account_offer_shown` | Aparece el sheet "Sí, avísame" | `{}` |
| `account_offer_dismissed` | "Ahora no" | `{}` |
| **`account_interest_submitted`** | Dejó su correo (insert en `account_interest` ok) | `{}` (nunca el correo) |

En negrita, los que alimentan los indicadores.

## Indicadores y metas

| Indicador | Definición | Meta | Alarma | Vista |
|---|---|---|---|---|
| Activación | visitantes con `card_cta_click` / visitantes | ≥ 40% | < 20% | `kpi_semanal.activacion_pct` |
| Valor | visitantes con `itinerary_view` / visitantes | ≥ 25% | < 10% | `kpi_semanal.valor_pct` |
| Intención | visitantes con `route_saved` o `share_completed` / visitantes | ≥ 15% | < 5% | `kpi_semanal.guardan_o_comparten_pct` (y por separado `guardan_pct`, `comparten_pct`) |
| Interés en cuenta | de los que guardan, cuántos dejan correo | ≥ 20% | < 5% | `kpi_semanal.correo_de_guardan_pct` |
| Difusión | visitantes cuya primera fuente es `compartido` | ≥ 10% | — | `kpi_semanal.llegan_por_compartido_pct` |
| Retorno | visitantes que abren la app otro día dentro de 30 días | ≥ 20% | < 8% | `kpi_retorno.retorno_pct` |

Los correos de la puerta falsa se ven con `select count(distinct lower(correo)) from account_interest;` (la tabla no tiene índice único a propósito, para no revelar si un correo ya existía).

Las vistas agrupan por semana de primera visita. El retorno solo cuenta visitantes que llegaron hace 30 días o más (si no, todavía no tuvieron tiempo de volver).

## Cómo mirarlos

En Supabase → SQL Editor:

```sql
select * from kpi_semanal;          -- activación, valor, intención por semana
select * from kpi_retorno;          -- retorno a 30 días por semana
select fuente, count(*), round(100.0*avg(activado::int),1) activacion
from kpi_visitantes group by 1;     -- ¿TikTok convierte distinto que otras fuentes?
```

Las vistas se probaron con datos de ejemplo en Postgres 16. Guarda esas consultas como "snippets" en el SQL Editor para abrirlas con un clic.

## Limitaciones a tener en cuenta

- **El navegador de TikTok puede borrar `localStorage`.** Alguien que vuelve puede contar como visitante nuevo, así que el retorno real probablemente es **mayor** que el medido. Sin login no hay forma de reconocerlo; es un costo aceptado del MVP.
- Visitantes son navegadores, no personas: el mismo humano en el celular y en la laptop cuenta dos veces.
- Los bots y previsualizaciones de links pueden inflar `app_open`; por eso `app_open` se dispara desde el cliente, no desde el servidor.
- Muestra chica: con menos de ~200 visitantes por semana, los porcentajes saltan mucho. Mira tendencias de varias semanas antes de concluir.

## Cómo leer los resultados

- **Activación baja:** el contenido del mes no engancha (tarjetas, fotos, textos, o el video de TikTok promete algo distinto a lo que se ve).
- **Activación ok, valor bajo:** el planificador asusta o confunde (¿abandonan en `planner_view` sin `planner_submit`?).
- **Valor ok, pocos guardan:** el itinerario no convence (¿costos creíbles? ¿mucho "no te alcanza"? revisa `alcanza` en `itinerary_view`).
- **Guardan pero casi nadie deja correo:** la cuenta no le importa a la gente todavía; el login puede seguir en R2. Si ≥ 20 % lo deja, constrúyelo.
- **Comparten mucho pero guardan poco:** el itinerario se usa para convencer al grupo, no para seguirlo; dale más peso a Compartir.
- **Retorno bajo:** falta razón para volver; el mes siguiente tiene que estar cargado antes de que empiece.
