# 05 · Guardar ruta y Mis rutas

Cubre H10 (guardar en el celular) y H11 (abrir la ruta durante el viaje).

## Historias

- **H10.** Como usuario, quiero guardar una ruta en el celular para retomarla después.
- **H11.** Como viajero, quiero abrir mi ruta guardada desde el celular para seguirla durante el viaje.

## Criterios de aceptación

**CA-5.1 Guardar sin pedir nada**
- Dado que estoy viendo mi itinerario
- Cuando toco "Guardar ruta"
- Entonces la ruta se guarda al instante en el celular, sin pedir datos, y veo la confirmación "Ruta guardada ✓ La encuentras en Mis rutas".
- Lo que se guarda es una **foto fija** del itinerario (paradas, costos, nivel, total, fechas del evento si hay). Si después cambio el contenido en Supabase, la ruta guardada no cambia.

**CA-5.2 Sin duplicados**
- Si guardo dos veces la misma combinación (plan + días + presupuesto + paradas quitadas) en menos de un minuto, se guarda una sola vez y el botón pasa a "Guardada ✓".

**CA-5.3 Ofrecer cuenta (puerta falsa)**
- Justo después de la confirmación aparece el bottom sheet "Sí, avísame" (spec 06), con las reglas de frecuencia de esa spec.

**CA-5.4 Mis rutas**
- Desde la barra inferior, "Mis rutas" (`/mis-rutas`) muestra la lista de rutas guardadas, la más reciente primero, con foto, destino, fechas (si las tiene), días y costo total.
- Sin rutas: estado vacío "Aún no guardas rutas" con botón a "Este mes".
- La lista viene siempre de `localStorage` (no hay cuentas en el MVP).

**CA-5.5 Ver una ruta guardada**
- Al tocar una ruta se abre `/mis-rutas/[id]` con el itinerario completo tal como se guardó, legible en la calle: letra grande, alto contraste, cada día plegable, el día de hoy abierto si la ruta tiene fechas.
- Si se abre sin conexión y la página ya se había visitado, se ve igual (la ruta está en `localStorage`; no se exige offline completo en el MVP).

**CA-5.6 Borrar**
- Desde la ruta guardada puedo borrarla, con confirmación.

**CA-5.7 Compartir desde Mis rutas**
- La ruta guardada tiene el mismo botón "Compartir" del itinerario (spec 07).

## Diseño

- `src/lib/rutas-guardadas.ts` con una interfaz única (`listar`, `obtener`, `guardar`, `borrar`) y una sola implementación: `LocalStore` (`localStorage`, clave `rutaz.rutas.v1`). La interfaz existe para que en R2 se sume `SupabaseStore` sin tocar las pantallas; **no** la implementes ahora.
- Si `localStorage` no está disponible (modo privado, webview raro), guardar muestra "No pudimos guardar en este celular. Compártela para no perderla" con el botón Compartir. Nunca un error en blanco.
- Cada ruta tiene `id` (uuid generado en el cliente), `creada_en`, `plan` (tipo, slug, nombre, imagen), `parametros` (presupuesto, días, paradas quitadas) y `snapshot` (el `Resultado` del motor).
- `localStorage` puede borrarse dentro del navegador de TikTok. El sheet de la spec 06 lo dice en su texto, y así medimos si a la gente le importa.

## Medición

`route_saved` con `{ tipo, slug, dias, presupuesto }`. `saved_route_open` con `{ id_ruta }`. `saved_route_delete`.

## Decisiones tomadas

- Si la ruta ya estaba guardada (duplicado en menos de 1 min), el botón pasa a "Guardada ✓" sin repetir la confirmación ni el sheet.
- En una ruta guardada con fechas, se abre el día de hoy si cae dentro del viaje; si no, el Día 1. Sin fechas, todos los días abiertos.
- El sheet "Sí, avísame" aparece 0.6 s después de guardar, para que se lea la confirmación.
