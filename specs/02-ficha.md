# 02 · Ficha de destino, evento o ruta temática

Cubre H5 y la parte de H4 que se ve en la ficha.

## Historias

- **H5.** Como usuario, quiero ver la ficha de un destino o evento (qué es, cuándo, cómo llegar, mejor época) para saber si me conviene.
- **H4.** Como usuario, quiero ver los avisos que afectan a ese destino para no llevarme sorpresas.

## Criterios de aceptación

**CA-2.1 Abrir la ficha**
- Dado que estoy en "Este mes"
- Cuando toco una tarjeta fuera del botón
- Entonces se abre su ficha en `/destino/[slug]`, `/evento/[slug]` o `/ruta-tematica/[slug]`, y el botón "atrás" del celular me devuelve al mismo mes y a la misma posición.

**CA-2.2 Contenido**
- La ficha muestra: foto grande, nombre, **qué es**, **cuándo ir** (fechas del evento o meses buenos del destino), **cómo llegar desde Lima** (medio y tiempo aproximado, por ejemplo "Bus a Chosica + colectivo · 4 h"), **por qué ahora** (el texto del mes, si viene desde un mes) y **avisos que le afectan**.
- Un evento muestra también el destino donde ocurre, con link a su ficha.
- Una ruta temática muestra la lista de lugares que incluye.

**CA-2.2b Datos de seguridad (destinos)**
- La ficha de un destino muestra tres datos en fila: **altitud** ("3 800 m s. n. m.", se oculta si es null), **dificultad** (Baja, Media o Alta) y **días mínimos** ("Mínimo 2 días").
- Dado que `altitud_m` es mayor a 3 000
- Entonces veo el aviso "Más de 3 000 m s. n. m.: aclimátate, sube despacio y toma mucha agua".
- Un evento muestra estos datos de su destino.

**CA-2.2c Calendario "Cuándo ir"**
- Debajo de "Cuándo ir" veo los 12 meses en una fila (E F M A M J J A S O N D): los de `meses_ideales` resaltados en verde, los de `meses_evitar` en gris con la leyenda "Evitar: lluvias", y el mes actual marcado.
- El texto `mejor_epoca` va como resumen arriba del calendario.

**CA-2.2d Tramos verificados**
- En "Cómo llegar desde Lima" se listan los tramos de transporte de la plantilla más corta del plan, cada uno con "Verificado: {fecha}" ("Verificado: 28 sep").
- Si `verificado_el` tiene más de 60 días, el tramo muestra la etiqueta "Confirmar antes de viajar".

**CA-2.3 Avisos en la ficha**
- Dado que existe un aviso vigente o futuro (dentro de 60 días) ligado a este destino, o al destino del evento
- Entonces lo veo en la ficha con qué pasa, dónde y en qué fechas.

**CA-2.4 Botón fijo**
- El botón **"Armar mi ruta con esto"** está fijo abajo, siempre visible al hacer scroll, y lleva al planificador con este destino (spec 03).

**CA-2.4b Compartir la ficha**
- Arriba a la derecha hay un ícono de compartir (spec 07).

**CA-2.5 Link directo**
- Dado que alguien abre `/evento/fiesta-del-agua` directo desde TikTok
- Entonces la ficha carga completa sin pasar por el inicio, y la barra inferior le permite ir a "Este mes".
- Un slug que no existe muestra una página "No encontramos ese lugar" con botón a "Este mes".

## Diseño

- Server Component por tipo, con un componente compartido `DetailLayout`.
- Si se llega desde un mes, la URL lleva `?mes=2026-10` para mostrar el "por qué ahora" de ese mes. Sin el parámetro, se usa el del mes actual si existe, si no se oculta esa sección.
- `og:title`, `og:description` y `og:image` propios de cada ficha (son los links que se van a poner en la bio o en los comentarios de TikTok).

## Medición

`detail_view` con `{ tipo, slug, origen }` (`origen` = `inicio` o `directo`). `card_cta_click` con `{ tipo, slug, origen: "ficha" }`.

## Decisiones tomadas

- El botón "Volver" usa el historial si se llegó desde la app; si se llegó directo (TikTok), lleva a "Este mes".
- Ruta temática: "Cuándo ir" usa `mejor_epoca` de su destino principal, sin calendario ni datos de altitud (la spec los pide solo para destinos y eventos). Muestra "Cómo llegar" y avisos de su destino principal.
- El "Mínimo" se muestra como "2 días" dentro de la fila de datos.
- Los Tramos se listan de la plantilla con menos días; solo los de transporte con `verificado_el`.
