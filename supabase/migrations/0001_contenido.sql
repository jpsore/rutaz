-- Rutaz app · MVP
-- Contenido curado, interés en cuenta (puerta falsa) y reglas de acceso.
-- Las rutas guardadas viven en el celular (localStorage); la tabla saved_routes llega en R2 con el login.
-- Las referencias entre tablas usan slugs legibles para que el contenido
-- se pueda editar a mano en el Table Editor de Supabase.

-- ---------------------------------------------------------------------------
-- Contenido
-- ---------------------------------------------------------------------------

create table public.destinations (
  slug                   text primary key check (slug ~ '^[a-z0-9-]+$'),
  nombre                 text not null,
  zona                   text not null,               -- "Sierra de Lima", "Lima", "Sur chico"
  imagen_url             text not null,
  que_es                 text not null,
  como_llegar            text not null,               -- "Bus a Chosica + colectivo"
  tiempo_desde_lima_min  int  not null check (tiempo_desde_lima_min > 0),
  mejor_epoca            text not null,               -- resumen en texto: "Mayo a octubre (época seca)"
  meses_ideales          int[] not null default '{}', -- calendario "Cuándo ir": {5,6,7,8,9,10}
  meses_evitar           int[] not null default '{}', -- meses de lluvias o cierre: {1,2,3}
  altitud_m              int check (altitud_m between 0 and 6000),  -- null = no aplica (Lima)
  dificultad             text not null default 'baja' check (dificultad in ('baja', 'media', 'alta')),
  dias_minimos           int not null default 1 check (dias_minimos between 1 and 3),
  publicado              boolean not null default true,
  creado_en              timestamptz not null default now(),
  check (meses_ideales <@ array[1,2,3,4,5,6,7,8,9,10,11,12]),
  check (meses_evitar  <@ array[1,2,3,4,5,6,7,8,9,10,11,12]),
  check (not (meses_ideales && meses_evitar))
);

create table public.festivities (
  slug          text primary key check (slug ~ '^[a-z0-9-]+$'),
  nombre        text not null,
  destino_slug  text not null references public.destinations (slug) on update cascade,
  fecha_inicio  date not null,
  fecha_fin     date not null,
  fecha_confirmada boolean not null default true,     -- false = "Fecha por confirmar"
  fecha_aprox   text,                                  -- lo que se muestra si no está confirmada: "inicios de oct"
  imagen_url    text not null,
  que_es        text not null,
  publicado     boolean not null default true,
  creado_en     timestamptz not null default now(),
  check (fecha_fin >= fecha_inicio),
  check (fecha_confirmada or fecha_aprox is not null)
);

create table public.themes (
  slug          text primary key check (slug ~ '^[a-z0-9-]+$'),
  nombre        text not null,
  imagen_url    text not null,
  que_es        text not null,
  lugares       text[] not null default '{}',          -- nombres que se listan en la ficha
  destino_slug  text references public.destinations (slug) on update cascade, -- destino principal (para avisos)
  publicado     boolean not null default true,
  creado_en     timestamptz not null default now()
);

create table public.holidays (
  fecha     date primary key,
  nombre    text not null,
  es_largo  boolean not null default false,            -- se destaca en "Este mes"
  nota      text                                       -- "Arma una escapada de fin de semana largo"
);

-- Qué sale en cada mes y en qué orden. Una fila = una tarjeta.
create table public.month_picks (
  id             bigint generated always as identity primary key,
  mes            date not null check (extract(day from mes) = 1),  -- siempre el día 1: 2026-10-01
  tipo           text not null check (tipo in ('evento', 'destino', 'tematica')),
  evento_slug    text references public.festivities (slug) on update cascade,
  destino_slug   text references public.destinations (slug) on update cascade,
  tematica_slug  text references public.themes (slug) on update cascade,
  temporada      text,                                 -- "Época seca", para destinos
  por_que_ahora  text not null,                        -- la línea de la tarjeta
  etiqueta       text check (etiqueta in ('joya-escondida', 'popular')),  -- opcional, se ve en la tarjeta
  orden          int not null default 100,
  check (
    (tipo = 'evento'   and evento_slug   is not null and destino_slug is null and tematica_slug is null) or
    (tipo = 'destino'  and destino_slug  is not null and evento_slug  is null and tematica_slug is null) or
    (tipo = 'tematica' and tematica_slug is not null and evento_slug  is null and destino_slug  is null)
  )
);
create index month_picks_mes_idx on public.month_picks (mes, tipo, orden);

create table public.alerts (
  id             bigint generated always as identity primary key,
  titulo         text not null,                        -- "Hospedajes llenos por la Fiesta del Agua"
  detalle        text not null,
  desde          date not null,
  hasta          date not null,
  destino_slugs  text[] not null default '{}',         -- vacío = aviso general (solo en el inicio)
  publicado      boolean not null default true,
  check (hasta >= desde)
);

-- ---------------------------------------------------------------------------
-- Plantillas del planificador
-- ---------------------------------------------------------------------------

create table public.itinerary_templates (
  id             bigint generated always as identity primary key,
  tipo           text not null check (tipo in ('evento', 'destino', 'tematica')),
  evento_slug    text references public.festivities (slug) on update cascade,
  destino_slug   text references public.destinations (slug) on update cascade,
  tematica_slug  text references public.themes (slug) on update cascade,
  dias           int not null check (dias between 1 and 3),
  publicado      boolean not null default true,
  check (
    (tipo = 'evento'   and evento_slug   is not null and destino_slug is null and tematica_slug is null) or
    (tipo = 'destino'  and destino_slug  is not null and evento_slug  is null and tematica_slug is null) or
    (tipo = 'tematica' and tematica_slug is not null and evento_slug  is null and destino_slug  is null)
  )
);
create unique index itinerary_templates_unico
  on public.itinerary_templates (tipo, coalesce(evento_slug, destino_slug, tematica_slug), dias);

create table public.template_stops (
  id               bigint generated always as identity primary key,
  template_id      bigint not null references public.itinerary_templates (id) on delete cascade,
  dia              int not null check (dia between 1 and 3),
  orden            int not null,
  hora             text not null check (hora ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  actividad        text not null,                      -- "Bus Lima → Chosica"
  detalle          text,
  categoria        text not null check (categoria in ('transporte', 'comida', 'hospedaje', 'actividad')),
  costo_economico  int not null check (costo_economico >= 0),
  costo_estandar   int not null,
  costo_comodo     int not null,
  opcional         boolean not null default false,     -- el motor puede sugerir quitarla
  verificado_el    date,                               -- cuándo se confirmó precio/horario; obligatorio en transporte
  check (costo_economico <= costo_estandar and costo_estandar <= costo_comodo),
  unique (template_id, dia, orden),
  check (categoria <> 'transporte' or verificado_el is not null)
);

-- ---------------------------------------------------------------------------
-- Interés en cuenta (puerta falsa). No hay login en el MVP: al guardar una ruta
-- se ofrece "Sí, avísame" y aquí queda el correo. Si ≥ 20 % de los que guardan
-- lo dejan, el login entra en R2 (con la tabla saved_routes).
-- ---------------------------------------------------------------------------

create table public.account_interest (
  id         bigint generated always as identity primary key,
  correo     text not null check (correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(correo) <= 254),
  anon_id    text not null check (length(anon_id) between 8 and 64),  -- para cruzar con analytics_events
  acepta_avisos boolean not null check (acepta_avisos),              -- consentimiento explícito (Ley 29733)
  creado_en  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reglas de acceso (RLS)
-- ---------------------------------------------------------------------------

alter table public.destinations        enable row level security;
alter table public.festivities         enable row level security;
alter table public.themes              enable row level security;
alter table public.holidays            enable row level security;
alter table public.month_picks         enable row level security;
alter table public.alerts              enable row level security;
alter table public.itinerary_templates enable row level security;
alter table public.template_stops      enable row level security;
alter table public.account_interest    enable row level security;

-- Contenido: lectura pública de lo publicado. Nadie escribe desde la app;
-- el contenido se edita en el dashboard de Supabase.
create policy "leer destinos"     on public.destinations        for select to anon, authenticated using (publicado);
create policy "leer eventos"      on public.festivities         for select to anon, authenticated using (publicado);
create policy "leer tematicas"    on public.themes              for select to anon, authenticated using (publicado);
create policy "leer feriados"     on public.holidays            for select to anon, authenticated using (true);
create policy "leer meses"        on public.month_picks         for select to anon, authenticated using (true);
create policy "leer avisos"       on public.alerts              for select to anon, authenticated using (publicado);
create policy "leer plantillas"   on public.itinerary_templates for select to anon, authenticated using (publicado);
create policy "leer paradas"      on public.template_stops      for select to anon, authenticated
  using (exists (select 1 from public.itinerary_templates t where t.id = template_id and t.publicado));

-- Interés en cuenta: la app solo inserta. Nadie lee correos desde la app;
-- se ven en el dashboard. Sin índice único a propósito: así la app no revela si un correo ya
-- estaba registrado. Los repetidos se cuentan una vez (count(distinct lower(correo))).
create policy "dejar correo" on public.account_interest for insert to anon, authenticated
  with check (creado_en > now() - interval '5 minutes' and creado_en < now() + interval '5 minutes');

-- ---------------------------------------------------------------------------
-- Chequeo de contenido: correr en el SQL Editor antes de publicar un mes.
-- Lista problemas que la base no puede impedir sola.
-- ---------------------------------------------------------------------------

create view public.chequeo_contenido with (security_invoker = true) as
  -- avisos que apuntan a un destino que no existe
  select 'aviso con destino inexistente' as problema, a.titulo as detalle
  from public.alerts a, unnest(a.destino_slugs) s
  where not exists (select 1 from public.destinations d where d.slug = s)
  union all
  -- tarjetas del mes sin ninguna plantilla (no se podría armar la ruta)
  select 'tarjeta sin plantillas', mp.mes::text || ' · ' || coalesce(mp.evento_slug, mp.destino_slug, mp.tematica_slug)
  from public.month_picks mp
  where not exists (
    select 1 from public.itinerary_templates t
    where t.publicado and t.tipo = mp.tipo
      and coalesce(t.evento_slug, t.destino_slug, t.tematica_slug) = coalesce(mp.evento_slug, mp.destino_slug, mp.tematica_slug)
  )
  and not (
    -- un evento sin plantillas propias usa las de su destino
    mp.tipo = 'evento' and exists (
      select 1 from public.festivities f
      join public.itinerary_templates t on t.tipo = 'destino' and t.destino_slug = f.destino_slug and t.publicado
      where f.slug = mp.evento_slug
    )
  )
  union all
  -- plantillas con días sin paradas
  select 'plantilla con un día vacío', t.id::text || ' · día ' || d.dia
  from public.itinerary_templates t
  cross join lateral generate_series(1, t.dias) as d(dia)
  where not exists (select 1 from public.template_stops s where s.template_id = t.id and s.dia = d.dia)
  union all
  -- tramos de transporte verificados hace más de 60 días (la app muestra "Confirmar antes de viajar")
  select 'transporte por re-verificar', t.id::text || ' · ' || s.actividad || ' · ' || s.verificado_el::text
  from public.template_stops s join public.itinerary_templates t on t.id = s.template_id
  where t.publicado and s.categoria = 'transporte' and s.verificado_el < current_date - 60
  union all
  -- fiestas del mes con fecha por confirmar (recordatorio para confirmarla)
  select 'fiesta con fecha por confirmar', f.slug || ' · ' || f.fecha_aprox
  from public.festivities f
  where f.publicado and not f.fecha_confirmada and f.fecha_inicio >= current_date
  union all
  -- destinos de altura sin dificultad media/alta (revisar que el aviso de aclimatación tenga sentido)
  select 'destino sobre 3000 m con dificultad baja', d.slug
  from public.destinations d
  where d.publicado and d.altitud_m > 3000 and d.dificultad = 'baja';

revoke all on public.chequeo_contenido from anon, authenticated;
