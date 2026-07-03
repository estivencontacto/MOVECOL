create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'operator', 'customer');
create type public.reservation_status as enum ('draft', 'pending_payment', 'confirmed', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'cancelled', 'refunded');
create type public.vehicle_type as enum ('sedan', 'suv', 'van', 'bus');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'customer',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  full_name text not null,
  email text not null unique,
  phone text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cities (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  airport text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  benefits jsonb not null default '[]',
  process jsonb not null default '[]',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.tours (
  id text primary key,
  city_id text not null references public.cities(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null,
  includes jsonb not null default '[]',
  excludes jsonb not null default '[]',
  duration text not null,
  schedules jsonb not null default '[]',
  base_price_cents integer not null check (base_price_cents >= 0),
  gallery jsonb not null default '[]',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create table public.vehicles (
  id text primary key,
  type public.vehicle_type not null,
  name text not null,
  capacity integer not null check (capacity > 0),
  luggage integer not null check (luggage >= 0),
  image_url text,
  description text,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique,
  phone text not null,
  document_id text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  city_id text not null references public.cities(id) on delete restrict,
  service_id text not null references public.services(id) on delete restrict,
  tour_id text references public.tours(id) on delete set null,
  vehicle_id text references public.vehicles(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  vehicle_type public.vehicle_type not null,
  status public.reservation_status not null default 'pending_payment',
  reservation_date date not null,
  reservation_time time not null,
  passengers integer not null check (passengers > 0),
  luggage integer not null check (luggage >= 0),
  pickup_address text not null,
  dropoff_address text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservation_items (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  label text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null default 0 check (unit_price_cents >= 0),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  provider text not null default 'wompi',
  provider_transaction_id text unique,
  amount_cents integer,
  currency text not null default 'COP',
  status public.payment_status not null default 'pending',
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  city_id text references public.cities(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  quote text not null,
  author_name text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.availability (
  id uuid primary key default gen_random_uuid(),
  city_id text not null references public.cities(id) on delete cascade,
  vehicle_type public.vehicle_type not null,
  available_date date not null,
  capacity integer not null default 0 check (capacity >= 0),
  created_at timestamptz not null default now(),
  unique (city_id, vehicle_type, available_date)
);

create table public.faq (
  id uuid primary key default gen_random_uuid(),
  service_id text references public.services(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index customers_email_idx on public.customers(email);
create index tours_city_idx on public.tours(city_id);
create index reservations_customer_idx on public.reservations(customer_id);
create index reservations_city_date_idx on public.reservations(city_id, reservation_date);
create index reservations_status_idx on public.reservations(status);
create index payments_reservation_idx on public.payments(reservation_id);
create index availability_city_date_idx on public.availability(city_id, available_date);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role in ('admin', 'operator')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Cliente MOVE'),
    'customer',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.cities enable row level security;
alter table public.services enable row level security;
alter table public.tours enable row level security;
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.availability enable row level security;
alter table public.faq enable row level security;

create policy "Users can read own profile" on public.users for select using (id = auth.uid() or public.is_staff());
create policy "Staff can manage profiles" on public.users for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read active cities" on public.cities for select using (active = true);
create policy "Staff can manage cities" on public.cities for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read active services" on public.services for select using (active = true);
create policy "Staff can manage services" on public.services for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read active tours" on public.tours for select using (active = true);
create policy "Staff can manage tours" on public.tours for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read available vehicles" on public.vehicles for select using (available = true);
create policy "Staff can manage vehicles" on public.vehicles for all using (public.is_staff()) with check (public.is_staff());

create policy "Staff can manage customers" on public.customers for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff can manage drivers" on public.drivers for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff can manage reservations" on public.reservations for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff can manage reservation items" on public.reservation_items for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff can manage payments" on public.payments for all using (public.is_staff()) with check (public.is_staff());
create policy "Public can read published reviews" on public.reviews for select using (published = true);
create policy "Staff can manage reviews" on public.reviews for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff can manage availability" on public.availability for all using (public.is_staff()) with check (public.is_staff());
create policy "Public can read published faq" on public.faq for select using (published = true);
create policy "Staff can manage faq" on public.faq for all using (public.is_staff()) with check (public.is_staff());

insert into public.cities (id, name, slug, description, airport) values
('medellin', 'Medellin', 'medellin', 'Transporte privado y tours premium en Medellin y Antioquia.', 'Aeropuerto Internacional Jose Maria Cordova'),
('bogota', 'Bogota', 'bogota', 'Transporte ejecutivo, aeropuerto y tours privados en Bogota.', 'Aeropuerto Internacional El Dorado')
on conflict (id) do nothing;

insert into public.services (id, title, slug, category, description, benefits, process) values
('airport-transfer', 'Traslado Aeropuerto', 'traslado-aeropuerto', 'airport-transfer', 'Traslados privados desde y hacia aeropuertos.', '["Monitoreo de vuelo", "Tiempo de espera incluido"]', '["Selecciona ciudad", "Confirmamos conductor"]'),
('transfers', 'Traslados dentro y fuera de la ciudad', 'traslados', 'transfers', 'Traslados privados punto a punto dentro y fuera de la ciudad.', '["Origen y destino personalizados", "Precio por distancia"]', '["Indica origen y destino", "Calculamos la ruta"]'),
('private-tours', 'Tours Privados', 'tours-privados', 'private-tour', 'Experiencias culturales y naturales con transporte privado.', '["Itinerario personalizado", "Tiempo coordinado"]', '["Elige destino", "Confirmamos disponibilidad"]'),
('corporate', 'Transporte Corporativo', 'transporte-corporativo', 'corporate', 'Movilidad para empresas, equipos e invitados.', '["Conductores verificados", "Coordinacion por agenda"]', '["Registramos agenda", "Asignamos flota"]'),
('hourly', 'Servicio por Horas', 'servicio-por-horas', 'hourly', 'Vehiculo y conductor por bloques horarios.', '["Agenda flexible", "Multiples paradas"]', '["Define horas", "Operamos la ruta"]'),
('medical-tourism', 'Turismo Medico', 'turismo-medico', 'medical-tourism', 'Movilidad discreta para pacientes y acompanantes.', '["Atencion discreta", "Coordinacion clinica"]', '["Comparte agenda", "Asignamos vehiculo"]'),
('events', 'Eventos', 'eventos', 'events', 'Logistica de transporte para eventos.', '["Flota coordinada", "Rutas por grupos"]', '["Dimensionamos asistentes", "Operamos calendario"]')
on conflict (id) do nothing;

insert into public.vehicles (id, type, name, capacity, luggage, description, available) values
('sedan-premium', 'sedan', 'Sedan Premium', 3, 2, 'Ideal para aeropuerto y ejecutivos.', true),
('suv-executive', 'suv', 'SUV Executive', 5, 4, 'Mayor confort para familias y clientes VIP.', true),
('van-private', 'van', 'Van Privada', 10, 8, 'Perfecta para grupos y tours.', true),
('bus-group', 'bus', 'Bus Ejecutivo', 35, 25, 'Eventos y grupos grandes.', true)
on conflict (id) do nothing;

insert into public.tours
(id, city_id, name, slug, description, includes, excludes, duration, schedules, base_price_cents, gallery)
values
('med-city-tour', 'medellin', 'City Tour', 'city-tour', 'Recorrido privado por los puntos esenciales de Medellin.', '["Conductor privado", "Recogida en hotel", "Paradas fotograficas"]', '["Alimentacion", "Entradas no especificadas"]', '4 horas', '["08:00", "10:00", "14:00"]', 42000000, '[]'),
('med-comuna-13', 'medellin', 'Comuna 13', 'comuna-13', 'Arte urbano, historia local y miradores.', '["Transporte privado", "Guia local", "Seguro de asistencia"]', '["Almuerzo", "Compras personales"]', '3 horas', '["09:00", "13:00", "15:30"]', 36000000, '[]'),
('med-guatape', 'medellin', 'Guatape', 'guatape', 'Dia completo hacia la Piedra del Penol y Guatape.', '["Transporte privado", "Peajes", "Agua a bordo"]', '["Entrada a la piedra", "Alimentacion"]', '10 horas', '["07:00", "08:00"]', 85000000, '[]'),
('med-vuelta-oriente', 'medellin', 'Vuelta al Oriente Antioqueno', 'vuelta-al-oriente', 'Recorrido privado por pueblos tradicionales del Oriente Antioqueno.', '["El Retiro", "La Ceja", "San Antonio de Pereira", "Alto de Tequendamita"]', '["Alimentacion", "Entradas no especificadas"]', '8 horas', '["08:00"]', 55000000, '[]'),
('med-coffee-tour', 'medellin', 'Coffee Tour', 'coffee-tour', 'Experiencia cafetera privada con traslado desde Medellin.', '["Transporte", "Experiencia cafetera", "Degustacion"]', '["Almuerzo"]', '6 horas', '["08:00"]', 62000000, '[]'),
('med-hacienda-napoles', 'medellin', 'Hacienda Napoles', 'hacienda-napoles', 'Traslado privado de dia completo hacia el parque tematico.', '["Transporte", "Peajes", "Espera coordinada"]', '["Entradas", "Alimentacion"]', '14 horas', '["05:30"]', 145000000, '[]'),
('med-parapente', 'medellin', 'Parapente', 'parapente', 'Actividad de parapente en San Felix con operador externo.', '["Transporte", "Coordinacion logistica", "Vuelo panoramico"]', '["Fotos o videos del operador", "Extras no especificados"]', '4 horas', '["08:00", "11:00", "14:00"]', 35000000, '[]'),
('med-compras', 'medellin', 'Tour de Compras', 'tour-de-compras', 'Recorrido por el corazon comercial de Medellin.', '["El Hueco", "Moda y calzado", "Acompanamiento"]', '["Compras personales", "Alimentacion"]', '4 horas aproximadamente', '["09:00", "13:00"]', 19500000, '[]'),
('med-pablo-escobar', 'medellin', 'Pablo Escobar Tour', 'pablo-escobar-tour', 'Recorrido historico privado por lugares representativos.', '["Transporte privado con guia experto", "Parque de la Inflexion", "La Catedral"]', '["Entradas opcionales", "Alimentacion"]', '5 horas', '["08:30", "14:00"]', 19500000, '[]'),
('med-miradores', 'medellin', 'Miradores', 'miradores', 'Ruta por miradores y zonas gastronomicas.', '["Transporte privado", "Paradas flexibles"]', '["Consumos"]', '4 horas', '["16:00", "18:00"]', 43000000, '[]'),
('med-santa-fe', 'medellin', 'Santa Fe de Antioquia', 'santa-fe-de-antioquia', 'Pueblo patrimonio, arquitectura colonial y Puente de Occidente.', '["Transporte privado", "Peajes", "Agua a bordo"]', '["Alimentacion", "Guia especializado"]', '8 horas', '["08:00"]', 76000000, '[]'),
('bog-city-tour', 'bogota', 'City Tour', 'city-tour', 'Recorrido privado por iconos historicos y culturales de Bogota.', '["Transporte privado", "Recogida en hotel", "Paradas principales"]', '["Entradas", "Alimentacion"]', '5 horas', '["08:00", "13:00"]', 48000000, '[]'),
('bog-hacienda-napoles', 'bogota', 'Hacienda Napoles', 'hacienda-napoles', 'Traslado privado de dia completo hacia Hacienda Napoles.', '["Transporte", "Desayuno", "Pasaporte elegido"]', '["Gastos no especificados", "Gastos en carretera"]', 'Dia completo', '["05:00", "06:00"]', 40000000, '[]'),
('bog-miradores', 'bogota', 'Miradores', 'miradores', 'Ruta privada por miradores urbanos de Bogota.', '["Mirador La Cueva del Arco", "Mirador La Calera", "Mirador Monserrate"]', '["Entradas no especificadas"]', '4 horas aproximadamente', '["16:00", "18:00", "20:00"]', 18000000, '[]'),
('bog-monserrate', 'bogota', 'Monserrate', 'monserrate', 'Traslado privado para visitar el cerro mas emblematico.', '["Transporte", "Espera coordinada"]', '["Ticket funicular/teleferico", "Alimentacion"]', '3 horas', '["08:00", "15:00"]', 31000000, '[]'),
('bog-centro-historico-candelaria', 'bogota', 'Tour Centro Historico La Candelaria', 'centro-historico-candelaria', 'Historia, arquitectura y patrimonio en el centro historico.', '["Avenida Jimenez", "Plaza de Bolivar", "Entrada al Museo del Oro"]', '["Museos adicionales", "Alimentacion"]', '4 horas', '["09:00", "14:00"]', 13000000, '[]'),
('bog-gran-san-victorino', 'bogota', 'Tour Compras Gran San Victorino', 'gran-san-victorino', 'Recorrido privado por el corazon comercial de Bogota.', '["Transporte", "Tiendas mayoristas", "Tiempo libre"]', '["Compras personales", "Alimentacion"]', '3 horas', '["09:00", "13:00"]', 13000000, '[]'),
('bog-zona-t', 'bogota', 'Zona T', 'zona-t', 'Salida privada a una de las zonas mas vibrantes de Bogota.', '["Transporte", "Zona T", "Tiempo libre"]', '["Consumos", "Reservas en restaurantes"]', '4 horas', '["17:00", "19:00", "21:00"]', 9000000, '[]'),
('bog-guatavita', 'bogota', 'Guatavita', 'guatavita', 'Laguna sagrada, pueblo blanco y ruta privada desde Bogota.', '["Transporte", "Peajes", "Agua"]', '["Entrada a la laguna", "Alimentacion"]', '8 horas', '["07:00"]', 78000000, '[]'),
('bog-catedral-sal', 'bogota', 'Catedral de Sal', 'catedral-de-sal', 'Visita privada a Zipaquira y su Catedral de Sal.', '["Transporte", "Peajes", "Espera"]', '["Entradas", "Almuerzo"]', '7 horas', '["08:00"]', 69000000, '[]'),
('bog-jaime-duque', 'bogota', 'Tour Parque Jaime Duque', 'parque-jaime-duque', 'Recorrido guiado al parque tematico mas grande de Colombia.', '["Transporte", "Guia", "Logistica"]', '["Tren de los Andes", "Bicicletas de Ecoparque Sabana"]', '1 hora y media aproximadamente desde Bogota', '["08:00"]', 26000000, '[]')
on conflict (id) do nothing;

insert into public.faq (service_id, question, answer, sort_order) values
('airport-transfer', 'Que pasa si mi vuelo se retrasa?', 'Monitoreamos el vuelo y ajustamos la recogida segun disponibilidad operativa.', 1),
('hourly', 'Hay limite de paradas?', 'No hay limite fijo; se coordina segun tiempo contratado y condiciones de ruta.', 1),
('medical-tourism', 'Pueden coordinar varias citas?', 'Si, el equipo organiza rutas con tiempos de espera y ventanas entre citas.', 1),
('corporate', 'Manejan cuentas corporativas?', 'Si, la plataforma contempla clientes empresariales, pagos y reportes.', 1),
('events', 'Pueden operar buses y vans?', 'Si, el inventario contempla sedan, SUV, van y bus segun disponibilidad.', 1);
