# Portfolio de Miguel Moreno

Web de portafolio de montador de vídeo, hecha con **HTML, CSS y JavaScript simples** (sin frameworks) y publicada con **GitHub Pages**.

## Estructura del proyecto

```
portafolio/
├── index.html        → estructura de la página (textos, secciones)
├── css/style.css     → todo el diseño (colores, tipografía, animaciones)
├── js/main.js        → lee videos.json y crea las fichas de los vídeos
├── videos.json       → LA LISTA DE VÍDEOS (lo que editarás normalmente)
├── media/            → vídeos comprimidos + miniaturas (esto sí se publica)
├── videos/           → tus originales (NO se publican, ver .gitignore)
└── comprimir.ps1     → script para comprimir un vídeo y crear su miniatura
```

## Cómo añadir un vídeo nuevo (3 pasos)

### 1. Mete el original en `videos/`

Copia tu archivo exportado (por ejemplo `mi clip.mp4`) en la carpeta `videos/`.
Esa carpeta no se sube a GitHub: los originales pesan demasiado (GitHub rechaza archivos de más de 100 MB).

### 2. Comprímelo

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
.\comprimir.ps1 -Entrada "videos\mi clip.mp4" -Nombre mi-clip
```

Esto crea dos archivos en `media/`:
- `mi-clip.mp4`: el vídeo comprimido para web (H.264, lado largo de 1280 px como máximo, con arranque rápido)
- `mi-clip.jpg`: la miniatura que se ve antes de darle a play

Opciones útiles:
- `-Bucle`: para animaciones cortas (logos, títulos). Quita el sonido.
- `-Miniatura 4.5`: elige el segundo exacto de la miniatura (por defecto, un tercio del vídeo).

Usa un `-Nombre` sin espacios ni acentos (ej. `pub-nike`, `clip-rap-2026`).

> Si PowerShell dice que no puede ejecutar scripts, ejecuta una vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### 3. Añádelo a `videos.json`

Abre `videos.json` y copia una entrada existente. Pégala donde quieras que aparezca (el orden del archivo es el orden en la web) y cambia los datos:

```json
{
  "archivo": "media/mi-clip.mp4",
  "miniatura": "media/mi-clip.jpg",
  "titulo": "Nombre del proyecto",
  "tipo": "Clip musical",
  "descripcion": "Una frase que explique el proyecto.",
  "software": ["Premiere Pro", "After Effects"],
  "formato": "16:9",
  "modo": "sonido"
}
```

| Campo | Qué poner |
|---|---|
| `archivo` | ruta del vídeo comprimido en `media/` |
| `miniatura` | ruta de la miniatura en `media/` |
| `titulo` | título que se ve en grande |
| `tipo` | tipo de trabajo (Publicité, Clip, Animation de logo…) |
| `descripcion` | una frase en francés |
| `software` | lista de programas usados |
| `formato` | proporción ancho:alto: `9:16` vertical, `16:9` horizontal, `1:1` cuadrado (o el tamaño real, ej. `1280:910`) |
| `modo` | `"sonido"` = reproductor con sonido · `"bucle"` = se reproduce solo, sin sonido, en bucle |

⚠️ Cuidado con las comas: cada entrada `{ ... }` va separada por una coma, pero la última no lleva coma detrás.

## Ver la web en tu ordenador

`videos.json` se carga con JavaScript, así que abrir `index.html` con doble clic no funciona: hace falta un pequeño servidor local.

```powershell
npx http-server -p 8080
```

Luego abre http://localhost:8080 en el navegador.

## Publicar los cambios

```powershell
git add .
git commit -m "Añade vídeo mi-clip"
git push
```

GitHub Pages actualiza la web en uno o dos minutos.

## Cómo funciona (para aprender)

- **index.html**: las secciones (présentation, travaux, logiciels, contact). La lista de vídeos está vacía: la rellena JavaScript.
- **js/main.js**:
  1. `fetch("videos.json")` lee la lista y `creerFiche()` crea el HTML de cada vídeo.
  2. Solo un vídeo con sonido suena a la vez; mientras suena, la página se oscurece (`lights-down`).
  3. Los vídeos en bucle solo se reproducen cuando son visibles (`IntersectionObserver`), para ahorrar batería y datos.
- **css/style.css**: los colores y tamaños están en variables al principio (`:root`). Cambia `--blanc` o `--gris` y cambia toda la web.
- Las animaciones respetan la opción del móvil "reducir movimiento" (`prefers-reduced-motion`).
