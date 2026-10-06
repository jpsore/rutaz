# Rutaz · MVP con Lean Startup

Basado en el prototipo de Claude Design ("Rutas Lima", 11 pantallas + 3 de acceso), la revisión `revision-prototipo-mvp.md` y las specs en `mvp-specs/`. Fecha: 6 oct 2026.

## La idea en una línea

El MVP no es "la app de rutas". Es el experimento más chico que responde: **¿la gente que llega desde TikTok usa "qué hay este mes" para armar una salida, y vuelve el mes siguiente?**

## 1. Supuestos de fe, ordenados por riesgo

| # | Supuesto | Tipo | Si es falso… | Riesgo |
|---|---|---|---|---|
| S1 | Quien ve un video de "qué hay este mes" toca el link y toca **"Armar mi ruta con esto"** | Valor + crecimiento | No hay producto: el contenido no engancha | **Alto** |
| S2 | Un itinerario con costo estimado le sirve lo suficiente para **guardarlo** (o compartirlo) | Valor | El planificador sobra; la app es solo un blog del mes | **Alto** |
| S3 | **Vuelve** el mes siguiente sin que lo persigas | Retención | Es contenido de un solo uso; no hay app, hay cuenta de TikTok | **Alto** (y es el más lento de medir) |
| S4 | Tú puedes **curar un mes completo** (fechas, costos, buses) a tiempo, cada mes | Operación | El producto se queda viejo y pierde confianza | Medio |
| S5 | Alguien comparte la ruta por WhatsApp y trae a otro | Crecimiento viral | Dependes 100% de TikTok | Medio |
| S6 | La gente crea cuenta | Retención | Poco importa en esta etapa | Bajo |
| S7 | Alguien pagará (comisión, guías, hospedaje) | Monetización | Se resuelve después del PMF | Bajo por ahora |

Conclusión: S1, S2 y S3 deciden si sigues. **El login (S6) no está entre los riesgos que matan el proyecto**, así que no merece una semana de construcción todavía.

## 2. El MVP: qué pantallas del diseño entran

**Tipo de MVP:** *single feature* + *Wizard of Oz*. Una sola puerta (Este mes), contenido curado a mano y un "planificador" que en realidad elige una plantilla prearmada.

| Entra | Pantalla del diseño | Por qué |
|---|---|---|
| ✅ | P4 · ¿Qué hay este mes? (como inicio, `/`) | Prueba S1. Es el corazón |
| ✅ | P7 · Ficha (con altitud, "cuándo ir" y "Verificado: fecha") | Prueba S1 y protege la confianza (S4) |
| ✅ | P2 · Planificador **solo con destino puesto**, chips S/ 150·300·500+ y 1·2·3 días | Prueba S2 sin motor complejo |
| ✅ | P3 · Itinerario con costo total y "Te alcanza ✓ / sugerencia" | Prueba S2 |
| ✅ | **Compartir** (menú nativo del celular) en el itinerario | Prueba S5 casi gratis |
| ✅ | P8 · Guardados, **solo en el celular** (sin cuenta) | Prueba S2 (guardar = intención) y sirve de razón para volver |
| ✅ | Mes siguiente (noviembre) cargado | Sin esto S3 no se puede medir |
| ✅ | Medición (`analytics_events` + vistas) | Sin datos no hay aprendizaje |

| Sale (R2/R3) | Por qué sale |
|---|---|
| P1 Inicio con 4 puertas, "Descubre tu ciudad" | Diluye la hipótesis: si funciona, no sabrás qué funcionó |
| L1–L3 login/registro con contraseña | S6 es de riesgo bajo |
| **Login opcional (bottom sheet, OTP, Google, migración)** | Ver "puerta falsa" abajo. Es el Paso 9 del PLAN, el más caro y frágil en el webview de TikTok |
| Planificador libre, multi-destino, regenerar | Necesita motor o IA; no prueba nada nuevo |
| P5/P6 rutas temáticas con mapa, guías con WhatsApp, offline, galería, botones Apple | Pulen, no validan |

### La "puerta falsa" para la cuenta

En vez de construir login, al guardar aparece el mismo sheet "¿Creamos tu cuenta para no perder tus rutas?" con un solo botón **"Sí, avísame"** que pide el correo (un insert en una tabla) y "Ahora no". Mide el interés real (S6) con 1 hora de trabajo en vez de un paso entero. Si más del 20 % de los que guardan dejan su correo, el login entra en la siguiente versión.

## 3. Antes de escribir código: el smoke test (esta semana)

Octubre ya va por el día 6 y el MVP de código no estará listo para aprovecharlo. Usa octubre para validar S1 sin construir la app:

1. Publica 3 a 5 TikToks de "qué hay en octubre cerca de Lima" (Fiesta del Agua, Huancaya, lomas, feriado del 8, Canción Criolla).
2. El link de la bio va a una sola página estática "¿Qué hay en octubre?" (puede ser el HTML exportado de Claude Design o un Carrd/Notion), con las tarjetas y el botón "Armar mi ruta con esto".
3. Ese botón abre un itinerario prearmado (una página por plan, versión S/ 300 · 2 días) o un formulario "Te lo mando por WhatsApp" que respondes tú a mano (concierge).
4. Mide clics con UTM y un contador simple.

**Qué aprendes:** si la gente toca el botón (S1) y qué planes jalan más. Eso define qué cargas en noviembre y qué videos repites. Si nadie toca, ahorraste el desarrollo.

## 4. Métricas que deciden (no vanidosas)

No mires seguidores, vistas ni visitantes totales. Mira estas tasas por cohorte semanal (ya están en `kpi_semanal` y `kpi_retorno`):

| Supuesto | Métrica | Meta | Umbral de alarma |
|---|---|---|---|
| S1 | % visitantes que tocan "Armar mi ruta" | ≥ 40 % | < 20 % |
| S2 | % visitantes que ven itinerario | ≥ 25 % | < 10 % |
| S2 | % visitantes que guardan **o comparten** | ≥ 15 % | < 5 % |
| S3 | % que vuelve otro día en 30 días | ≥ 20 % | < 8 % |
| S6 | % de los que guardan que dejan correo | ≥ 20 % | < 5 % |
| S5 | visitas que llegan por un link compartido / total | ≥ 10 % | — |

Mínimo para sacar conclusiones: unos 200 visitantes por semana, mirando al menos 3 semanas.

## 5. Criterios de pivot (decididos ahora, no después)

Revisión a las 8 semanas del lanzamiento (con noviembre y diciembre medidos):

- **S1 bajo** (activación < 20 %) → no es la app, es el contenido o el gancho. Prueba otros formatos de tarjeta y videos. Si sigue bajo tras 2 iteraciones: **pivot de canal o de cliente** (ej. grupos de amigos/empresas que organizan salidas).
- **S1 ok, S2 bajo** (miran pero no arman ni guardan) → **zoom-in**: el valor es la agenda del mes, no el planificador. Quita el planificador y vuelve Rutaz un "calendario de escapadas" con avisos (newsletter/WhatsApp mensual).
- **S1 y S2 ok, S3 bajo** (arman pero no vuelven) → la razón de volver no es la app. Prueba recordatorios ("avísame cuando se acerque la Vendimia") antes de pivotar el **motor de crecimiento**.
- **Todo ok** → persevera: entra login, más destinos y monetización (guías, hospedajes).

## 6. Cómo cambia el PLAN de 10 pasos

| Paso | Cambio |
|---|---|
| 1 Esqueleto | Igual. Elige ya el nombre (Rutaz o Rutas Lima) |
| 2 Base de datos | Suma los campos baratos del diseño: `fecha_confirmada`, `altitud_m`, `dificultad`, `dias_minimos`, `meses_ideales`, `meses_evitar`, `verificado_el`, `etiqueta` |
| 3 Este mes · 4 Ficha · 5 Motor · 6 Planificador e itinerario | Igual |
| 7 Guardar | Igual (solo localStorage) + botón **Compartir** |
| 8 Medición | Igual + evento `share_click` y `account_interest` (correo) |
| 9 Login | **Se reemplaza por la puerta falsa** (1 hora). OTP, Google y migración van a R2 |
| 10 Deploy | Igual |

Resultado: de 10 pasos pasas a 9 más cortos, y el que se va es el más riesgoso dentro de TikTok.

## 7. Puntaje Lean del plan

- **Plan actual (specs + PLAN): 4/10.** Hipótesis y métricas bien definidas, pero sin supuestos ordenados por riesgo, construye login antes de saber si importa y no tiene criterios de pivot.
- **Con este MVP: 7/10** antes de lanzar. Llega a 9-10 cuando el smoke test de octubre y la primera cohorte den evidencia de nivel 3+ (gente actuando, no opinando).
- **Lo siguiente que conviene arreglar:** correr el smoke test de octubre esta semana. Es la forma más barata de probar S1.

## 8. Versión para 5 usuarios (decisión de Jean Pierre, 6 oct 2026)

Con 5 personas los porcentajes de la sección 4 no sirven (1 persona = 20 %) y el retorno de 30 días no se puede leer como tasa. Con 5 usuarios el test es **cualitativo**: observar comportamiento real, no medir embudos.

**MVP:** cero código. El prototipo de Claude Design (o la página estática del smoke test) + **concierge**: tú armas el itinerario a mano y se los mandas por WhatsApp.

**Reclutamiento:** gente que planea salir de Lima pronto y que **no** sean amigos ni familia (mienten por cariño). Ideal: gente que llegó por un TikTok.

**La tarea:** "Arma tu próxima salida real con esto". Mira en silencio cómo usan Este mes → Ficha → Planificador → Itinerario. No expliques nada.

**Señales que cuentan (comportamiento, no opinión):**

| Supuesto | Señal | Éxito | Pivot |
|---|---|---|---|
| S1 | Toca "Armar mi ruta" sin ayuda | 4 de 5 | ≤ 2 de 5 |
| S2 | Guarda o comparte el itinerario | 3 de 5 | ≤ 1 de 5 |
| S2 fuerte | **Hace la salida** usando el itinerario | 2 de 5 | 0 de 5 |
| S3 | En noviembre te pide "¿qué hay este mes?" sin que lo busques | 2 de 5 | 0 de 5 |

**Después:** si pasa, programa el MVP de la sección 2 y ahí sí mide con los % de la sección 4 (con cientos de visitantes, no 5).
