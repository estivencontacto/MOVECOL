param(
  [string]$ProjectRoot = "D:\DESCARGAS\MOVE COL"
)

$imageRoot = Join-Path $ProjectRoot "public\images\move"

$folders = @(
  "marca\logo",
  "marca\portafolio",
  "global\vehiculos\sedan-ejecutivo",
  "global\vehiculos\suv-premium",
  "global\vehiculos\van-privada",
  "global\vehiculos\bus-ejecutivo",
  "global\reservas\resumen",
  "global\reservas\pagos",
  "bogota\hero",
  "bogota\servicios\traslado-aeropuerto-el-dorado",
  "bogota\servicios\transporte-por-horas",
  "bogota\servicios\turismo-medico",
  "bogota\servicios\tours-privados",
  "bogota\servicios\transporte-corporativo",
  "bogota\tours\monserrate",
  "bogota\tours\city-tour-bogota",
  "bogota\tours\la-candelaria",
  "bogota\tours\plaza-de-bolivar",
  "bogota\tours\museo-del-oro",
  "bogota\tours\zona-t",
  "bogota\tours\laguna-de-guatavita",
  "bogota\tours\catedral-de-sal-zipaquira",
  "medellin\hero",
  "medellin\servicios\traslado-aeropuerto-jose-maria-cordova",
  "medellin\servicios\servicio-por-horas",
  "medellin\servicios\turismo-medico",
  "medellin\servicios\tours-privados",
  "medellin\servicios\transporte-corporativo",
  "medellin\tours\city-tour-medellin",
  "medellin\tours\comuna-13",
  "medellin\tours\guatape",
  "medellin\tours\vuelta-al-oriente-antioqueno",
  "medellin\tours\tour-de-miradores",
  "medellin\tours\hacienda-napoles",
  "medellin\tours\parapente",
  "medellin\tours\tour-de-compras",
  "medellin\tours\pablo-escobar-tour",
  "medellin\tours\coffee-tour",
  "medellin\tours\santa-fe-de-antioquia"
)

foreach ($folder in $folders) {
  New-Item -ItemType Directory -Force -Path (Join-Path $imageRoot $folder) | Out-Null
}

Write-Output "Estructura creada en $imageRoot"
