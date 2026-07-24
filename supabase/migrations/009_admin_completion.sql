-- Complete admin operations and make driver access strictly read-only.
alter table public.drivers
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists deactivated_at timestamptz,
  alter column phone set default '',
  alter column phone drop not null;

create unique index if not exists drivers_document_id_uidx
  on public.drivers(document_id) where document_id is not null;

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_role public.user_role,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and role::text = 'admin')
$$;

create or replace function public.audit_row_change()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  entity jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
begin
  insert into public.audit_log(actor_id, actor_role, action, entity_type, entity_id, old_data, new_data)
  values (
    auth.uid(),
    (select role from public.users where id = auth.uid()),
    lower(tg_op),
    tg_table_name,
    entity ->> 'id',
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

alter table public.tours
  add column if not exists featured boolean not null default false,
  add column if not exists is_test boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.reservation_observations (
  id bigint generated always as identity primary key,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  action text not null check (action in ('open', 'close', 'reopen', 'note')),
  observation text not null check (char_length(trim(observation)) between 2 and 1000),
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists reservation_observations_reservation_idx
  on public.reservation_observations(reservation_id, created_at desc);

alter table public.reservation_observations enable row level security;
alter table public.reservation_observations force row level security;

drop policy if exists "Admins manage reservation observations" on public.reservation_observations;
create policy "Admins manage reservation observations" on public.reservation_observations
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Drivers update assigned reservations" on public.reservations;
drop trigger if exists enforce_driver_reservation_update on public.reservations;
drop function if exists public.enforce_driver_reservation_update();

drop trigger if exists audit_tours on public.tours;
create trigger audit_tours after insert or update or delete on public.tours
for each row execute function public.audit_row_change();

drop trigger if exists audit_reservation_observations on public.reservation_observations;
create trigger audit_reservation_observations after insert or update or delete on public.reservation_observations
for each row execute function public.audit_row_change();

update public.drivers
set full_name = 'Brayan Agudelo', status = 'active', deactivated_at = null, updated_at = now()
where document_id = '1001064909';

insert into public.drivers (full_name, document_id, phone, status, deactivated_at, updated_at)
select 'Brayan Agudelo', '1001064909', '', 'active', null, now()
where not exists (select 1 from public.drivers where document_id = '1001064909');

insert into public.tours (
  id, city_id, name, slug, description, includes, excludes, duration,
  schedules, base_price_cents, gallery, active, featured, is_test, updated_at
)
values (
  'bog-tour-prueba', 'bogota', 'Tour de prueba', 'tour-de-prueba',
  'Tour de prueba para validar el flujo real de reserva y pago.',
  '[]'::jsonb, '[]'::jsonb, '1 hora', '["10:00"]'::jsonb,
  100000, '[]'::jsonb, true, false, true, now()
)
on conflict (id) do update
set city_id = excluded.city_id,
    name = excluded.name,
    slug = excluded.slug,
    base_price_cents = excluded.base_price_cents,
    featured = false,
    is_test = true,
    updated_at = now();
