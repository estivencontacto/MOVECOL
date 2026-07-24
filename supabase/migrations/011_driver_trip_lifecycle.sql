begin;

create or replace function public.driver_update_trip(
  p_driver_id uuid,
  p_reservation_id uuid,
  p_status text,
  p_observation text default null
)
returns table(reservation_id uuid, reservation_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_status text;
  driver_name text;
begin
  select d.full_name
  into driver_name
  from public.drivers d
  where d.id = p_driver_id
    and d.status = 'active'
    and d.deactivated_at is null;

  if driver_name is null then
    raise exception 'Active driver not found';
  end if;

  select r.status::text
  into current_status
  from public.reservations r
  where r.id = p_reservation_id
    and r.driver_id = p_driver_id
  for update;

  if current_status is null then
    raise exception 'Assigned reservation not found';
  end if;

  if p_status = 'started' then
    if current_status not in ('pending', 'confirmed', 'accepted', 'en_route') then
      raise exception 'Trip cannot be started from current status';
    end if;
  elsif p_status = 'completed' then
    if current_status <> 'started' then
      raise exception 'Trip must be started before completion';
    end if;
    if p_observation is null or char_length(trim(p_observation)) < 2 or char_length(trim(p_observation)) > 1000 then
      raise exception 'A final observation is required';
    end if;
  else
    raise exception 'Driver status is not allowed';
  end if;

  update public.reservations
  set status = p_status::public.reservation_status
  where id = p_reservation_id
    and driver_id = p_driver_id;

  if p_status = 'completed' then
    insert into public.reservation_observations (
      reservation_id,
      action,
      observation,
      author_id,
      author_name
    )
    values (
      p_reservation_id,
      'close',
      trim(p_observation),
      null,
      driver_name
    );
  end if;

  return query
  select p_reservation_id, p_status;
end;
$$;

revoke all on function public.driver_update_trip(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.driver_update_trip(uuid, uuid, text, text) to service_role;

commit;
