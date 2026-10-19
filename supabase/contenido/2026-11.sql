-- Rutaz · contenido de noviembre 2026 (y feriados de diciembre).
-- BORRADOR: costos, horarios y fechas salen de notas de prensa 2019-2024 y de la web oficial de Caral.
-- Antes de cargar: confirma cada precio y cada tramo de transporte, y pon en verificado_el el día en que lo confirmaste.
-- Cargar en el SQL Editor de Supabase y luego correr: select * from chequeo_contenido;  (debe salir vacío)

begin;

insert into public.destinations (slug, nombre, zona, imagen_url, que_es, como_llegar, tiempo_desde_lima_min, mejor_epoca, meses_ideales, meses_evitar, altitud_m, dificultad, dias_minimos) values
('lunahuana', 'Lunahuaná', 'Sur chico', '/img/lunahuana.jpg',
 'Valle del río Cañete con canotaje, puentes colgantes, bodegas de pisco y camarones.',
 'Bus a Cañete (San Vicente) + colectivo a Lunahuaná', 180, 'Todo el año; de diciembre a abril el río trae más agua para el canotaje',
 '{1,2,3,4,11,12}', '{}', 479, 'baja', 1),
('antioquia', 'Antioquía', 'Valle de Lurín', '/img/antioquia.jpg',
 'Pueblo de Huarochirí con casas e iglesia pintadas de colores, rodeado de chacras de manzana y membrillo.',
 'Colectivo directo desde La Victoria (Mercado de Frutas)', 150, 'Abril a noviembre (sin lluvias en la sierra)',
 '{4,5,6,7,8,9,10,11}', '{1,2,3}', 1550, 'baja', 1),
('caral', 'Caral', 'Norte chico', '/img/caral.jpg',
 'La ciudad más antigua de América (5 000 años), Patrimonio Mundial, en el valle de Supe.',
 'Bus a Supe + colectivo a Caral', 210, 'Abril a diciembre (de enero a marzo el río Supe crece)',
 '{4,5,6,7,8,9,10,11,12}', '{1,2,3}', 350, 'baja', 1),
('huaros', 'Huaros y Cantamarca', 'Sierra de Lima', '/img/huaros.jpg',
 'Pueblo andino de Canta, puerta a la ciudadela preinca de Cantamarca y sus casas de piedra.',
 'Bus o colectivo a Canta + combi a Huaros', 270, 'Mayo a octubre (época seca); en noviembre ya llueve por las tardes',
 '{5,6,7,8,9,10}', '{1,2,3}', 3583, 'media', 2);

insert into public.festivities (slug, nombre, destino_slug, fecha_inicio, fecha_fin, fecha_confirmada, fecha_aprox, imagen_url, que_es) values
('fiesta-del-agua-huaros', 'Fiesta del Agua de Huaros', 'huaros', '2026-11-14', '2026-11-16', false, 'mediados de nov', '/img/fiesta-agua-huaros.jpg',
 'Fiesta ancestral de limpieza de acequias: siete desayunos, bajada de cruces, danzas y procesión a los cerros. Suele ser el tercer domingo de noviembre.');

insert into public.themes (slug, nombre, imagen_url, que_es, lugares, destino_slug) values
('valle-de-lurin', 'Valle de Lurín en un día', '/img/valle-lurin.jpg',
 'Santuario de Pachacámac, almuerzo campestre en Cieneguilla y tarde en el pueblo pintado de Antioquía.',
 '{"Santuario de Pachacámac","Cieneguilla","Antioquía"}', 'antioquia');

insert into public.holidays (fecha, nombre, es_largo, nota) values
('2026-12-08', 'Inmaculada Concepción', true, 'Martes 8 y miércoles 9 son feriados: pide el lunes y arma una escapada de 5 días'),
('2026-12-09', 'Batalla de Ayacucho', false, null),
('2026-12-25', 'Navidad', true, 'Cae viernes: fin de semana largo');

insert into public.month_picks (mes, tipo, evento_slug, destino_slug, tematica_slug, temporada, por_que_ahora, etiqueta, orden) values
('2026-11-01', 'evento',   'fiesta-del-agua-huaros', null, null, null, 'Ritual andino vivo a 4 horas de Lima: llega el sábado.', 'joya-escondida', 10),
('2026-11-01', 'destino',  null, 'lunahuana', null, 'Sol y río', 'Sol seguro mientras Lima sigue gris, y menos gente que en verano.', 'popular', 10),
('2026-11-01', 'destino',  null, 'caral',     null, 'Época seca', 'Último tramo de buen clima antes de que crezca el río Supe.', null, 20),
('2026-11-01', 'destino',  null, 'antioquia', null, 'Antes de lluvias', 'Ve antes de diciembre, cuando empiezan las lluvias en la sierra.', 'joya-escondida', 30),
('2026-11-01', 'tematica', null, null, 'valle-de-lurin', null, 'Un día completo sin dormir fuera, a menos de 2 horas.', null, 10);

insert into public.alerts (titulo, detalle, desde, hasta, destino_slugs) values
('Empiezan las lluvias en la sierra de Lima', 'Desde mediados de noviembre llueve por las tardes en Canta y Huarochirí: sube temprano y lleva casaca impermeable.', '2026-11-15', '2027-03-31', '{"huaros","san-pedro-de-casta"}');

-- Plantillas -----------------------------------------------------------------

insert into public.itinerary_templates (tipo, destino_slug, dias) values
('destino', 'lunahuana', 1),
('destino', 'lunahuana', 2),
('destino', 'antioquia', 1),
('destino', 'caral', 1),
('destino', 'huaros', 2);
insert into public.itinerary_templates (tipo, tematica_slug, dias) values
('tematica', 'valle-de-lurin', 1);

-- Lunahuaná, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '06:00', 'Bus Lima → Cañete (San Vicente)', 'Sale de la Av. México (La Victoria) o de Plaza Norte', 'transporte', 15, 25, 45, false, '2026-10-19'::date),
  (1, 2, '09:00', 'Colectivo San Vicente → Lunahuaná', 'Unos 45 minutos', 'transporte', 7, 7, 30, false, '2026-10-19'::date),
  (1, 3, '10:30', 'Canotaje en el río Cañete', 'Con agencia autorizada, chaleco y casco', 'actividad', 50, 60, 80, false, null),
  (1, 4, '13:00', 'Almuerzo de camarones', 'Chupe o camarones al ajo', 'comida', 25, 40, 60, false, null),
  (1, 5, '15:00', 'Bodega de pisco y cata', 'Varias bodegas cerca de la plaza', 'actividad', 0, 15, 30, true, null),
  (1, 6, '17:00', 'Colectivo Lunahuaná → San Vicente', null, 'transporte', 7, 7, 30, false, '2026-10-19'::date),
  (1, 7, '18:00', 'Bus Cañete → Lima', null, 'transporte', 15, 25, 45, false, '2026-10-19'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'lunahuana' and t.dias = 1;

-- Lunahuaná, 2 días
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '06:30', 'Bus Lima → Cañete (San Vicente)', 'Sale de la Av. México (La Victoria) o de Plaza Norte', 'transporte', 15, 25, 45, false, '2026-10-19'::date),
  (1, 2, '09:30', 'Colectivo San Vicente → Lunahuaná', 'Unos 45 minutos', 'transporte', 7, 7, 30, false, '2026-10-19'::date),
  (1, 3, '11:00', 'Canotaje en el río Cañete', 'Con agencia autorizada, chaleco y casco', 'actividad', 50, 60, 80, false, null),
  (1, 4, '13:30', 'Almuerzo de camarones', 'Chupe o camarones al ajo', 'comida', 25, 40, 60, false, null),
  (1, 5, '15:30', 'Bodega de pisco y cata', 'Varias bodegas cerca de la plaza', 'actividad', 0, 15, 30, true, null),
  (1, 6, '19:00', 'Noche en hospedaje', 'Hostal en el pueblo o casa de campo', 'hospedaje', 40, 80, 150, false, null),
  (1, 7, '20:00', 'Cena', null, 'comida', 15, 25, 45, false, null),
  (2, 1, '08:00', 'Desayuno', null, 'comida', 10, 15, 25, false, null),
  (2, 2, '09:30', 'Puente colgante de Catapalla', 'Gratis, a 10 minutos del pueblo', 'actividad', 0, 0, 0, false, null),
  (2, 3, '10:30', 'Cuatrimoto o canopy', 'Opcional', 'actividad', 40, 50, 70, true, null),
  (2, 4, '13:00', 'Almuerzo', null, 'comida', 20, 35, 55, false, null),
  (2, 5, '15:00', 'Colectivo Lunahuaná → San Vicente', null, 'transporte', 7, 7, 30, false, '2026-10-19'::date),
  (2, 6, '16:00', 'Bus Cañete → Lima', null, 'transporte', 15, 25, 45, false, '2026-10-19'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'lunahuana' and t.dias = 2;

-- Antioquía, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '07:00', 'Colectivo Lima → Antioquía', 'Sale del Mercado de Frutas N.° 2 (La Victoria), unas 3 horas', 'transporte', 15, 20, 60, false, '2026-10-19'::date),
  (1, 2, '10:30', 'Pueblo pintado e iglesia', 'Recorrido a pie por las fachadas de colores', 'actividad', 0, 0, 0, false, null),
  (1, 3, '11:30', 'Caminata por las chacras del valle', 'Con guía local en el nivel cómodo', 'actividad', 0, 0, 20, false, null),
  (1, 4, '13:00', 'Almuerzo con trucha', null, 'comida', 20, 30, 50, false, null),
  (1, 5, '15:00', 'Manzanas y dulce de membrillo', 'Para llevar', 'comida', 5, 10, 20, true, null),
  (1, 6, '16:00', 'Colectivo Antioquía → Lima', 'El último sale temprano: no te quedes', 'transporte', 15, 20, 60, false, '2026-10-19'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'antioquia' and t.dias = 1;

-- Caral, 1 día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '05:30', 'Bus Lima → Supe', 'Bájate en el mercado de Supe (km 184)', 'transporte', 20, 30, 50, false, '2026-10-19'::date),
  (1, 2, '09:00', 'Colectivo Supe → Caral', 'A una cuadra del mercado; luego 20 min a pie por el puente', 'transporte', 7, 7, 40, false, '2026-10-19'::date),
  (1, 3, '10:00', 'Ciudad Sagrada de Caral con guía', 'El ingreso es con guía obligatorio; abre de 9:00 a 17:00', 'actividad', 15, 15, 30, false, null),
  (1, 4, '13:00', 'Almuerzo en Supe o Barranca', null, 'comida', 15, 30, 50, false, null),
  (1, 5, '15:00', 'Colectivo Caral → Supe', 'Los colectivos dejan de pasar a las 16:00', 'transporte', 7, 7, 40, false, '2026-10-19'::date),
  (1, 6, '16:30', 'Bus Supe → Lima', null, 'transporte', 20, 30, 50, false, '2026-10-19'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'caral' and t.dias = 1;

-- Huaros y Cantamarca, 2 días (también la usa la Fiesta del Agua de Huaros)
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '06:00', 'Colectivo Lima → Canta', 'Sale del km 22 de la Av. Túpac Amaru (Carabayllo), unas 2 horas', 'transporte', 15, 20, 40, false, '2026-10-19'::date),
  (1, 2, '09:00', 'Combi Canta → Huaros', 'Sale a las 9:00 y a las 16:00', 'transporte', 7, 7, 40, false, '2026-10-19'::date),
  (1, 3, '12:00', 'Almuerzo en el pueblo', 'Pachamanca o caldo de cabeza', 'comida', 15, 25, 40, false, null),
  (1, 4, '14:00', 'Plaza y fiesta del pueblo', 'En fecha de fiesta: danzas y bajada de cruces', 'actividad', 0, 0, 0, false, null),
  (1, 5, '19:00', 'Noche en casa hospedaje o camping', 'Lleva abrigo: de noche baja de 5 °C', 'hospedaje', 30, 50, 90, false, null),
  (2, 1, '07:00', 'Desayuno', null, 'comida', 8, 12, 20, false, null),
  (2, 2, '08:00', 'Caminata a Cantamarca', 'Unas 2 horas de subida; con guía en el nivel estándar y cómodo', 'actividad', 10, 20, 50, false, null),
  (2, 3, '13:00', 'Almuerzo', null, 'comida', 15, 25, 40, false, null),
  (2, 4, '16:00', 'Combi Huaros → Canta', null, 'transporte', 7, 7, 40, false, '2026-10-19'::date),
  (2, 5, '17:30', 'Colectivo Canta → Lima', null, 'transporte', 15, 20, 40, false, '2026-10-19'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.destino_slug = 'huaros' and t.dias = 2;

-- Valle de Lurín en un día
insert into public.template_stops (template_id, dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
select t.id, s.* from public.itinerary_templates t,
(values
  (1, 1, '08:00', 'Bus a Pachacámac', 'Por la Panamericana Sur', 'transporte', 5, 5, 30, false, '2026-10-19'::date),
  (1, 2, '09:00', 'Santuario de Pachacámac', 'Museo y sitio arqueológico', 'actividad', 15, 15, 15, false, null),
  (1, 3, '12:00', 'Almuerzo campestre en Cieneguilla', null, 'comida', 25, 40, 70, false, null),
  (1, 4, '14:00', 'Colectivo Cieneguilla → Antioquía', null, 'transporte', 8, 8, 40, false, '2026-10-19'::date),
  (1, 5, '15:00', 'Pueblo pintado de Antioquía', null, 'actividad', 0, 0, 0, false, null),
  (1, 6, '16:00', 'Manzanas y dulce de membrillo', null, 'comida', 5, 10, 20, true, null),
  (1, 7, '17:00', 'Colectivo Antioquía → Lima', null, 'transporte', 15, 20, 60, false, '2026-10-19'::date)
) as s(dia, orden, hora, actividad, detalle, categoria, costo_economico, costo_estandar, costo_comodo, opcional, verificado_el)
where t.tematica_slug = 'valle-de-lurin' and t.dias = 1;

commit;
