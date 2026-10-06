# 04 · Itinerario y costo

Cubre H8 (itinerario día a día) y H9 (costo estimado y si me alcanza). Es el corazón del MVP: aquí se mide **Valor**.

## Historias

- **H8.** Como usuario, quiero recibir un itinerario día a día para saber qué hacer en cada momento.
- **H9.** Como usuario, quiero ver el costo estimado de la ruta (transporte, comida, hospedaje) para saber si me alcanza.

## Criterios de aceptación

**CA-4.1 Plan día a día**
- Dado que llego a `/planificar/ruta` con plan, presupuesto y días válidos
- Entonces veo un itinerario agrupado por "Día 1", "Día 2"…, con paradas en orden. Cada parada tiene hora aproximada, actividad, una línea de detalle y su costo por persona.
- Ejemplo: Día 1 · 6:00 Bus Lima → Chosica · S/ 10.

**CA-4.2 Resumen de costo**
- Arriba del itinerario veo el **costo estimado total por persona** y el desglose por categoría: transporte, comida, hospedaje y entradas/actividades.
- Si el total es menor o igual a mi presupuesto: "Te alcanza ✓" y cuánto me sobra.
- Si es mayor: "Te faltan S/ X" y una sugerencia concreta (CA-4.4).
- Debajo: "Costos de referencia por persona. Pueden variar." y una línea aparte: "Suma un margen de imprevistos de 10 % (S/ {10% del total})". Ese margen **no** entra en el total ni en el cálculo de si alcanza.

**CA-4.3 Se ajusta al presupuesto**
- Con el mismo plan y días, un presupuesto mayor nunca da una ruta más barata ni de menor nivel que un presupuesto menor.
- Ver las reglas exactas en "Motor del planificador".

**CA-4.4 Cuando no alcanza**
- Dado que ni el nivel económico entra en mi presupuesto
- Entonces veo hasta dos sugerencias, en este orden y solo si aplican:
  1. "Hazlo en {n-1} días: te sale S/ Y" con un botón que recalcula con un día menos.
  2. "Quita {parada}: ahorras S/ Z" por cada parada marcada como opcional, de la más cara a la más barata, con botón para quitarla.
- Quitar una parada recalcula el total en la misma pantalla.

**CA-4.4b Tramos verificados**
- Cada parada de transporte muestra "Verificado: {fecha}", y "Confirmar antes de viajar" si la fecha tiene más de 60 días (la misma regla de la ficha, en una función pura `estadoVerificacion(fecha, hoy)` con tests).

**CA-4.5 Avisos**
- Si hay un aviso que afecta al destino en las fechas del plan, se ve arriba del itinerario.

**CA-4.6 Guardar**
- El botón principal, fijo abajo, es **"Guardar ruta"** (spec 05). A su lado, un botón secundario **"Compartir"** (spec 07).

**CA-4.7 Parámetros inválidos**
- Si la URL trae un presupuesto o días que no existen, o el plan no existe, se muestra un mensaje amable con botón a "Este mes". Nunca una pantalla en blanco.

## Motor del planificador

Función pura en `src/lib/planner/` con tests unitarios. No llama a la base de datos: recibe las plantillas ya cargadas.

```ts
type Nivel = "economico" | "estandar" | "comodo";

planificar(input: {
  plantillas: Plantilla[];        // las del plan (o de su destino si es un evento sin plantillas propias)
  dias: 1 | 2 | 3;
  presupuesto: 150 | 300 | 500;   // 500 = "500 o más"
  paradasQuitadas?: string[];     // ids de paradas opcionales que el usuario quitó
  // cada parada trae verificado_el; el motor lo copia tal cual al resultado (no afecta costos)
}): Resultado

Resultado = {
  nivel: Nivel;
  dias: DiaItinerario[];          // paradas en orden con costo del nivel elegido
  total: number;                  // por persona, en soles enteros
  desglose: Record<Categoria, number>;
  alcanza: boolean;
  diferencia: number;             // sobra (+) o falta (-)
  sugerencias: Sugerencia[];      // vacío si alcanza
}
```

Reglas:

1. Toma la plantilla con `dias` igual al pedido. Si no existe, error controlado (la UI ya no debería permitirlo).
2. Calcula el total de cada nivel sumando el costo de cada parada en ese nivel, sin contar las paradas quitadas.
3. Si `presupuesto` es 500, usa **cómodo** directamente (se considera que alcanza).
4. Si no, elige el **nivel más alto cuyo total ≤ presupuesto**, probando cómodo → estándar → económico.
5. Si ninguno entra, usa **económico**, marca `alcanza = false` y arma sugerencias:
   - Si existe plantilla de `dias - 1`, calcula su total económico y la sugiere si entra en el presupuesto (o si al menos baja el total).
   - Por cada parada `opcional` aún no quitada, sugiere quitarla con su ahorro en económico, de mayor a menor ahorro. Máximo 3.
6. Redondea montos a soles enteros. Formato en UI con `Intl.NumberFormat("es-PE")`.

Tests mínimos: elige cómodo cuando entra; baja a estándar y a económico; 500+ siempre cómodo; no alcanza con y sin plantilla de un día menos; quitar parada opcional recalcula; nunca sugiere quitar una parada no opcional; monotonía (más presupuesto nunca da peor nivel).

## Diseño

- La página es un Server Component que carga plantillas y llama a `planificar()`. Quitar paradas es estado del cliente que vuelve a llamar a `planificar()` en el navegador (la función es pura y viaja al cliente sin problema).
- El resultado es reproducible desde la URL. No se guarda nada en la base al ver el itinerario.

## Medición

`itinerary_view` con `{ tipo, slug, presupuesto, dias, nivel, total, alcanza }`. `suggestion_click` con `{ tipo: "menos_dias" | "quitar_parada" }`.

## Decisiones tomadas

- Las paradas quitadas viajan en la URL (`&quitar=5,7`) para que el itinerario sea reproducible y compartible; solo se aceptan ids de paradas opcionales de esa plantilla.
- Se puede "Volver a poner" una parada quitada.
- Si el total es exactamente el presupuesto: "Te alcanza ✓ justo".
- Con S/ 500+ no se muestra cuánto sobra (no hay tope).
- Sugerencia "Hazlo en n-1 días" lleva a la URL con un día menos (sin paradas quitadas).
- Avisos (CA-4.5): para eventos, los que cruzan las fechas del evento; para el resto, los vigentes o que empiezan en los próximos 60 días.
