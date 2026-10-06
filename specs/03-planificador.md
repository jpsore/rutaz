# 03 · "Armar mi ruta con esto" y planificador

Cubre H6 (botón con destino prellenado) y H7 (presupuesto y días).

## Historias

- **H6.** Como usuario, quiero tocar "Armar mi ruta con esto" en una tarjeta para ir al planificador con el destino ya elegido.
- **H7.** Como usuario, quiero ingresar mi presupuesto y mis días para que la ruta se ajuste a lo que tengo.

## Criterios de aceptación

**CA-3.1 Llega con el destino puesto**
- Dado que toco "Armar mi ruta con esto" en una tarjeta o ficha
- Entonces se abre `/planificar?tipo={tipo}&slug={slug}` mostrando arriba el destino elegido con su foto, por ejemplo "Fiesta del Agua · San Pedro de Casta".
- El destino no se puede borrar ni perder: si recargo la página o la abro desde otro link, sigue ahí porque está en la URL.
- Un link "Cambiar" me devuelve a "Este mes".

**CA-3.2 Fechas del evento**
- Dado que el plan es un evento
- Entonces debajo del destino veo "Fechas: 3 – 6 oct" tomadas del evento, sin que yo haga nada. Si la fiesta tiene `fecha_confirmada = false`, dice "Fecha por confirmar · {fecha_aprox}" (igual que en la tarjeta, spec 01).

**CA-3.3 Solo dos preguntas**
- Veo solo dos campos:
  - **Presupuesto por persona**, con chips: S/ 150, S/ 300 y S/ 500+.
  - **Días**, con chips: 1, 2 y 3.
- Los chips de días que no tienen itinerario cargado para ese plan se ven deshabilitados con la nota "Aún no tenemos ruta de {n} días para este lugar".
- Valores por defecto: ninguno seleccionado en presupuesto; en días, el menor disponible.

**CA-3.4 Un solo botón**
- El botón **"Ver mi ruta"** está deshabilitado hasta que elijo presupuesto y días.
- Al tocarlo voy a `/planificar/ruta?tipo=…&slug=…&presupuesto=300&dias=2` (spec 04).

**CA-3.5 Plan sin itinerarios**
- Dado que el plan no tiene ninguna plantilla cargada
- Entonces el botón "Armar mi ruta con esto" no aparece en su tarjeta ni en su ficha. (Regla de contenido: no publicar en `month_picks` algo que no se puede planificar.)

## Diseño

- Página cliente ligera (`"use client"` solo en el formulario de chips). Los datos del plan y los días disponibles vienen del servidor.
- `presupuesto` en la URL es el número de la opción: `150`, `300` o `500` (500 significa "500 o más").
- Chips de 48px de alto mínimo, seleccionables con un toque, con estado seleccionado claro.

## Medición

`planner_view` con `{ tipo, slug }`. `planner_submit` con `{ tipo, slug, presupuesto, dias }`.

## Decisiones tomadas

- Si el plan no existe o no tiene plantillas, `/planificar` muestra un mensaje amable con botón a "Este mes".
- Debajo del botón deshabilitado se ve "Elige tu presupuesto para ver la ruta".
