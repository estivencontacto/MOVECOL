alter table public.vehicles
alter column luggage drop not null;

update public.vehicles set capacity = 4 where type in ('sedan', 'suv');

insert into public.vehicles
  (id, type, name, capacity, luggage, description, available)
values
  ('six-passenger', 'six-passenger', 'Vehiculo de 6 pasajeros', 6, null, 'Alternativa privada para grupos de hasta seis pasajeros.', true)
on conflict (id) do update set
  type = excluded.type,
  name = excluded.name,
  capacity = excluded.capacity,
  luggage = excluded.luggage,
  description = excluded.description,
  available = excluded.available;
