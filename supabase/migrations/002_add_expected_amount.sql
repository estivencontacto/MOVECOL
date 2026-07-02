alter table public.reservations
add column if not exists expected_amount_cents integer
check (expected_amount_cents is null or expected_amount_cents >= 0);
