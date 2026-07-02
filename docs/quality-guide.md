# MOVE Colombia Internal Page Quality Guide

Guia breve para crear o revisar ciudades, tours y servicios internos sin romper el
estandar premium del sitio.

## 1. Estructura de imagenes

Usa carpetas consistentes por ciudad y tipo de pagina:

- `public/images/{CIUDAD}/SERVICIOS/{SERVICIO}/HERO/`
- `public/images/{CIUDAD}/SERVICIOS/{SERVICIO}/CARD/`
- `public/images/{CIUDAD}/SERVICIOS/{SERVICIO}/GALERIA/`
- `public/images/{CIUDAD}/TOURS/{TOUR}/HERO/`
- `public/images/{CIUDAD}/TOURS/{TOUR}/CARD/`
- `public/images/{CIUDAD}/TOURS/{TOUR}/GALERIA/`

Criterios:

- Hero: horizontal, nitido, reconocible, sin texto incrustado.
- Card: imagen clara del servicio/tour, no demasiado oscura.
- Galeria: 3 a 6 imagenes, mezclando destino, detalle y contexto.
- Evitar imagenes genericas cuando exista una foto real del lugar o servicio.

## 2. Datos minimos en `lib/data/catalog.ts`

Para ciudad:

- `name`, `slug`, `headline`, `description`, `airport`, `image`, `heroImage`.
- `heroTitle` y `heroSubtitle` deben sonar comerciales, no institucionales.
- `heroGallery` idealmente con 3 imagenes.
- `serviceIds` debe listar solo servicios disponibles en esa ciudad.

Para tour:

- `description` debe explicar destino + valor privado + ritmo del viaje.
- `includes`, `excludes`, `duration`, `schedules`, `basePrice`.
- No cambiar precios desde componentes; la tarifa vive en data central.
- `recommendations` y `keywords` mejoran SEO y conversion.

Para servicio:

- `description` orientada a un caso real de uso.
- `benefits` con 3 beneficios concretos.
- `process` con 3 pasos maximo, desde solicitud hasta confirmacion.
- `faqs` con preguntas que resuelvan friccion comercial.

## 3. Copy y layout

Cada pagina interna debe responder rapido:

- Que es.
- Para quien sirve.
- Que incluye.
- Como se confirma.
- Cual es el CTA principal.

Tono:

- Premium, claro y operacional.
- Evitar frases genericas como "la mejor experiencia" sin soporte.
- Usar palabras concretas: conductor, horario, aeropuerto, equipaje, espera,
  ruta, agenda, grupo, paciente, empresa.

Layout esperado:

- Hero full-bleed con imagen, badges, promesa y CTA.
- Cards de senales de confianza: coordinacion, puntualidad, soporte.
- Galeria visual antes o cerca de la decision.
- Sticky CTA con precio en tours o resumen en servicios.
- Relacionados en tours para mantener exploracion.

## 4. SEO y Schema

Usar helpers de `lib/seo.ts`:

- `cityMetadata`, `tourMetadata`, `serviceMetadata`.
- `citySchema`, `tourSchema`, `serviceSchema`.
- `breadcrumbSchema`.
- `faqSchema` para servicios con FAQs.

Buenas practicas:

- Canonical limpio sin query params comerciales.
- Titles con ciudad y tipo de servicio.
- Descriptions con beneficio operativo y contexto local.
- Imagen Open Graph tomada de hero/card real.

## 5. Checklist de QA

Antes de cerrar una ciudad o servicio:

- La pagina no depende de cambios en landing ni booking.
- Los CTAs apuntan a `/reservar` con `city`, `tour` o `service` correctos.
- El precio mostrado viene de `tour.basePrice`.
- No hay texto sobrepuesto ilegible en hero o cards.
- Mobile: hero, cards, galeria y sticky CTA no se rompen.
- TypeScript y build pasan.
- Schema JSON-LD no contiene `undefined` visible.
