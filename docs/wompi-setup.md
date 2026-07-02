# Implementacion de Wompi para MOVE Colombia

Esta guia deja el flujo listo para recibir pagos reales con Wompi, confirmar reservas y enviar correo al cliente cuando el pago queda aprobado.

## 1. Crear o revisar la cuenta Wompi

1. Entra al panel de Wompi.
2. Activa primero ambiente sandbox para pruebas.
3. Copia las credenciales publicas y privadas del comercio.
4. Cuando ya pruebes todo, cambia a credenciales de produccion.

## 2. Configurar variables en Vercel

En Vercel, entra al proyecto de MOVE Colombia y abre `Settings > Environment Variables`.

Agrega estas variables para `Production`, `Preview` y `Development` segun aplique:

```bash
NEXT_PUBLIC_APP_URL=https://movecolombia.co

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_EVENTS_SECRET=
WOMPI_INTEGRITY_SECRET=

RESEND_API_KEY=
EMAIL_FROM=MOVE Colombia <reservas@movecolombia.co>
OPERATIONS_EMAIL=

GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=
```

Notas importantes:

- `WOMPI_PUBLIC_KEY` se usa para crear el link de checkout.
- `WOMPI_INTEGRITY_SECRET` firma el checkout para que el monto no se manipule.
- `WOMPI_EVENTS_SECRET` valida webhooks. Si falta, el webhook se rechaza por seguridad.
- `SUPABASE_SERVICE_ROLE_KEY` nunca va al frontend. Solo se usa del lado servidor.
- `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` es necesaria para autocompletado y minimapas visibles.

## 3. Aplicar la migracion de Supabase

Antes de cobrar en produccion, aplica la migracion:

```bash
supabase db push
```

La migracion agregada es:

```bash
supabase/migrations/002_add_expected_amount.sql
```

Esto crea `reservations.expected_amount_cents`, que guarda el monto esperado de la reserva. El checkout de Wompi intenta usar ese valor guardado, y el webhook compara el valor pagado contra ese valor para detectar diferencias.

## 4. Configurar webhook en Wompi

En el panel de Wompi, crea un webhook apuntando a:

```text
https://movecolombia.co/api/payments/wompi/webhook
```

Activa los eventos de transacciones/pagos, especialmente los que indiquen pago aprobado, rechazado o anulado.

El sistema espera que la referencia de Wompi sea el `reservationId`. Esa referencia se genera automaticamente cuando el cliente crea la reserva.

## 5. Flujo esperado del pago

1. El cliente completa `/reservar`.
2. El backend crea la reserva en Supabase con estado `pending_payment`.
3. El backend calcula y guarda `expected_amount_cents`.
4. El backend genera el checkout de Wompi.
5. El cliente paga en Wompi.
6. Wompi redirige a:

```text
https://movecolombia.co/pago-exitoso?reservation=<reservationId>
```

7. Wompi envia webhook al backend.
8. El backend valida la firma con `WOMPI_EVENTS_SECRET`.
9. El backend compara `expected_amount_cents` contra `transaction.amount_in_cents`.
10. Si el pago esta aprobado, la reserva pasa a `confirmed`.
11. El sistema envia correo de confirmacion al cliente con los datos de la reserva.
12. La pantalla de pago exitoso muestra resumen de la reserva y un upsell relacionado.

## 6. Pruebas antes de produccion

1. Configura credenciales sandbox de Wompi.
2. Configura las variables en Vercel Preview.
3. Crea una reserva real desde `/reservar`.
4. Verifica que Wompi abra checkout.
5. Completa un pago de prueba aprobado.
6. Confirma en Supabase:
   - reserva creada
   - `expected_amount_cents` guardado
   - pago insertado en `payments`
   - reserva actualizada a `confirmed`
7. Verifica que llegue correo al cliente.
8. Revisa que `/pago-exitoso?reservation=<id>` muestre los datos.

## 7. Paso a produccion

1. Cambia credenciales sandbox por credenciales reales de Wompi.
2. Confirma que `NEXT_PUBLIC_APP_URL` sea `https://movecolombia.co`.
3. Confirma que el webhook de produccion apunte a `https://movecolombia.co/api/payments/wompi/webhook`.
4. Ejecuta `pnpm deploy-check` antes de desplegar.
5. Despliega a produccion.

## 8. Seguridad aplicada

- Si falta `WOMPI_EVENTS_SECRET`, el webhook falla cerrado.
- Los errores publicos no devuelven mensajes internos del servidor.
- El webhook no bloquea automaticamente una reserva por diferencia de monto, pero deja `console.error` con los valores para revision manual.
- El checkout intenta usar el monto esperado guardado en Supabase.
- Los endpoints publicos tienen rate limit basico.

