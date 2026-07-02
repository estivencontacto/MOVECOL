# MOVE Colombia

Plataforma web profesional para reservas de transporte privado, traslados al
aeropuerto, tours privados, turismo medico, transporte corporativo y servicios
por horas en Colombia.

Sitio de produccion: `https://movecolombia.co`

## Descripcion Del Proyecto

MOVE Colombia esta pensada como una plataforma comercial lista para monetizar:
permite presentar destinos, servicios y tours por ciudad, recibir reservas,
calcular traslados con Google Maps, manejar tarifas en COP/USD, preparar pagos
con Wompi y administrar la operacion desde un dashboard privado.

La arquitectura esta preparada para escalar a nuevas ciudades sin duplicar
componentes: Medellin y Bogota funcionan desde datos centralizados, componentes
reutilizables y paginas generadas automaticamente para tours y servicios.

## Funcionalidades

- Landing premium responsive con seleccion dinamica de ciudad.
- Catalogo de tours, servicios, flota y destinos.
- Flujo de reserva guiado para tours, servicios y traslados privados.
- Google Places Autocomplete para origen y destino.
- Estimacion de ruta, distancia, duracion y tarifa con Google Maps.
- Comision de pasarela del 5% en el resumen de pago.
- Precios fijos por tour, minimo de pasajeros y tours de precio global.
- Cambio visual entre COP y USD con tasa de referencia configurable.
- Soporte bilingue para experiencia en espanol e ingles.
- Integracion base con Wompi para checkout y webhook.
- Autenticacion y base de datos con Supabase.
- Dashboard administrativo para operacion y reservas.
- SEO, Open Graph y Schema.org para ciudades, tours y servicios.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Componentes reutilizables estilo shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- TanStack Query
- Supabase Auth, PostgreSQL y RLS
- Google Maps Platform
- Wompi
- Vercel

## Arquitectura

Ver [docs/architecture.md](docs/architecture.md).

Para configurar pagos reales con Wompi, webhooks, confirmacion de reservas y correos:
[docs/wompi-setup.md](docs/wompi-setup.md).

El proyecto separa paginas publicas, flujo de reserva, administracion, esquemas
de dominio, servicios de aplicacion, infraestructura Supabase y migraciones de
base de datos.

Rutas principales:

- `/`: landing principal.
- `/reservar`: flujo profesional de reserva.
- `/destinos/medellin`: pagina de Medellin.
- `/destinos/bogota`: pagina de Bogota.
- `/destinos/[city]/[tour]`: detalle de tour.
- `/servicios/[slug]`: detalle de servicio.
- `/login`: acceso administrativo con Supabase Auth.
- `/admin`: dashboard operativo.
- `/admin/reservas`: tabla de reservas.

## Configuracion Local

Requisitos:

- Node.js `>=20.18.0`
- pnpm
- Proyecto Supabase
- Llaves de Google Maps Platform
- Cuenta Wompi para pagos

Instalacion:

```bash
pnpm install
pnpm dev
```

Copia `.env.example` como `.env.local` y completa las variables reales:

```bash
NEXT_PUBLIC_APP_URL=https://movecolombia.co
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

WOMPI_ENV=sandbox
WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_EVENTS_SECRET=
WOMPI_INTEGRITY_SECRET=

RESEND_API_KEY=
EMAIL_FROM=MOVE Colombia <reservas@movecolombia.co>
OPERATIONS_EMAIL=reservas@movecolombia.co
WHATSAPP_BUSINESS_PHONE=

GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=
EXCHANGE_RATE_API_KEY=
USD_COP_FALLBACK_RATE=4000
```

## Base De Datos

Instala y autentica Supabase CLI, luego aplica migraciones:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Crea el primer usuario administrador en Supabase Auth y ejecuta
`scripts/create-admin-profile.sql` con el id del usuario creado.

## Validacion

Antes de desplegar:

```bash
node scripts/deploy-check.mjs
pnpm typecheck
pnpm build
```

## Despliegue

1. Subir el repositorio a GitHub.
2. Importar el proyecto en Vercel.
3. Configurar las variables de entorno usando `.env.example` como guia.
4. Asociar el dominio `movecolombia.co`.
5. Ejecutar despliegue de produccion.

## Seguridad

- Nunca subir `.env.local`, `.env`, `.vercel`, `.next` ni secretos reales.
- Mantener las llaves privadas de Wompi, Supabase y Google Maps solo en Vercel.
- Restringir la llave publica de Google Maps por dominio en Google Cloud.
- Restringir la llave server-side de Google Maps por API y entorno cuando sea posible.
- Revisar webhooks de Wompi antes de pasar a produccion real.
- Usar RLS en Supabase para proteger informacion de clientes, reservas y pagos.

## Guia De Calidad

Para nuevas ciudades, tours, imagenes y paginas internas, seguir
[docs/quality-guide.md](docs/quality-guide.md).

La regla principal: agregar una ciudad nueva debe depender de datos, imagenes y
contenido, no de duplicar componentes ni romper la logica existente.
