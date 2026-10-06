# 07 · Compartir ruta o ficha

Cubre H13. Es el loop de crecimiento natural: la gente llega de TikTok y manda el plan al grupo de WhatsApp. Cuesta poco y mide la difusión.

## Historia

- **H13.** Como usuario, quiero compartir mi ruta o la ficha de un lugar por WhatsApp (o lo que use) para convencer a mis amigos.

## Criterios de aceptación

**CA-7.1 Dónde está**
- En el itinerario, botón secundario "Compartir" junto a "Guardar ruta" (CA-4.6).
- En una ruta guardada (CA-5.7).
- En la ficha, ícono de compartir arriba a la derecha (CA-2.4b).

**CA-7.2 Menú nativo**
- Dado que el navegador soporta `navigator.share`
- Cuando toco "Compartir"
- Entonces se abre el menú nativo del celular con:
  - Título: el nombre del plan.
  - Texto: en el itinerario, "Mira esta escapada: {plan}, {n} días, S/ {total} por persona"; en la ficha, "Mira esto para este mes: {nombre}".
  - URL: la del itinerario (`/planificar/ruta?…`) o la de la ficha, con `utm_source=compartido&utm_medium=share` y `utm_content={tipo}-{slug}`.

**CA-7.3 Sin menú nativo**
- Si `navigator.share` no existe (algunos webviews y computadoras), copia el link al portapapeles y muestra "Link copiado ✓". Si tampoco se puede copiar, muestra el link en un campo seleccionable.
- Cancelar el menú nativo no muestra ningún error.

**CA-7.4 El link se ve bien**
- El link compartido abre directo (sin pasar por el inicio) y tiene `og:title`, `og:description` y `og:image` propios. Para el itinerario: "{plan} · {n} días desde S/ {total}" y la foto del plan.
- Una ruta guardada se comparte con el link del itinerario equivalente (mismos parámetros); quien lo abre ve el itinerario recalculado, no la foto fija.

## Diseño

- Helper puro `src/lib/compartir.ts`: `armarLinkCompartido(path, { tipo, slug })` (agrega los UTM sin duplicar los que ya tenga) y `textoCompartir(...)`, con tests.
- Componente `ShareButton` que usa Web Share API y cae al portapapeles.

## Medición

`share_click` con `{ origen: "itinerario" | "ficha" | "mis-rutas", tipo, slug }` al tocar. `share_completed` con `{ metodo: "nativo" | "copiar" }` cuando el menú nativo se resuelve sin cancelar o el link se copia. Las visitas que llegan por el link se cuentan con `utm_source = compartido`.

## Decisiones tomadas

- `armarLinkCompartido` también quita `utm_campaign`, `utm_term` y `ttclid` previos, para que un link re-compartido no se atribuya a TikTok.
- Si el menú nativo falla por algo distinto a cancelar, cae a copiar el link.
- Si no se puede copiar, se abre un sheet con el link en un campo seleccionable.
