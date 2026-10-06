# Modelo de datos

La fuente de verdad es `supabase/migrations/0001_contenido.sql` (contenido e interés en cuenta) y `0002_medicion.sql` (medición). Ambas migraciones y `supabase/seed.sql` corren limpias en Postgres 16. Este documento explica el porqué.

## Idea general

```
destinations ◄── festivities          (un evento ocurre en un destino)
     ▲   ▲
     │   └────── themes               (una ruta temática tiene un destino principal)
     │
month_picks ──► destino | evento | temática    (qué tarjeta sale en qué mes)
itinerary_templates ──► destino | evento | temática ──► template_stops
holidays · alerts (por slugs de destino)
account_interest (correos de "Sí, avísame")        analytics_events
```

- Las tablas se relacionan por **slug** (`san-pedro-de-casta`), no por ids raros. Así puedes editar todo en el Table Editor de Supabase entendiendo lo que escribes, y las llaves foráneas igual cuidan que no apuntes a algo que no existe.
- `tipo` + una de tres columnas (`evento_slug`, `destino_slug`, `tematica_slug`) es el patrón para "esto apunta a un evento, destino o temática". Un `check` obliga a llenar exactamente la que corresponde.

## Tablas de contenido

| Tabla | Qué guarda | Notas |
|---|---|---|
| `destinations` | Lugares: qué es, cómo llegar, tiempo desde Lima, mejor época, `meses_ideales`, `meses_evitar`, `altitud_m`, `dificultad`, `dias_minimos` | `publicado = false` lo oculta sin borrarlo. Los meses son números 1–12 y no pueden estar en ideales y evitar a la vez |
| `festivities` | Fiestas y eventos con fecha de inicio y fin | Siempre ligado a un destino. Si la fecha oficial no salió: `fecha_confirmada = false` y `fecha_aprox` ("inicios de oct"); igual pon un `fecha_inicio`/`fecha_fin` estimado para que se ordene y aparezca en su mes |
| `themes` | Rutas temáticas ("Lima criolla y procesiones") | `lugares` es la lista que se ve en la ficha |
| `holidays` | Feriados | Solo los `es_largo` se destacan en "Este mes" |
| `month_picks` | Una fila = una tarjeta en un mes | `mes` siempre día 1 (`2026-10-01`); `orden` ordena el carrusel; `etiqueta` opcional: `joya-escondida` o `popular` |
| `alerts` | Avisos de temporada con rango de fechas | `destino_slugs` vacío = aviso general, solo en el inicio |

## Plantillas del planificador

| Tabla | Qué guarda |
|---|---|
| `itinerary_templates` | Un itinerario prearmado para un plan y un número de días (1 a 3). Único por plan + días. |
| `template_stops` | Las paradas: día, orden, hora, actividad, categoría, costo en los tres niveles, si es `opcional` y `verificado_el` (obligatorio en transporte). |

Reglas:
- Costos **por persona**, en soles enteros. Un `check` obliga a que económico ≤ estándar ≤ cómodo.
- Un **evento sin plantillas propias usa las de su destino**. Así la Fiesta del Agua reutiliza el itinerario de San Pedro de Casta.
- `opcional = true` marca paradas que el motor puede sugerir quitar cuando no alcanza (caballo, guía, peña).
- `verificado_el` es la fecha en que confirmaste precio y horario de un tramo de transporte. Si tiene más de 60 días, la app muestra "Confirmar antes de viajar". Es la mejor defensa de la confianza cuando un precio cambia.

## Rutas guardadas

En el MVP las rutas viven **solo en el celular** (`localStorage`) con la forma `id`, `plan`, `parametros`, `snapshot`. El `id` lo genera el celular (uuid), así en R2 se podrán subir a una tabla `saved_routes` sin duplicar.

`snapshot` guarda el resultado completo del motor. Si después cambias costos en una plantilla, las rutas ya guardadas no cambian.

## Interés en cuenta (puerta falsa)

`account_interest` guarda el correo, el `anon_id` del celular y el consentimiento (`acepta_avisos`, siempre `true`). Sirve para medir si vale la pena construir el login y para avisarles cuando exista. No tiene índice único a propósito: la app no debe revelar si un correo ya estaba registrado.

## Acceso (RLS)

- **Contenido:** cualquiera lee lo publicado; nadie escribe desde la app. Tú editas desde el dashboard de Supabase.
- **Interés en cuenta:** la app solo inserta; nadie lee correos desde la app (probado: el rol `anon` ve 0 filas; correos inválidos y sin consentimiento se rechazan).
- **Medición:** la app solo inserta eventos. Nadie los lee desde la app (probado: el rol `anon` ve 0 filas).
- Nunca se usa la service role key en el navegador.

## Cómo cargar un mes nuevo

1. Crea los destinos, eventos o temáticas que falten (con imagen en Supabase Storage o en `/public/img`).
2. Crea sus plantillas en `itinerary_templates` y sus paradas en `template_stops`. Cada tramo de transporte lleva la fecha en que lo verificaste (`verificado_el`).
3. Agrega los feriados del mes en `holidays` y los avisos en `alerts`.
4. Agrega las tarjetas del mes en `month_picks`.
5. En el SQL Editor corre `select * from chequeo_contenido;`. Debe salir vacío. Si no, te dice qué falta: tarjetas sin plantilla, días vacíos, avisos con destinos mal escritos, transporte verificado hace más de 60 días, fiestas con fecha por confirmar y destinos de altura marcados como dificultad baja.

Los cambios se ven en la app en máximo una hora (ISR). Si quieres verlos al toque, redeploy en Vercel.

Consejo: para cargar mucho de una vez, pídele a Claude Code "genera el SQL de inserts para noviembre con estos datos" y pégalo en el SQL Editor.
