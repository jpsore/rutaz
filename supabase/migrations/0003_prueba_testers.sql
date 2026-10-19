-- Rutaz app · vistas para la prueba con testers (link con ?utm_source=prueba).
-- Un tester = un navegador (anon_id) que entró al menos una vez con utm_source = 'prueba'.
-- Si mandas links personales con &utm_content=<nombre>, la vista usa ese nombre; si no, un código corto del anon_id.
-- Se consultan en el SQL Editor de Supabase. La app no las puede leer.

create view public.prueba_eventos with (security_invoker = true) as
with testers as (
  select anon_id,
         (array_agg(utm_content order by creado_en) filter (where utm_content is not null))[1] as nombre
  from public.analytics_events
  where utm_source = 'prueba'
  group by anon_id
)
select
  coalesce(t.nombre, 'T-' || left(e.anon_id, 6))                    as tester,
  (e.creado_en at time zone 'America/Lima')                          as hora_lima,
  e.nombre                                                           as evento,
  e.ruta,
  e.props,
  e.session_id                                                       as sesion,
  e.es_webview,
  e.anon_id
from public.analytics_events e
join testers t using (anon_id)
order by tester, e.creado_en;

-- Una fila por tester con las señales de S1, S2 y S3 (validacion-mision-feedback.md, sección 4).
create view public.prueba_testers with (security_invoker = true) as
select
  tester,
  min(hora_lima)                                                     as primera_visita,
  max(hora_lima)                                                     as ultima_visita,
  count(*)                                                           as eventos,
  count(distinct sesion)                                             as sesiones,
  count(distinct hora_lima::date) filter (where evento = 'app_open') as dias_con_visita,   -- S3: > 1 = volvió
  bool_or(evento = 'card_cta_click')                                 as armo_ruta,         -- S1
  bool_or(evento = 'planner_submit')                                 as envio_planificador,
  bool_or(evento = 'itinerary_view')                                 as vio_itinerario,
  bool_or(evento = 'route_saved')                                    as guardo,            -- S2
  bool_or(evento = 'share_completed')                                as compartio,         -- S2
  bool_or(evento = 'account_interest_submitted')                     as dejo_correo,
  string_agg(distinct props->>'slug', ', ') filter (where evento = 'itinerary_view') as lugares,
  (array_agg(evento order by hora_lima desc))[1]                     as ultimo_evento,     -- dónde se quedó
  bool_or(es_webview)                                                as uso_webview
from public.prueba_eventos
group by tester
order by primera_visita;

revoke all on public.prueba_eventos, public.prueba_testers from anon, authenticated;
