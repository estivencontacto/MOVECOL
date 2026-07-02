# MOVE Colombia Image Map

Esta guia muestra donde cambiar las imagenes principales del sitio.

## Landing / Dashboard Principal

Archivo principal:

- `components/sections/landing.tsx`

Imagenes que cambian cuando eliges Bogota o Medellin al inicio:

- `landingCityContent.bogota.heroImage`
- `landingCityContent.medellin.heroImage`

Esas mismas imagenes alimentan el fondo principal y las miniaturas de los botones
de ciudad.

Tours mas reservados del inicio:

- Primero usa `tour.cardImage` en `lib/data/catalog.ts`.
- Si el tour no tiene `cardImage`, usa `tour.heroImage`.
- Si tampoco existe, usa el fallback `landingTourImages` en `components/sections/landing.tsx`.

Servicios del inicio:

- Primero usa `serviceAssetsByCity` en `lib/data/catalog.ts`.
- Si no hay imagen local, usa el fallback `landingServiceImages` en `components/sections/landing.tsx`.

Flota de vehiculos:

- `vehicles` en `lib/data/catalog.ts`
- Carpeta: `public/images/GLOBAL/VEHICULOS/`

## Tours

Cada tour vive en `lib/data/catalog.ts`.

Campos por tour:

- `heroImage`: imagen grande de la pagina del tour.
- `cardImage`: imagen de tarjetas y destacados.
- `gallery`: imagenes de la galeria interna.

Carpetas recomendadas:

- `public/images/BOGOTA/TOURS/{TOUR}/HERO/`
- `public/images/BOGOTA/TOURS/{TOUR}/CARD/`
- `public/images/BOGOTA/TOURS/{TOUR}/GALERIA/`
- `public/images/MEDELLIN/TOURS/{TOUR}/HERO/`
- `public/images/MEDELLIN/TOURS/{TOUR}/CARD/`
- `public/images/MEDELLIN/TOURS/{TOUR}/GALERIA/`

## Servicios

Los servicios por ciudad viven en `serviceAssetsByCity` dentro de
`lib/data/catalog.ts`.

Campos:

- `hero`: imagen grande del servicio.
- `card`: imagen para tarjeta.
- `gallery`: galeria del servicio.

Carpetas recomendadas:

- `public/images/BOGOTA/SERVICIOS/{SERVICIO}/HERO/`
- `public/images/BOGOTA/SERVICIOS/{SERVICIO}/CARD/`
- `public/images/BOGOTA/SERVICIOS/{SERVICIO}/GALERIA/`
- `public/images/MEDELLIN/SERVICIOS/{SERVICIO}/HERO/`
- `public/images/MEDELLIN/SERVICIOS/{SERVICIO}/CARD/`
- `public/images/MEDELLIN/SERVICIOS/{SERVICIO}/GALERIA/`
