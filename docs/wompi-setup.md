# Implementación de Wompi para MOVE Colombia

La guía vigente y el diagnóstico del flujo están en
[wompi-production-checklist.md](wompi-production-checklist.md).

Antes de cobrar:

```bash
supabase db push
pnpm payments:check
pnpm deploy-check
```

Las credenciales deben permanecer en `.env.local` o en el almacén cifrado de variables del proveedor de hosting. Nunca deben agregarse al repositorio.
