# 06 · "Sí, avísame" (puerta falsa de cuenta)

Cubre H12. Mide si a la gente le importa tener cuenta **sin construir el login**. Es la versión lean de lo que antes era "Login opcional".

## Historia

- **H12.** Como usuario que acaba de guardar una ruta, quiero dejar mi correo para que me avisen cuando pueda tener cuenta y no perder mis rutas.

## Por qué es una puerta falsa

El login real (código por correo, Google, rutas en la nube, migración) cuesta un paso entero del PLAN y es lo más frágil dentro del navegador de TikTok. Antes de construirlo queremos saber si alguien lo quiere. Regla de decisión: si **≥ 20 % de los que guardan deja su correo**, el login entra en R2. Si es < 5 %, se olvida por ahora.

## Criterios de aceptación

**CA-6.1 Cuándo aparece**
- El bottom sheet aparece **solo** justo después de guardar una ruta (CA-5.3).
- Si lo cerré con "Ahora no", no vuelve a aparecer en 7 días. Si ya dejé mi correo, no vuelve a aparecer nunca en este celular.
- En ningún otro lugar de la app se pide correo ni login. No hay botón "Ingresar" en ninguna parte.

**CA-6.2 Contenido del sheet**
- Título: "¿Creamos tu cuenta para no perder tus rutas?"
- Línea de apoyo: "Tus rutas están guardadas en este celular. Si borras el historial o cambias de celular, se van. Estamos preparando las cuentas: déjanos tu correo y te avisamos."
- Opciones: botón principal **"Sí, avísame"** y link **"Ahora no"**.
- No se muestran botones de Google ni de "Con mi correo": no prometas algo que no existe todavía.

**CA-6.3 "Sí, avísame"**
- Al tocarlo, el sheet muestra un campo de correo (teclado de email), una casilla **sin marcar** "Acepto que Rutaz me escriba para avisarme de las cuentas" con link a "Cómo usamos tu correo", y el botón "Enviar".
- "Enviar" está deshabilitado hasta que el correo tenga forma válida y la casilla esté marcada.
- Al enviar se inserta una fila en `account_interest` (`correo`, `anon_id`, `acepta_avisos = true`) y el sheet muestra "Listo ✓ Te escribimos cuando las cuentas estén listas. Tu ruta sigue guardada aquí." y se cierra solo a los 2 s.
- Si el insert falla (sin conexión), se muestra "No pudimos enviarlo. Intenta otra vez" con botón para reintentar. La ruta sigue guardada en cualquier caso.

**CA-6.4 "Ahora no"**
- Cierra el sheet, la ruta sigue guardada y puedo usar todo igual.

**CA-6.5 "Cómo usamos tu correo"**
- Página simple `/privacidad` con: qué guardamos (solo el correo), para qué (avisarte de las cuentas), que no lo compartimos, y cómo pedir que lo borremos (un correo de contacto). Mención a la Ley 29733 de Protección de Datos Personales.

## Diseño

- Componente `AccountOfferSheet` en `src/components/`, abierto por la pantalla de itinerario después de `guardar()`.
- Estado de frecuencia en `localStorage`: `rutaz.oferta_cuenta.v1 = { cerrado_en?: ISO, correo_dejado?: true }`. Lógica en función pura `debeMostrarOferta(estado, ahora)` con tests (nunca visto → sí; cerrado hace 3 días → no; hace 8 días → sí; correo dejado → nunca).
- Insert con el cliente de Supabase del navegador y la clave `anon`, sin pedir la fila de vuelta (`account_interest` no tiene política de lectura). La validación del correo vive también en la base (check).
- Nada de Supabase Auth en el MVP.

## Medición

`account_offer_shown`, `account_offer_dismissed`, `account_interest_submitted`. No mandes el correo en `props`.

## Decisiones tomadas

- Cerrar el sheet con la X, el fondo o Esc cuenta igual que "Ahora no" (7 días sin mostrarse).
- Sin Supabase configurado, en desarrollo el envío se simula; en producción muestra el error y deja reintentar.
- `/privacidad` tiene un correo de contacto de ejemplo (`hola@rutaz.pe`): hay que cambiarlo antes de lanzar.
