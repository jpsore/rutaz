// Copia en TypeScript de supabase/seed.sql (octubre 2026).
// Solo se usa cuando no hay Supabase configurado (desarrollo y tests), nunca en producción.
// Si cambias supabase/seed.sql, actualiza este archivo.
import type { Contenido, ParadaFila } from "./tipos";

type FilaParada = [
  dia: number, orden: number, hora: string, actividad: string, detalle: string | null,
  categoria: ParadaFila["categoria"], eco: number, est: number, com: number, opcional: boolean, verificado: string | null,
];

let idParada = 0;
function paradas(template_id: number, filas: FilaParada[]): ParadaFila[] {
  return filas.map(([dia, orden, hora, actividad, detalle, categoria, eco, est, com, opcional, verificado]) => ({
    id: ++idParada,
    template_id,
    dia,
    orden,
    hora,
    actividad,
    detalle,
    categoria,
    costo_economico: eco,
    costo_estandar: est,
    costo_comodo: com,
    opcional,
    verificado_el: verificado,
  }));
}

const V = "2026-09-28";

export const contenidoLocal: Contenido = {
  destinos: [
    {
      slug: "san-pedro-de-casta", nombre: "San Pedro de Casta y Marcahuasi", zona: "Sierra de Lima", imagen_url: "/img/marcahuasi.jpg",
      que_es: "Pueblo andino en Huarochirí, puerta de entrada a la meseta de Marcahuasi y sus formaciones de piedra.",
      como_llegar: "Bus a Chosica + colectivo a San Pedro de Casta", tiempo_desde_lima_min: 240, mejor_epoca: "Mayo a octubre (época seca)",
      meses_ideales: [5, 6, 7, 8, 9, 10], meses_evitar: [1, 2, 3], altitud_m: 4000, dificultad: "media", dias_minimos: 2,
    },
    {
      slug: "centro-historico-lima", nombre: "Centro Histórico de Lima", zona: "Lima", imagen_url: "/img/centro-lima.jpg",
      que_es: "Casco histórico de Lima: plazas, iglesias coloniales, balcones y huariques.",
      como_llegar: "Metropolitano o bus hasta el Centro", tiempo_desde_lima_min: 45, mejor_epoca: "Todo el año; octubre es mes morado",
      meses_ideales: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], meses_evitar: [], altitud_m: null, dificultad: "baja", dias_minimos: 1,
    },
    {
      slug: "barranco", nombre: "Barranco", zona: "Lima", imagen_url: "/img/barranco.jpg",
      que_es: "Barrio bohemio de Lima, cuna de peñas criollas, bares y arte.",
      como_llegar: "Metropolitano o bus hasta Barranco", tiempo_desde_lima_min: 40, mejor_epoca: "Todo el año",
      meses_ideales: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], meses_evitar: [], altitud_m: null, dificultad: "baja", dias_minimos: 1,
    },
    {
      slug: "lomas-de-lachay", nombre: "Lomas de Lachay", zona: "Norte chico", imagen_url: "/img/lachay.jpg",
      que_es: "Reserva nacional de lomas costeras que reverdecen con la neblina del invierno.",
      como_llegar: "Bus por la Panamericana Norte hasta el desvío + mototaxi", tiempo_desde_lima_min: 150, mejor_epoca: "Julio a octubre (lomas verdes)",
      meses_ideales: [7, 8, 9, 10], meses_evitar: [1, 2, 3, 4], altitud_m: null, dificultad: "baja", dias_minimos: 1,
    },
  ],
  eventos: [
    {
      slug: "senor-de-los-milagros", nombre: "Señor de los Milagros", destino_slug: "centro-historico-lima",
      fecha_inicio: "2026-10-01", fecha_fin: "2026-10-31", fecha_confirmada: true, fecha_aprox: null, imagen_url: "/img/senor-milagros.jpg",
      que_es: "La procesión más grande de Lima. Recorridos por el Centro, sahumerios y turrón de Doña Pepa.",
    },
    {
      slug: "fiesta-del-agua", nombre: "Fiesta del Agua", destino_slug: "san-pedro-de-casta",
      fecha_inicio: "2026-10-02", fecha_fin: "2026-10-05", fecha_confirmada: false, fecha_aprox: "inicios de oct", imagen_url: "/img/fiesta-agua.jpg",
      que_es: "Fiesta tradicional de limpieza de canales en San Pedro de Casta, con música, danzas y comida.",
    },
    {
      slug: "dia-cancion-criolla", nombre: "Día de la Canción Criolla", destino_slug: "barranco",
      fecha_inicio: "2026-10-31", fecha_fin: "2026-10-31", fecha_confirmada: true, fecha_aprox: null, imagen_url: "/img/criolla.jpg",
      que_es: "Noche de peñas, valses y marineras en Barranco.",
    },
  ],
  tematicas: [
    {
      slug: "lima-criolla-y-procesiones", nombre: "Lima criolla y procesiones", imagen_url: "/img/lima-criolla.jpg",
      que_es: "Un día de Centro Histórico morado, turrón y cierre en peña.",
      lugares: ["Plaza de Armas", "Las Nazarenas", "Barrio Chino", "Barranco"], destino_slug: "centro-historico-lima",
    },
  ],
  feriados: [
    { fecha: "2026-10-08", nombre: "Combate de Angamos", es_largo: true, nota: "Arma una escapada de fin de semana largo" },
    { fecha: "2026-11-01", nombre: "Día de Todos los Santos", es_largo: false, nota: null },
  ],
  picks: [
    { id: 1, mes: "2026-10-01", tipo: "evento", evento_slug: "senor-de-los-milagros", destino_slug: null, tematica_slug: null, temporada: null, por_que_ahora: "Procesiones en el Centro y turrón recién hecho.", etiqueta: "popular", orden: 10 },
    { id: 2, mes: "2026-10-01", tipo: "evento", evento_slug: "fiesta-del-agua", destino_slug: null, tematica_slug: null, temporada: null, por_que_ahora: "Súmala a una subida a Marcahuasi.", etiqueta: null, orden: 20 },
    { id: 3, mes: "2026-10-01", tipo: "evento", evento_slug: "dia-cancion-criolla", destino_slug: null, tematica_slug: null, temporada: null, por_que_ahora: "Cierra octubre con jarana en Barranco.", etiqueta: null, orden: 30 },
    { id: 4, mes: "2026-10-01", tipo: "destino", evento_slug: null, destino_slug: "san-pedro-de-casta", tematica_slug: null, temporada: "Época seca", por_que_ahora: "Cielos despejados para acampar en la meseta.", etiqueta: "joya-escondida", orden: 10 },
    { id: 5, mes: "2026-10-01", tipo: "destino", evento_slug: null, destino_slug: "lomas-de-lachay", tematica_slug: null, temporada: "Lomas verdes", por_que_ahora: "Últimas semanas de verde: ve a inicios de mes.", etiqueta: "joya-escondida", orden: 20 },
    { id: 6, mes: "2026-10-01", tipo: "tematica", evento_slug: null, destino_slug: null, tematica_slug: "lima-criolla-y-procesiones", temporada: null, por_que_ahora: "El plan más limeño de octubre.", etiqueta: null, orden: 10 },
  ],
  avisos: [
    { id: 1, titulo: "Hospedajes llenos por la Fiesta del Agua", detalle: "En San Pedro de Casta los hospedajes se llenan: reserva con tiempo o lleva carpa.", desde: "2026-09-25", hasta: "2026-10-05", destino_slugs: ["san-pedro-de-casta"] },
    { id: 2, titulo: "Centro de Lima con desvíos por procesión", detalle: "Los días de procesión hay cierres de calles en el Centro. Ve en transporte público.", desde: "2026-10-17", hasta: "2026-10-28", destino_slugs: ["centro-historico-lima"] },
  ],
  plantillas: [
    { id: 1, tipo: "destino", evento_slug: null, destino_slug: "san-pedro-de-casta", tematica_slug: null, dias: 2 },
    { id: 2, tipo: "destino", evento_slug: null, destino_slug: "centro-historico-lima", tematica_slug: null, dias: 1 },
    { id: 3, tipo: "destino", evento_slug: null, destino_slug: "barranco", tematica_slug: null, dias: 1 },
    { id: 4, tipo: "destino", evento_slug: null, destino_slug: "lomas-de-lachay", tematica_slug: null, dias: 1 },
    { id: 5, tipo: "tematica", evento_slug: null, destino_slug: null, tematica_slug: "lima-criolla-y-procesiones", dias: 1 },
  ],
  paradas: [
    ...paradas(1, [
      [1, 1, "06:00", "Bus Lima → Chosica", "Sale de la Av. Grau", "transporte", 6, 8, 25, false, V],
      [1, 2, "08:00", "Colectivo Chosica → San Pedro de Casta", "Unas 3 horas de subida", "transporte", 15, 15, 20, false, V],
      [1, 3, "12:00", "Almuerzo en el pueblo", "Trucha o caldo de gallina", "comida", 15, 25, 40, false, null],
      [1, 4, "14:00", "Registro y entrada a Marcahuasi", "Pago en la municipalidad", "actividad", 10, 10, 10, false, null],
      [1, 5, "15:00", "Subida a la meseta en caballo", "Opcional: se puede subir a pie", "actividad", 40, 40, 50, true, null],
      [1, 6, "19:00", "Noche en hospedaje o camping", "Camping en la meseta o cuarto en el pueblo", "hospedaje", 30, 60, 100, false, null],
      [2, 1, "05:30", "Amanecer en Marcahuasi con guía", "Opcional: el guía conoce las rutas de piedras", "actividad", 30, 40, 60, true, null],
      [2, 2, "09:00", "Desayuno", null, "comida", 8, 12, 20, false, null],
      [2, 3, "12:00", "Bajada y almuerzo", null, "comida", 15, 25, 40, false, null],
      [2, 4, "14:00", "Regreso San Pedro → Chosica → Lima", null, "transporte", 21, 23, 45, false, V],
    ]),
    ...paradas(2, [
      [1, 1, "10:00", "Metropolitano al Centro", null, "transporte", 3, 3, 20, false, V],
      [1, 2, "10:30", "Plaza de Armas y Catedral", null, "actividad", 0, 10, 10, false, null],
      [1, 3, "12:00", "Procesión del Señor de los Milagros", "Revisa el recorrido del día", "actividad", 0, 0, 0, false, null],
      [1, 4, "13:30", "Almuerzo en el Barrio Chino", null, "comida", 20, 35, 60, false, null],
      [1, 5, "16:00", "Turrón de Doña Pepa", null, "comida", 8, 12, 20, true, null],
      [1, 6, "18:00", "Regreso", null, "transporte", 3, 3, 20, false, V],
    ]),
    ...paradas(3, [
      [1, 1, "17:00", "Bus o Metropolitano a Barranco", null, "transporte", 3, 3, 20, false, V],
      [1, 2, "17:30", "Puente de los Suspiros y bajada de baños", null, "actividad", 0, 0, 0, false, null],
      [1, 3, "19:30", "Cena criolla", null, "comida", 25, 45, 80, false, null],
      [1, 4, "21:30", "Peña criolla", "Entrada o consumo mínimo", "actividad", 30, 50, 90, false, null],
      [1, 5, "01:00", "Regreso en taxi por app", null, "transporte", 15, 20, 30, false, V],
    ]),
    ...paradas(4, [
      [1, 1, "06:30", "Bus Lima → desvío Lachay", "Panamericana Norte", "transporte", 15, 20, 60, false, V],
      [1, 2, "09:00", "Mototaxi a la entrada", null, "transporte", 10, 10, 10, false, V],
      [1, 3, "09:30", "Entrada a la reserva y caminata", "Circuitos señalizados", "actividad", 11, 11, 11, false, null],
      [1, 4, "13:00", "Almuerzo en Huacho o en ruta", null, "comida", 15, 30, 50, false, null],
      [1, 5, "15:00", "Regreso a Lima", null, "transporte", 15, 20, 60, false, V],
    ]),
    ...paradas(5, [
      [1, 1, "11:00", "Centro Histórico: Plaza de Armas", null, "actividad", 0, 10, 10, false, null],
      [1, 2, "12:00", "Las Nazarenas", "Santuario del Señor de los Milagros", "actividad", 0, 0, 0, false, null],
      [1, 3, "13:30", "Almuerzo en el Barrio Chino", null, "comida", 20, 35, 60, false, null],
      [1, 4, "16:00", "Turrón de Doña Pepa", null, "comida", 8, 12, 20, true, null],
      [1, 5, "18:00", "Traslado a Barranco", null, "transporte", 3, 15, 25, false, V],
      [1, 6, "21:00", "Peña criolla", null, "actividad", 30, 50, 90, true, null],
      [1, 7, "00:30", "Regreso", null, "transporte", 15, 20, 30, false, V],
    ]),
  ],
};
