# 01 · Este mes (pantalla de inicio)

Cubre H1 (tres bloques), H2 (feriados largos), H3 (mes siguiente) y la parte de H4 que se ve en el inicio (avisos).

## Historias

- **H1.** Como indeciso, quiero ver al abrir la app qué hay este mes en tres bloques (fiestas, destinos en temporada, rutas temáticas) para decidir a dónde ir.
- **H2.** Como usuario, quiero ver los feriados largos del mes para planear con tiempo mi escapada.
- **H3.** Como usuario, quiero pasar al mes siguiente para planear con anticipación.
- **H4.** Como usuario, quiero ver avisos de temporada (lluvias en la sierra, hospedajes llenos por fiesta) para no llevarme sorpresas.

## Criterios de aceptación

**CA-1.1 Abre en el mes actual**
- Dado que entro a `/` (o desde un link de TikTok con parámetros UTM)
- Cuando carga la página
- Entonces veo el título "¿Qué hay en {mes}?" con el mes actual según la hora de Lima, sin onboarding, sin login y sin pop-ups.

**CA-1.2 Tres bloques en orden fijo**
- Entonces veo, en este orden: "Fiestas y eventos", "Destinos en su mejor momento" y "Rutas temáticas".
- Cada bloque es un carrusel horizontal de tarjetas, ordenadas por el campo `orden` de `month_picks`.
- Un bloque sin tarjetas ese mes no se muestra (no queda un título vacío).

**CA-1.3 Contenido de cada tarjeta**
- Cada tarjeta muestra imagen, nombre, fecha o temporada, una línea de "por qué ir ahora" y el botón **"Armar mi ruta con esto"**.
- En "Fiestas y eventos" la fecha es concreta ("3 – 6 oct"). En destinos es la temporada ("Época seca").
- Si la fiesta tiene `fecha_confirmada = false`, en vez de la fecha se lee "Fecha por confirmar · {fecha_aprox}" (por ejemplo "Fecha por confirmar · inicios de oct").
- Si la tarjeta tiene `etiqueta`, se ve como un chip sobre la foto: "Joya escondida" o "Popular".
- Tocar la tarjeta fuera del botón abre la ficha (spec 02). Tocar el botón va al planificador (spec 03).

**CA-1.4 Eventos pasados**
- Dado que un evento del mes ya terminó (su `fecha_fin` es anterior a hoy en Lima)
- Entonces no aparece en el mes actual. Si está en curso, se ve con la etiqueta "Ahora".

**CA-1.5 Feriados largos destacados**
- Dado que el mes tiene feriados marcados como `es_largo`
- Entonces arriba de los bloques veo una franja destacada por feriado, por ejemplo "Jue 8 de octubre · Combate de Angamos: arma una escapada de fin de semana largo".
- Los feriados ya pasados del mes actual no se muestran.
- Si no hay feriados largos, la franja no aparece.

**CA-1.6 Navegar entre meses**
- Dado que estoy en el mes actual
- Cuando toco la flecha "siguiente"
- Entonces veo el mes siguiente con su propio contenido, en la URL `/mes/AAAA-MM`, y puedo volver con la flecha "anterior".
- No puedo ir a meses anteriores al actual. Puedo avanzar hasta 2 meses.
- Si un mes no tiene contenido cargado, veo un estado vacío amable ("Estamos armando lo de diciembre. Mientras, mira lo de este mes") con botón para volver.

**CA-1.7 Avisos útiles**
- Dado que hay avisos cuyo rango de fechas se cruza con el mes que estoy viendo
- Entonces los veo como banners suaves entre la franja de feriados y el primer bloque, máximo 3, con el más próximo primero.
- Cada aviso dice qué pasa, dónde y en qué fechas.

**CA-1.8 Rendimiento en el navegador de TikTok**
- La página se renderiza en el servidor y muestra texto e imágenes principales en menos de 2.5 s con 4G simulado (LCP).
- Las imágenes usan `next/image` con tamaños para 390px de ancho.

## Diseño

- Rutas: `/` (mes actual) y `/mes/[yyyy-mm]`. Ambas usan el mismo Server Component.
- Datos: `month_picks` del mes (con el destino, evento o ruta temática relacionado), `holidays` del mes con `es_largo = true`, `alerts` que se cruzan con el mes. Ver `docs/modelo-de-datos.md`.
- Revalidación: ISR con `revalidate = 3600`, así los cambios en el Table Editor se ven en máximo una hora.
- Fechas: helper `src/lib/fechas.ts` con `mesActualLima()`, `rangoDelMes(yyyyMm)`, `formatoRango(inicio, fin)` ("3 – 6 oct"). Con tests.
- Componentes: `MonthHeader`, `HolidayStrip`, `AlertBanner`, `CardCarousel`, `PlanCard`, `BottomNav`.
- La barra inferior tiene dos ítems: **Este mes** y **Mis rutas**. (El prototipo de `design/` tiene 4 pestañas; en el MVP son solo estas dos.)
- Metadatos para compartir: título y `og:image` por mes, para que el link se vea bien al pegarlo.

## Casos borde

- Primer día del mes a medianoche en Lima: debe mostrar el mes nuevo aunque el servidor esté en UTC.
- Un evento que cruza dos meses (29 oct – 2 nov) aparece en ambos si está en `month_picks` de ambos.
- Imagen rota: mostrar un fondo de color con el nombre, nunca un ícono roto.

## Medición

`app_open` (al cargar cualquier página por primera vez en la sesión), `month_view` con `{ mes }`, `month_next_click`, `card_open` con `{ tipo, slug, bloque }`, `card_cta_click` con `{ tipo, slug, bloque, origen: "inicio" }`.

## Decisiones tomadas

- Contenido cacheado 1 h (fetch de Supabase con `revalidate: 3600`), pero la página se arma en cada visita para que el "mes actual", los eventos pasados y "Ahora" se calculen con la hora de Lima del momento (caso borde de medianoche del día 1).
- `/mes/AAAA-MM` con el mes actual, uno pasado o más de 2 meses adelante redirige a `/`.
- Avisos del inicio: se muestran todos los que cruzan el mes (generales y de destino), sin los que ya terminaron, ordenados por fecha de inicio, máximo 3.
- Tarjeta de temática: muestra `temporada` si existe; si no, no muestra línea de fecha.
- Mientras no haya Supabase configurado, fuera de producción se usa una copia del seed (`src/lib/contenido/seed-local.ts`). En producción sin Supabase la app falla a propósito.
