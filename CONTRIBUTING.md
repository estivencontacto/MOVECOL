# Contributing To MOVE Colombia

## Workflow

1. Work from the main project folder.
2. Keep changes scoped and avoid touching pricing logic unless the task requires it.
3. Run checks before deploy:

```bash
pnpm typecheck
pnpm build
node scripts/deploy-check.mjs
```

## Security And RLS

MOVE Colombia uses Supabase Row Level Security as the source of truth for admin
authorization. The frontend can hide screens or buttons, but it is not a
security boundary.

The database function `public.is_staff()` checks whether the authenticated user
has role `admin` or `operator` in `public.users`. RLS policies call this
function so data access is enforced inside PostgreSQL, even if a request is made
outside the browser UI.

Why this matters:

- Admin routes are protected in middleware.
- Database reads/writes are also protected by RLS.
- Staff checks stay centralized and auditable.
- Frontend-only checks are treated as UX, not security.

## Payments

Wompi webhooks must fail closed when `WOMPI_EVENTS_SECRET` is missing. Payment
confirmation compares the paid amount against `reservations.expected_amount_cents`
and logs mismatches for manual review.

Never log raw payment payloads, private keys, service role keys, access tokens,
passwords, or complete customer records.
