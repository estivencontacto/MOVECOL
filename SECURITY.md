# Seguridad de MOVE Colombia

Ningún sitio público puede prometer ser “impenetrable”. Este proyecto aplica defensa en profundidad y debe mantenerse actualizado, monitoreado y respaldado.

## Controles incluidos

- Validación Zod, límites de longitud y rechazo de HTML/caracteres de control en entradas públicas.
- Lectura JSON con tipo de contenido obligatorio y límite de 32 KB.
- Protección de origen para operaciones iniciadas desde el navegador.
- Rate limit por IP y recurso, con respuestas `429` y `Retry-After`.
- Consultas Supabase parametrizadas; no se construye SQL con entradas del usuario.
- RLS forzado en tablas públicas y uso de la clave secreta de Supabase solo en servidor.
- CSP, HSTS, anti-iframe, `nosniff`, política de referentes y permisos mínimos.
- Webhook Wompi autenticado únicamente con el checksum oficial y comparación en tiempo constante.
- Confirmación de pagos solo cuando referencia, monto esperado, moneda y estado coinciden.
- Referencia distinta para cada intento de pago.
- Secretos y certificados excluidos del repositorio.

El rate limit en memoria protege cada instancia. En Vercel debe complementarse con reglas del Firewall para obtener un límite distribuido global.

## Secretos

Copiar `.env.example` a `.env.local` únicamente en el equipo local. En Vercel, crear las variables cifradas en Project Settings → Environment Variables.

Nunca usar el prefijo `NEXT_PUBLIC_` para:

- `SUPABASE_SECRET_KEY`
- `WOMPI_PRIVATE_KEY`
- `WOMPI_EVENTS_SECRET`
- `WOMPI_INTEGRITY_SECRET`
- `RESEND_API_KEY`
- `GOOGLE_MAPS_API_KEY`

La clave publicable de Supabase, la clave pública de Wompi y la clave de navegador de Google Maps no son secretos, pero deben restringirse por origen, dominio, API y cuota.

Rotar inmediatamente cualquier credencial que haya aparecido en un commit, captura, log, chat o despliegue público. Borrar el texto del último commit no elimina el secreto del historial.

## Reglas recomendadas en Vercel Firewall

Configurar reglas distribuidas además del control de la aplicación:

1. `POST /api/reservations`: 5 solicitudes por IP cada 10 minutos.
2. `POST /api/contact`: 5 solicitudes por IP cada 10 minutos.
3. `POST /api/payments/wompi/checkout`: 10 solicitudes por IP cada 10 minutos.
4. `/api/pricing/route`: 30 solicitudes por IP por minuto.
5. Excluir `/api/payments/wompi/webhook` de challenges interactivos y protección de bots que exija JavaScript. La aplicación valida su checksum y limita 300 solicitudes por minuto.
6. Activar Bot Protection y revisar eventos antes de convertir reglas nuevas en bloqueos estrictos.

## Operación

- Ejecutar `pnpm typecheck`, `pnpm lint`, `pnpm build` y `pnpm payments:check` antes de publicar.
- Aplicar todas las migraciones de `supabase/migrations` en orden.
- Revisar alertas de dependencias y actualizar Next.js y Supabase con frecuencia.
- No registrar cuerpos de formularios, tokens, cabeceras de autorización ni payloads completos de pago.
- Limitar el acceso al panel de Vercel, Supabase, Wompi, Google Cloud y Resend con MFA.

Los reportes de seguridad deben enviarse a `contactateconseda@gmail.com`.
