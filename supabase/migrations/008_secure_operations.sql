-- Secure operations: driver identity, trip workflow and immutable audit trail.
alter table public.drivers
  add column if not exists user_id uuid unique references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists deactivated_at timestamptz;

create unique index if not exists drivers_document_id_uidx
  on public.drivers(document_id) where document_id is not null;

alter table public.reservations
  alter column status set default 'pending';

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

create index if not exists audit_log_entity_idx
  on public.audit_log(entity_type, entity_id, created_at desc);

create table if not exists public.driver_login_attempts (
  key_hash text primary key check (length(key_hash) = 64),
  failed_attempts integer not null default 0 check (failed_attempts between 0 and 5),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.driver_login_attempts enable row level security;
alter table public.driver_login_attempts force row level security;
revoke all on public.driver_login_attempts from anon, authenticated;

alter table public.audit_log enable row level security;
alter table public.audit_log force row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.is_driver()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'driver', false)
$$;

create or replace function public.current_driver_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select id from public.drivers
  where user_id = auth.uid() and status = 'active' and deactivated_at is null
$$;

drop policy if exists "Staff can manage drivers" on public.drivers;
drop policy if exists "Staff can manage reservations" on public.reservations;
drop policy if exists "Staff can manage reservation items" on public.reservation_items;
drop policy if exists "Staff can manage payments" on public.payments;

create policy "Admins manage drivers" on public.drivers
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Drivers read own profile" on public.drivers
  for select using (user_id = auth.uid() and status = 'active' and deactivated_at is null);

create policy "Admins manage reservations" on public.reservations
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Drivers read assigned reservations" on public.reservations
  for select using (driver_id = public.current_driver_id());
create policy "Drivers update assigned reservations" on public.reservations
  for update using (driver_id = public.current_driver_id())
  with check (driver_id = public.current_driver_id());

create policy "Admins manage reservation items" on public.reservation_items
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Drivers read assigned reservation items" on public.reservation_items
  for select using (
    exists (
      select 1 from public.reservations r
      where r.id = reservation_id and r.driver_id = public.current_driver_id()
    )
  );

create policy "Admins manage payments" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins read audit" on public.audit_log
  for select using (public.is_admin());

drop policy if exists "Staff can manage profiles" on public.users;
create policy "Admins manage profiles" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.audit_row_change()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  entity jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
begin
  insert into public.audit_log(actor_id, actor_role, action, entity_type, entity_id, old_data, new_data)
  values (
    auth.uid(),
    public.current_user_role(),
    lower(tg_op),
    tg_table_name,
    entity ->> 'id',
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists audit_reservations on public.reservations;
create trigger audit_reservations after insert or update or delete on public.reservations
for each row execute function public.audit_row_change();

drop trigger if exists audit_drivers on public.drivers;
create trigger audit_drivers after insert or update or delete on public.drivers
for each row execute function public.audit_row_change();

-- Drivers may change only their assigned trip status and only in sequence.
create or replace function public.enforce_driver_reservation_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if public.is_driver() then
    if new.driver_id is distinct from old.driver_id
      or new.customer_id is distinct from old.customer_id
      or new.reservation_date is distinct from old.reservation_date
      or new.reservation_time is distinct from old.reservation_time
      or new.pickup_address is distinct from old.pickup_address
      or new.dropoff_address is distinct from old.dropoff_address
      or new.expected_amount_cents is distinct from old.expected_amount_cents
      or new.city_id is distinct from old.city_id
      or new.service_id is distinct from old.service_id
      or new.tour_id is distinct from old.tour_id
      or new.vehicle_id is distinct from old.vehicle_id
      or new.vehicle_type is distinct from old.vehicle_type
      or new.passengers is distinct from old.passengers
      or new.luggage is distinct from old.luggage
      or new.notes is distinct from old.notes
      or new.created_at is distinct from old.created_at then
      raise exception 'Drivers may only update trip status';
    end if;

    if not (
      (old.status in ('pending', 'confirmed') and new.status = 'accepted')
      or (old.status = 'accepted' and new.status = 'en_route')
      or (old.status = 'en_route' and new.status = 'started')
      or (old.status = 'started' and new.status = 'completed')
    ) then
      raise exception 'Invalid driver trip status transition';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_driver_reservation_update on public.reservations;
create trigger enforce_driver_reservation_update
before update on public.reservations
for each row execute function public.enforce_driver_reservation_update();

revoke all on function public.current_user_role() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_driver() from public, anon;
revoke all on function public.current_driver_id() from public, anon;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_driver() to authenticated;
grant execute on function public.current_driver_id() to authenticated;
