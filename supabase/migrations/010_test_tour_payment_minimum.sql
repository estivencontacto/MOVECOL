begin;

update public.tours
set
  base_price_cents = 150000,
  updated_at = now()
where id = 'bog-tour-prueba';

commit;
