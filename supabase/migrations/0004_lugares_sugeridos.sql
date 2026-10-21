-- Rutaz app · v2: lugares con nombre y rango de precio en las paradas de comida y hospedaje.
-- Aprendizaje de la prueba del 19-20 oct 2026: 8 de 17 testers no se creían del todo el costo,
-- y 5 pidieron saber dónde comer o dormir con nombre y precio.
-- Una parada (template_stops) puede tener 1 o 2 lugares sugeridos por nivel.

create table public.stop_places (
  id             bigint generated always as identity primary key,
  stop_id        bigint not null references public.template_stops (id) on delete cascade,
  nivel          text check (nivel in ('economico', 'estandar', 'comodo')),  -- null = sirve para todos los niveles
  orden          int not null default 1 check (orden between 1 and 2),
  nombre         text not null check (length(nombre) between 2 and 80),     -- "Restaurante Doña Rosa"
  precio_min     int not null check (precio_min >= 0),                       -- soles por persona
  precio_max     int not null,
  referencia     text check (length(referencia) <= 120),                     -- "Frente a la plaza", "Menú del día"
  maps_url       text check (maps_url ~ '^https://'),
  verificado_el  date not null,                                              -- cuándo confirmaste nombre y precio
  publicado      boolean not null default true,
  check (precio_min <= precio_max),
  unique (stop_id, nivel, orden)
);

create index stop_places_stop on public.stop_places (stop_id);

alter table public.stop_places enable row level security;

create policy "leer lugares" on public.stop_places for select to anon, authenticated
  using (publicado and exists (
    select 1 from public.template_stops s
    join public.itinerary_templates t on t.id = s.template_id
    where s.id = stop_id and t.publicado
  ));

-- Solo comida y hospedaje llevan lugares sugeridos.
create function public.stop_places_solo_comida_hospedaje() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select categoria from public.template_stops where id = new.stop_id) not in ('comida', 'hospedaje') then
    raise exception 'stop_places solo acepta paradas de comida u hospedaje (stop_id %)', new.stop_id;
  end if;
  return new;
end $$;

create trigger stop_places_categoria before insert or update on public.stop_places
  for each row execute function public.stop_places_solo_comida_hospedaje();

-- Para revisar antes de publicar: lugares cuyo rango no cabe en el costo de la parada.
-- Si un lugar es para todos los niveles (nivel null), se compara contra el costo cómodo.
create view public.chequeo_lugares with (security_invoker = true) as
select
  coalesce(t.evento_slug, t.destino_slug, t.tematica_slug) as plan,
  t.dias, s.dia, s.hora, s.actividad, p.nivel, p.nombre, p.precio_min, p.precio_max,
  case coalesce(p.nivel, 'comodo')
    when 'economico' then s.costo_economico
    when 'estandar'  then s.costo_estandar
    else s.costo_comodo
  end as costo_parada,
  p.verificado_el
from public.stop_places p
join public.template_stops s on s.id = p.stop_id
join public.itinerary_templates t on t.id = s.template_id
where p.precio_min > case coalesce(p.nivel, 'comodo')
                       when 'economico' then s.costo_economico
                       when 'estandar'  then s.costo_estandar
                       else s.costo_comodo
                     end;

revoke all on public.chequeo_lugares from anon, authenticated;
