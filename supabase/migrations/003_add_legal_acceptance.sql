alter table public.reservations
add column if not exists terms_version text,
add column if not exists terms_accepted_at timestamptz,
add column if not exists privacy_accepted_at timestamptz;

comment on column public.reservations.terms_version is
'Version of the terms accepted before payment.';

comment on column public.reservations.terms_accepted_at is
'Timestamp when the customer accepted the terms and conditions.';

comment on column public.reservations.privacy_accepted_at is
'Timestamp when the customer accepted the privacy policy.';
