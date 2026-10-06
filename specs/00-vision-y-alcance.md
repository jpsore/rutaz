# 00 · Visión y alcance del MVP

## Problema

Mucha gente en Lima tiene ganas de salir el fin de semana o el feriado largo, pero no sabe a dónde ir ni cuánto le va a costar. Termina no saliendo, o yendo siempre a lo mismo.

## Hipótesis

Quien tiene ganas de salir pero no sabe a dónde, si ve "qué hay este mes", va a elegir un plan y armar su ruta en minutos. Y va a volver a la app el mes siguiente.

## Indicadores de éxito (primeros 2 meses)

| Indicador | Meta | Cómo se mide |
|---|---|---|
| Activación | ≥ 40% de visitantes toca "Armar mi ruta con esto" | `card_cta_click` / visitantes |
| Valor | ≥ 25% de visitantes ve su itinerario | `itinerary_view` / visitantes |
| Intención | ≥ 15% guarda o comparte una ruta | `route_saved`, `share_completed` |
| Interés en cuenta | ≥ 20% de los que guardan deja su correo en "Sí, avísame" | `account_interest_submitted` |
| Retorno | ≥ 20% vuelve en los siguientes 30 días | visitas en otro día dentro de 30 días |
| Difusión | ≥ 10% de visitantes llega por un link compartido | `utm_source = compartido` |

Detalle de eventos, umbrales de alarma y consultas en `docs/medicion.md`. Los números son puntos de partida, no datos de mercado. Los supuestos, el smoke test y los criterios de pivot a las 8 semanas están en `docs/mvp-lean.md`.

**Cómo leerlos:** si la activación sale baja, el problema está en el contenido del mes. Si la gente arma rutas pero no las guarda ni comparte, el planificador no convence. Si guardan pero nadie deja correo, el login puede seguir esperando.

## Por qué no hay login en el MVP

Que la gente cree cuenta no es un riesgo que mate la idea; que toque "Armar mi ruta", que guarde o comparta y que vuelva, sí. El login (código por correo, Google, migrar rutas) era el paso más caro y el más frágil dentro del navegador de TikTok. En su lugar hay una **puerta falsa**: al guardar se ofrece "Sí, avísame" y solo se pide el correo (spec 06). Si ≥ 20% de los que guardan lo deja, el login entra en R2.

## Para quién

- **El indeciso** (principal): quiere salir pero no sabe a dónde. Entra por "¿Qué hay en este mes?". Casi siempre llega desde un video de TikTok.
- **El que ya tiene destino:** sabe a dónde ir y quiere armar la ruta con su presupuesto y días.

## Recorrido del MVP

```
Este mes ──tarjeta──► Ficha ──► Planificador ──► Itinerario ──► Guardar ──► (sheet "Sí, avísame")
   │  └──"Armar mi ruta con esto"──────►┘               │                          │
   │                                                    └──► Compartir (WhatsApp…) │
   └──────────── barra inferior ────────────────────► Mis rutas ◄──────────────────┘
```

## Historias del MVP y dónde está su spec

| # | Historia | Spec |
|---|---|---|
| H1 | Ver qué hay este mes en tres bloques | 01 |
| H2 | Ver los feriados largos del mes | 01 |
| H3 | Pasar al mes siguiente | 01 |
| H4 | Ver avisos de temporada | 01 y 02 |
| H5 | Ver la ficha de un destino o evento | 02 |
| H6 | Tocar "Armar mi ruta con esto" y llegar con el destino puesto | 03 |
| H7 | Ingresar presupuesto y días | 03 |
| H8 | Recibir un itinerario día a día | 04 |
| H9 | Ver el costo estimado y si me alcanza | 04 |
| H10 | Guardar una ruta en el celular | 05 |
| H11 | Abrir mi ruta guardada durante el viaje | 05 |
| H12 | Dejar mi correo para que me avisen cuando haya cuentas (puerta falsa) | 06 |
| H13 | Compartir mi ruta o una ficha por WhatsApp | 07 |

## Fuera de alcance (R2/R3)

**Login real** (código por correo, Google, rutas en la nube, migrar rutas del celular), sincronizar entre dispositivos, inicio con varias puertas ("Planificar", "Descubre tu ciudad"), planificador libre sin destino, rutas multi-destino, regenerar itinerario, guías locales con WhatsApp, rutas temáticas con mapa, galería de fotos, filtros, mapa, editar paradas, punto de partida distinto a Lima, uso 100% offline, abrir paradas en Google Maps, otras regiones, reseñas, reservas, notificaciones, calificar.

Estas pantallas existen en el prototipo de Claude Design (carpeta `design/`), pero **no se construyen** en el MVP.

## Decisiones de base

- **Web app/PWA y no app nativa:** el link de TikTok abre directo, sin pasar por tienda de apps.
- **Contenido curado a mano** en tablas de Supabase, editable desde el Table Editor sin tocar código.
- **Planificador con plantillas, sin IA:** cada destino o plan tiene itinerarios prearmados por número de días, con costos por nivel (económico, estándar, cómodo). El motor elige y ajusta según el presupuesto. Es predecible, barato y testeable. IA puede entrar en R2 si las plantillas se quedan cortas.
- **Costos estimados y por persona**, cargados a mano y marcados como referencia.
- **Solo Lima y alrededores**, punto de partida siempre Lima.
- **El prototipo de Claude Design (`design/`) es la referencia visual** (colores, tipografía, tarjetas, espaciados). Las specs mandan sobre qué pantallas y qué comportamiento entran.
