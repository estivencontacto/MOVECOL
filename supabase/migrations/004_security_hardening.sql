alter table public.payments
add column if not exists provider_reference text;

create unique index if not exists payments_provider_reference_uidx
on public.payments(provider_reference)
where provider_reference is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'payments_provider_reference_length'
  ) then
    alter table public.payments
    add constraint payments_provider_reference_length
    check (provider_reference is null or length(provider_reference) between 1 and 120);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'payments_wompi_currency'
  ) then
    alter table public.payments
    add constraint payments_wompi_currency
    check (provider <> 'wompi' or currency = 'COP');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'payments_amount_nonnegative'
  ) then
    alter table public.payments
    add constraint payments_amount_nonnegative
    check (amount_cents is null or amount_cents >= 0);
  end if;
end
$$;

alter table public.users force row level security;
alter table public.customers force row level security;
alter table public.cities force row level security;
alter table public.services force row level security;
alter table public.tours force row level security;
alter table public.vehicles force row level security;
alter table public.drivers force row level security;
alter table public.reservations force row level security;
alter table public.reservation_items force row level security;
alter table public.payments force row level security;
alter table public.reviews force row level security;
alter table public.availability force row level security;
alter table public.faq force row level security;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

comment on column public.payments.provider_reference is
'Unique Wompi checkout reference. It identifies one payment attempt and must never contain a secret.';
