-- Rutaz app · datos de ejemplo de octubre 2026.
-- OJO: fechas, horarios, costos, altitudes y "verificado_el" son de referencia para construir y probar.
-- Verificar cada dato antes de publicar.

insert into public.destinations (slug, nombre, zona, imagen_url, que_es, como_llegar, tiempo_desde_lima_min, mejor_epoca, meses_ideales, meses_evitar, altitud_m, dificultad, dias_minimos) values
('san-pedro-de-casta', 'San Pedro de Casta y Marcahuasi', 'Sierra de Lima', '/img/marcahuasi.jpg',
 'Pueblo andino en Huarochirí, puerta de entrada a la meseta de Marcahuasi y sus formaciones de piedra.',
 'Bus a Chosica + colectivo a San Pedro de Casta', 240, 'Mayo a octubre (época seca)', '{5,6,7,8,9,10}', '{1,2,3}', 4000, 'media', 2),
('centro-historico-lima', 'Centro Histórico de Lima', 'Lima', '/img/centro-lima.jpg',
 'Casco histórico de Lima: plazas, iglesias coloniales, balcones y huariques.',
 'Metropolitano o bus hasta el Centro', 45, 'Todo el año; octubre es mes morado', '{1,2,3,4,5,6,7,8,9,10,11,12}', '{}', null, 'baja', 1),
('barranco', 'Barranco', 'Lima', '/img/barranco.jpg',
 'Barrio bohemio de Lima, cuna de peñas criollas, bares y arte.',
 'Metropolitano o bus hasta Barranco', 40, 'Todo el año', '{1,2,3,4,5,6,7,8,9,10,11,12}', '{}', null, 'baja', 1),
('lomas-de-lachay', 'Lomas de Lachay', 'Norte chico', '/img/lachay.jpg',
 'Reserva nacional de lomas costeras que reverdecen con la neblina del invierno.',
 'Bus por la Panamericana Norte hasta el desvío + mototaxi', 150, 'Julio a octubre (lomas verdes)', '{7,8,9,10}', '{1,2,3,4}', null, 'baja', 1);

insert into public.festivities (slug, nombre, destino_slug, fecha_inicio, fecha_fin, fecha_confirmada, fecha_aprox, imagen_url, que_es) values
('senor-de-los-milagros', 'Señor de los Milagros', 'centro-historico-lima', '2026-10-01', '2026-10-31', true, null, '/img/senor-milagros.jpg',
 'La procesión más grande de Lima. Recorridos por el Centro, sahumerios y turrón de Doña Pepa.'),
('fiesta-del-agua', 'Fiesta del Agua', 'san-pedro-de-casta', '2026-10-02', '2026-10-05', false, 'inicios de oct', '/img/fiesta-agua.jpg',
 'Fiesta tradicional de limpieza de canales en San Pedro de Casta, con música, danzas y comida.'),
('dia-cancion-criolla', 'Día de la Canción Criolla', 'barranco', '2026-10-31', '2026-10-31', true, null, '/img/criolla.jpg',
 'Noche de peñas, valses y marineras en Barranco.');

insert into public.themes (slug, nombre, imagen_url, que_es, lugares, destino_slug) values
('lima-criolla-y-procesiones', 'Lima criolla y procesiones', '/img/lima-criolla.jpg',
 'Un día de Centro Histórico morado, turrón y cierre en peña.', '{"Plaza de Armas","Las Nazarenas","Barrio Chino","Barranco"}',
 'centro-historico-lima');

insert into public.holidays (fecha, nombre, es_largo, nota) values
('2026-10-08', 'Combate de Angamos', true, 'Arma una escapada de fin de semana largo'),
('2026-11-01', 'Día de Todos los Santos', false, null);

insert into public.month_picks (mes, tipo, evento_slug, destino_slug, tematica_slug, temporada, por_que_ahora, etiqueta, orden) values
('2026-10-01', 'evento',   'senor-de-los-milagros', null, null, null, 'Procesiones en el Centro y turrón recién hecho.', 'popular', 10),
('2026-10-01', 'evento',   'fiesta-del-agua',       null, null, null, 'Súmala a una subida a Marcahuasi.', null, 20),
('2026-10-01', 'evento',   'dia-cancion-criolla',   null, null, null, 'Cierra octubre con jarana en Barranco.', null, 30),
('2026-10-01', 'destino',  null, 'san-pedro-de-casta', null, 'Época seca', 'Cielos despejados para acampar en la meseta.', 'joya-escondida', 10),
('2026-10-01', 'destino',  null, 'lomas-de-lachay',    null, 'Lomas verdes', 'Últimas semanas de verde: ve a inicios de mes.', 'joya-escondida', 20),
('2026-10-01', 'tematica', null, null, 'lima-criolla-y-procesiones', null, 'El plan más limeño de octubre.', null, 10);

insert into public.alerts (titulo, detalle, desde, hasta, destino_slugs) values
('Hospedajes llenos por la Fiesta del Agua', 'En San Pedro de Casta los hospedajes se llenan: reserva con tiempo o lleva carpa.', '2026-09-25', '2026-10-05', '{"san-pedro-de-casta"}'),
('Centro de Lima con desvíos por procesión', 'Los días de procesión hay cierres de calles en el Centro. Ve en transporte público.', '2026-10-17', '2026-10-28', '{"centro-historico-lima"}');

-- Plantillas -----------------------------------------------------------------

insert into public.itinerary_templates (tipo, destino_slug, dias) values
('destino', 'san-pedro-de-casta', 2),
('destino', 'centro-historico-lima', 1),
('destino', 'barranco', 1),
('destino', 'lomas-de-lachay', 1);
insert into public.itinerary_templates (tipo, tematica_slug, dias) values
('tematica', 'lima-criolla-y-procesiones', 1);

-- San Pedro de Casta, 2 días
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '06:00', 'Bus Lima → Chosica', 'Sale de la Av. Grau', 'transporte', 6, 8, 25, false, '2026-09-28'::date),
  (1, 2, '08:00', 'Colectivo Chosica → San Pedro de Casta', 'Unas 3 horas de subida', 'transporte', 15, 15, 20, false, '2026-09-28'::date),
  (1, 3, '12:00', 'Almuerzo en el pueblo', 'Trucha o caldo de gallina', 'comida', 15, 25, 40, false, null),
  (1, 4, '14:00', 'Registro y entrada a Marcahuasi', 'Pago en la municipalidad', 'actividad', 10, 10, 10, false, null),
  (1, 5, '15:00', 'Subida a la meseta en caballo', 'Opcional: se puede subir a pie', 'actividad', 40, 40, 50, true, null),
  (1, 6, '19:00', 'Noche en hospedaje o camping', 'Camping en la meseta o cuarto en el pueblo', 'hospedaje', 30, 60, 100, false, null),
  (2, 1, '05:30', 'Amanecer en Marcahuasi con guía', 'Opcional: el guía conoce las rutas de piedras', 'actividad', 30, 40, 60, true, null),
  (2, 2, '09:00', 'Desayuno', null, 'comida', 8, 12, 20, false, null),
  (2, 3, '12:00', 'Bajada y almuerzo', null, 'comida', 15, 25, 40, false, null),
  (2, 4, '14:00', 'Regreso San Pedro → Chosica → Lima', null, 'transporte', 21, 23, 45, false, '2026-09-28'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'san-pedro-de-casta' and t.dias = 2;

-- Centro Histórico, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '10:00', 'Metropolitano al Centro', null, 'transporte', 3, 3, 20, false, '2026-09-28'::date),
  (1, 2, '10:30', 'Plaza de Armas y Catedral', null, 'actividad', 0, 10, 10, false, null),
  (1, 3, '12:00', 'Procesión del Señor de los Milagros', 'Revisa el recorrido del día', 'actividad', 0, 0, 0, false, null),
  (1, 4, '13:30', 'Almuerzo en el Barrio Chino', null, 'comida', 20, 35, 60, false, null),
  (1, 5, '16:00', 'Turrón de Doña Pepa', null, 'comida', 8, 12, 20, true, null),
  (1, 6, '18:00', 'Regreso', null, 'transporte', 3, 3, 20, false, '2026-09-28'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'centro-historico-lima' and t.dias = 1;

-- Barranco, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '17:00', 'Bus o Metropolitano a Barranco', null, 'transporte', 3, 3, 20, false, '2026-09-28'::date),
  (1, 2, '17:30', 'Puente de los Suspiros y bajada de baños', null, 'actividad', 0, 0, 0, false, null),
  (1, 3, '19:30', 'Cena criolla', null, 'comida', 25, 45, 80, false, null),
  (1, 4, '21:30', 'Peña criolla', 'Entrada o consumo mínimo', 'actividad', 30, 50, 90, false, null),
  (1, 5, '01:00', 'Regreso en taxi por app', null, 'transporte', 15, 20, 30, false, '2026-09-28'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'barranco' and t.dias = 1;

-- Lomas de Lachay, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '06:30', 'Bus Lima → desvío Lachay', 'Panamericana Norte', 'transporte', 15, 20, 60, false, '2026-09-28'::date),
  (1, 2, '09:00', 'Mototaxi a la entrada', null, 'transporte', 10, 10, 10, false, '2026-09-28'::date),
  (1, 3, '09:30', 'Entrada a la reserva y caminata', 'Circuitos señalizados', 'actividad', 11, 11, 11, false, null),
  (1, 4, '13:00', 'Almuerzo en Huacho o en ruta', null, 'comida', 15, 30, 50, false, null),
  (1, 5, '15:00', 'Regreso a Lima', null, 'transporte', 15, 20, 60, false, '2026-09-28'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'lomas-de-lachay' and t.dias = 1;

-- Ruta temática Lima criolla, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '11:00', 'Centro Histórico: Plaza de Armas', null, 'actividad', 0, 10, 10, false, null),
  (1, 2, '12:00', 'Las Nazarenas', 'Santuario del Señor de los Milagros', 'actividad', 0, 0, 0, false, null),
  (1, 3, '13:30', 'Almuerzo en el Barrio Chino', null, 'comida', 20, 35, 60, false, null),
  (1, 4, '16:00', 'Turrón de Doña Pepa', null, 'comida', 8, 12, 20, true, null),
  (1, 5, '18:00', 'Traslado a Barranco', null, 'transporte', 3, 15, 25, false, '2026-09-28'::date),
  (1, 6, '21:00', 'Peña criolla', null, 'actividad', 30, 50, 90, true, null),
  (1, 7, '00:30', 'Regreso', null, 'transporte', 15, 20, 30, false, '2026-09-28'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.tematica_slug = 'lima-criolla-y-procesiones' and t.dias = 1;
