param(
  [string]$ProjectRoot = "D:\DESCARGAS\MOVE COL"
)

$imageRoot = Join-Path $ProjectRoot "public\images"

$items = @{
  "BOGOTA\SERVICIOS" = @(
    "AEROPUERTO EL DORADO",
    "TRANSPORTE POR HORAS",
    "TURISMO MEDICO",
    "TOURS PRIVADOS",
    "TRANSPORTE CORPORATIVO"
  )
  "BOGOTA\TOURS" = @(
    "MONSERRATE",
    "CITY TOUR BOGOTA",
    "LA CANDELARIA",
    "PLAZA DE BOLIVAR",
    "MUSEO DEL ORO",
    "ZONA T",
    "LAGUNA DE GUATAVITA",
    "CATEDRAL DE SAL ZIPAQUIRA"
  )
  "MEDELLIN\SERVICIOS" = @(
    "AEROPUERTO JOSE MARIA CORDOVA",
    "SERVICIO POR HORAS",
    "TURISMO MEDICO",
    "TOURS PRIVADOS",
    "TRANSPORTE CORPORATIVO"
  )
  "MEDELLIN\TOURS" = @(
    "CITY TOUR MEDELLIN",
    "COMUNA 13",
    "GUATAPE",
    "VUELTA AL ORIENTE ANTIOQUENO",
    "TOUR DE MIRADORES",
    "HACIENDA NAPOLES",
    "PARAPENTE",
    "TOUR DE COMPRAS",
    "PABLO ESCOBAR",
    "COFFEE TOUR",
    "SANTA FE DE ANTIOQUIA"
  )
}

$baseFolders = @(
  "MARCA\LOGO",
  "MARCA\PORTAFOLIO",
  "GLOBAL\VEHICULOS\SEDAN EJECUTIVO",
  "GLOBAL\VEHICULOS\SUV PREMIUM",
  "GLOBAL\VEHICULOS\VAN PRIVADA",
  "GLOBAL\VEHICULOS\BUS EJECUTIVO",
  "GLOBAL\RESERVAS\RESUMEN",
  "GLOBAL\RESERVAS\PAGOS",
  "BOGOTA\HERO",
  "MEDELLIN\HERO"
)

foreach ($folder in $baseFolders) {
  New-Item -ItemType Directory -Force -Path (Join-Path $imageRoot $folder) | Out-Null
}

foreach ($group in $items.Keys) {
  foreach ($name in $items[$group]) {
    $base = Join-Path $imageRoot (Join-Path $group $name)
    New-Item -ItemType Directory -Force -Path (Join-Path $base "HERO") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $base "CARD") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $base "GALERIA") | Out-Null
  }
}

Write-Output "Estructura creada en $imageRoot"
