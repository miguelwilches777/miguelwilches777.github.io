<#
  comprimir.ps1 : prepara un vídeo para la web.

  Crea dos archivos en media/ :
    - <Nombre>.mp4  vídeo comprimido (H.264, lado largo máx. 1280 px)
    - <Nombre>.jpg  miniatura (póster) que se ve antes de reproducir

  El vídeo original no se modifica nunca.

  Ejemplos:
    .\comprimir.ps1 -Entrada "videos\mi video.mp4" -Nombre mi-video
    .\comprimir.ps1 -Entrada "videos\logo.mp4" -Nombre logo -Bucle
    .\comprimir.ps1 -Entrada "videos\logo.mp4" -Nombre logo -Bucle -Miniatura 3.5
#>
param(
  [Parameter(Mandatory = $true)][string]$Entrada,   # vídeo original
  [Parameter(Mandatory = $true)][string]$Nombre,    # nombre de salida, sin espacios (ej: pub-origine)
  [switch]$Bucle,                                  # vídeo en bucle: se quita el sonido
  [double]$Miniatura = -1,                         # segundo de la miniatura (por defecto, a 1/3 del vídeo)
  [string]$Filtro = ""                             # filtro ffmpeg extra opcional (recorte, croma...)
)

$ErrorActionPreference = "Stop"

# 1. Encontrar ffmpeg (en el PATH o en la carpeta donde lo instala winget)
function Find-Tool($name) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $found = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "$name.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found) { return $found.FullName }
  throw "No encuentro $name. Instálalo con: winget install Gyan.FFmpeg"
}
$ffmpeg  = Find-Tool "ffmpeg"
$ffprobe = Find-Tool "ffprobe"

if (-not (Test-Path $Entrada)) { throw "No existe el archivo: $Entrada" }
New-Item -ItemType Directory -Force "media" | Out-Null
$salida = "media\$Nombre.mp4"
$poster = "media\$Nombre.jpg"

# 2. Escalar: el lado largo a 1280 px como máximo (sin agrandar vídeos pequeños)
$escala = "scale='if(gte(iw,ih),min(1280,iw),-2)':'if(gte(iw,ih),-2,min(1280,ih))'"
$vf = if ($Filtro) { "$Filtro,$escala" } else { $escala }

# 3. Comprimir
$opciones = @("-v", "error", "-stats", "-y", "-i", $Entrada, "-vf", "$vf,format=yuv420p",
          "-c:v", "libx264", "-preset", "slow", "-profile:v", "high",
          "-movflags", "+faststart")
if ($Bucle) {
  $opciones += @("-crf", "26", "-an")            # sin sonido
} else {
  $opciones += @("-crf", "24", "-c:a", "aac", "-b:a", "128k")
}
$opciones += $salida
Write-Host "Comprimiendo $Entrada ..."
& $ffmpeg @opciones
if ($LASTEXITCODE -ne 0) { throw "ffmpeg ha fallado" }

# 4. Miniatura
if ($Miniatura -lt 0) {
  $duracion = [double](& $ffprobe -v error -show_entries format=duration -of csv=p=0 $salida)
  $Miniatura = [math]::Round($duracion / 3, 2)
}
& $ffmpeg -v error -y -ss $Miniatura -i $salida -frames:v 1 -q:v 4 $poster
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear la miniatura" }

# 5. Comprobar el tamaño (GitHub no acepta archivos de más de 100 MB)
$mb = [math]::Round((Get-Item $salida).Length / 1MB, 1)
$antes = [math]::Round((Get-Item $Entrada).Length / 1MB, 1)
Write-Host "Listo: $salida ($antes MB -> $mb MB) y $poster"
if ($mb -ge 100) { Write-Warning "El vídeo pesa más de 100 MB: súbele el -crf o recórtalo." }
