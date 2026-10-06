-- Rutaz app · medición de los indicadores de éxito.
-- La app inserta eventos; nadie los puede leer desde la app.
-- Los indicadores se consultan en el SQL Editor de Supabase (ver docs/medicion.md).

create table public.analytics_events (
  id            bigint generated always as identity primary key,
  creado_en     timestamptz not null default now(),
  nombre        text not null check (nombre in (
                  'app_open', 'month_view', 'month_next_click', 'card_open', 'card_cta_click',
                  'detail_view', 'planner_view', 'planner_submit', 'itinerary_view', 'suggestion_click',
                  'route_saved', 'saved_route_open', 'saved_route_delete',
                  'share_click', 'share_completed',
                  'account_offer_shown', 'account_offer_dismissed', 'account_interest_submitted'
                )),
  anon_id       text not null check (length(anon_id) between 8 and 64),  -- id del navegador (localStorage)
  session_id    text not null check (length(session_id) between 8 and 64),
  user_id       uuid,                                  -- si hay sesión
  ruta          text,                                  -- path de la página
  props         jsonb not null default '{}' check (pg_column_size(props) < 2048),
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  ttclid        text,                                  -- id de clic de anuncios de TikTok, si viene
  es_webview    boolean not null default false
);
create index analytics_events_nombre_idx on public.analytics_events (nombre, creado_en);
create index analytics_events_anon_idx   on public.analytics_events (anon_id, creado_en);

alter table public.analytics_events enable row level security;

create policy "registrar eventos" on public.analytics_events
  for insert to anon, authenticated
  with check (
    (user_id is null or user_id = auth.uid())
    and creado_en > now() - interval '5 minutes'
    and creado_en < now() + interval '5 minutes'
  );
-- Sin política de select: solo se lee con la service role desde el dashboard.

-- ---------------------------------------------------------------------------
-- Vistas de indicadores (solo para el dashboard; revocadas para la app)
-- ---------------------------------------------------------------------------

-- Una fila por visitante: primera visita y si llegó a cada momento clave.
create view public.kpi_visitantes with (security_invoker = true) as
select
  anon_id,
  min(creado_en)                                                      as primera_visita,
  (array_agg(utm_source order by creado_en) filter (where utm_source is not null))[1] as fuente,
  bool_or(es_webview)                                                 as vino_por_webview,
  bool_or(nombre = 'card_cta_click')                                  as activado,
  bool_or(nombre = 'itinerary_view')                                  as vio_itinerario,
  bool_or(nombre = 'route_saved')                                     as guardo,
  bool_or(nombre = 'share_completed')                                 as compartio,
  bool_or(nombre = 'account_interest_submitted')                      as dejo_correo,
  count(distinct (creado_en at time zone 'America/Lima')::date)
    filter (where nombre = 'app_open')                                as dias_con_visita
from public.analytics_events
group by anon_id;

-- Indicadores por semana de primera visita.
create view public.kpi_semanal with (security_invoker = true) as
select
  date_trunc('week', primera_visita at time zone 'America/Lima')::date as semana,
  count(*)                                                              as visitantes,
  round(100.0 * avg(activado::int), 1)                                  as activacion_pct,      -- meta ≥ 40
  round(100.0 * avg(vio_itinerario::int), 1)                            as valor_pct,           -- meta ≥ 25
  round(100.0 * avg(guardo::int), 1)                                    as guardan_pct,
  round(100.0 * avg(compartio::int), 1)                                 as comparten_pct,
  round(100.0 * avg((guardo or compartio)::int), 1)                     as guardan_o_comparten_pct, -- meta ≥ 15
  round(100.0 * sum((guardo and dejo_correo)::int) / nullif(sum(guardo::int), 0), 1)
                                                                        as correo_de_guardan_pct,   -- meta ≥ 20
  round(100.0 * avg(coalesce(fuente = 'compartido', false)::int), 1)                   as llegan_por_compartido_pct -- meta ≥ 10
from public.kpi_visitantes
group by 1
order by 1 desc;

-- Retorno a 30 días: solo visitantes cuya primera visita fue hace 30 días o más.
-- "Volver" = abrir la app otro día (hora de Lima) dentro de los 30 días siguientes.
create view public.kpi_retorno with (security_invoker = true) as
with primeras as (
  select anon_id, min(creado_en) as primera
  from public.analytics_events
  where nombre = 'app_open'
  group by anon_id
  having min(creado_en) <= now() - interval '30 days'
)
select
  date_trunc('week', p.primera at time zone 'America/Lima')::date as semana,
  count(*)                                                         as visitantes,
  round(100.0 * avg((exists (
    select 1 from public.analytics_events e
    where e.anon_id = p.anon_id
      and e.nombre = 'app_open'
      and (e.creado_en at time zone 'America/Lima')::date > (p.primera at time zone 'America/Lima')::date
      and e.creado_en <= p.primera + interval '30 days'
  ))::int), 1)                                                     as retorno_pct           -- meta ≥ 20
from primeras p
group by 1
order by 1 desc;

revoke all on public.kpi_visitantes, public.kpi_semanal, public.kpi_retorno from anon, authenticated;
