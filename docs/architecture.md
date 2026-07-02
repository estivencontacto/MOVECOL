# MOVE Colombia Architecture

MOVE Colombia is structured as a modular Next.js platform where public acquisition,
booking, payment, and operations share the same domain contracts.

## Layers

- `app/`: App Router pages, metadata, SEO files, API routes, and admin routes.
- `components/`: Reusable UI, booking, admin, layout, and marketing sections.
- `lib/domain`: TypeScript domain types and Zod validation schemas.
- `lib/data`: Seed catalog used by the MVP and as a bridge to Supabase-backed CRUD.
- `lib/services`: Application use cases such as pricing, reservations, email, and WhatsApp preparation.
- `lib/supabase`: Browser, SSR, request-context, and admin Supabase clients.
- `supabase/migrations`: PostgreSQL schema, relations, indexes, RLS policies, and seed data.

## Growth Model

Cities, services, tours, vehicles, drivers, availability, reservations, payments, FAQ,
and reviews are separate tables. Adding a city means inserting a `cities` row and
related tours/availability; core reservation logic does not need to change.

## Authentication And Roles

Supabase Auth owns identity. The `public.users` profile table stores:

- `admin`: full access to CRUD and platform settings.
- `operator`: operational access to reservations, customers, drivers, availability, and payments.
- `customer`: future customer portal role.

RLS is enabled across operational tables. Cookie-based Next.js auth keeps using
`@supabase/ssr` for session refresh, while `@supabase/server` provides
stateless request handlers, JWT verification through `SUPABASE_JWKS_URL`, an
RLS-scoped context client, and an admin client backed by `SUPABASE_SECRET_KEY`.

## Payments

Wompi checkout URL generation is isolated in `lib/wompi.ts`. The reservation API
creates a pending reservation, calculates the amount, builds the checkout URL, and
then queues confirmation channels. The webhook stores payment payloads and updates
reservation status.

Before production, verify webhook signature headers and event fields against the
active Wompi account settings.

## SEO

The app includes:

- Global metadata and Open Graph image.
- Dynamic canonical metadata for city, tour, and service pages.
- `sitemap.xml`.
- `robots.txt`.
- Organization structured data.
