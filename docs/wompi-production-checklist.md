# Wompi: checklist de producción

## Qué estaba impidiendo el flujo

En el entorno local auditado no existe `.env.local`, por lo que no están disponibles las credenciales de Wompi ni Supabase. Además, el flujo dependía de `reservations.expected_amount_cents`; si la migración faltaba se creaba una reserva que después no podía validarse en el checkout. Ese fallback fue eliminado.

También se corrigieron estos riesgos:

- La consulta de una transacción usa la clave pública, suficiente para Web Checkout.
- La clave privada queda opcional y reservada para futuras operaciones directas de servidor.
- Cada intento usa una referencia única; una referencia completada no se reutiliza.
- El webhook ya no acepta la firma HMAC heredada.
- Un pago no confirma la reserva si el monto, COP, referencia o estado no coinciden.
- Los errores de escritura en `payments` o `reservations` ya no se ignoran.

## Configuración obligatoria

1. Aplicar las migraciones `001` a `004` en Supabase.
2. Configurar en el mismo ambiente:
   - `WOMPI_ENV=production`
   - `WOMPI_PUBLIC_KEY=pub_prod_...`
   - `WOMPI_EVENTS_SECRET=prod_events_...`
   - `WOMPI_INTEGRITY_SECRET=prod_integrity_...`
3. Configurar `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SECRET_KEY`.
4. Configurar `NEXT_PUBLIC_APP_URL` con la URL HTTPS canónica, sin rutas adicionales.
5. En el panel de Wompi de producción registrar:
   - Evento: `transaction.updated`
   - URL: `https://movecolombia.co/api/payments/wompi/webhook`
6. Registrar por separado la URL equivalente en el ambiente Sandbox de Wompi.
7. No aplicar un challenge de navegador al webhook.

`WOMPI_PRIVATE_KEY` no es necesaria para el checkout alojado actual. Si se configura, debe corresponder al mismo ambiente y permanecer solo en servidor.

## Verificación antes de cobrar

Ejecutar:

```bash
pnpm payments:check
pnpm deploy-check
```

Después:

1. Crear una reserva Sandbox desde la interfaz.
2. Confirmar que Wompi abre con COP, total y correo correctos.
3. Completar un pago de prueba.
4. Verificar una fila en `payments` con `provider_reference` y `provider_transaction_id`.
5. Verificar que la reserva cambia a `confirmed` solo para `APPROVED`.
6. Confirmar la recepción del webhook y del correo.
7. Probar un pago rechazado y luego reintentar: la segunda URL debe tener otra referencia.

No activar cobros reales hasta que `pnpm payments:check` termine sin `FAIL`.
