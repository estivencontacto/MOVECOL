-- Enum changes are isolated because PostgreSQL requires a commit before new values are used.
alter type public.user_role add value if not exists 'driver';
alter type public.reservation_status add value if not exists 'pending';
alter type public.reservation_status add value if not exists 'accepted';
alter type public.reservation_status add value if not exists 'en_route';
alter type public.reservation_status add value if not exists 'started';
