-- Run after creating the first admin user in Supabase Auth.
-- Replace the values with the auth user id and admin details.

insert into public.users (id, full_name, role, phone)
values ('00000000-0000-0000-0000-000000000000', 'MOVE Admin', 'admin', '+570000000000')
on conflict (id) do update
set role = 'admin',
    full_name = excluded.full_name,
    phone = excluded.phone,
    updated_at = now();
