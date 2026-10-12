# Portfolio de Miguel Moreno

Web: **https://miguelwilches777.github.io**

Hecha con **HTML, CSS y JavaScript simples** (sin frameworks) y publicada con **GitHub Pages**.

## Las carpetas

```
portafolio/
├── videos/           → TUS ORIGINALES. Se quedan en tu PC, no se publican.
├── media/            → vídeos comprimidos + miniaturas. ESTO es lo que se ve en la web.
├── videos.json       → LA LISTA de vídeos de la web (título, texto, orden...).
├── comprimir.ps1     → script que convierte un original en un vídeo para la web.
├── index.html        → los textos fijos (presentación, logiciels, contact).
├── css/style.css     → el diseño.
└── js/main.js        → el código que lee videos.json y monta los vídeos.
```

**Regla de oro:** para tocar los vídeos solo necesitas `videos/`, `comprimir.ps1` y `videos.json`.

---

## A. Añadir un vídeo nuevo

### Paso 1. Copia el original en `videos/`

Exporta tu vídeo como siempre (Premiere, After, DaVinci) y copia el archivo en la carpeta `videos/`.

### Paso 2. Comprímelo

1. Abre la carpeta del proyecto en el Explorador de Windows.
2. Haz clic en la barra de dirección, escribe `powershell` y pulsa Enter. Se abre una ventana azul ya en la carpeta correcta.
3. Escribe esto, cambiando el nombre del archivo:

```powershell
.\comprimir.ps1 -Entrada "videos\mi clip.mp4" -Nombre mi-clip
```

- `-Entrada`: el archivo original, entre comillas.
- `-Nombre`: cómo se llamará en la web. **Sin espacios ni acentos** (ej. `clip-rap`, `pub-nike-2026`).

Cuando termine verás algo como `Listo: media\mi-clip.mp4 (85 MB -> 9 MB) y media\mi-clip.jpg`.
Se han creado 2 archivos en `media/`: el vídeo comprimido y su **miniatura** (la imagen que se ve antes de darle a play).

Opciones extra:
- Si es una **animación corta sin sonido** (logo, título) que debe repetirse sola, añade `-Bucle`:
  `.\comprimir.ps1 -Entrada "videos\logo.mp4" -Nombre logo -Bucle`
- Si la miniatura no te gusta, elige el segundo exacto con `-Miniatura`:
  `.\comprimir.ps1 -Entrada "videos\mi clip.mp4" -Nombre mi-clip -Miniatura 4.5`
  (vuelve a ejecutarlo: sobrescribe los archivos anteriores).

> Si sale un error rojo diciendo que no se pueden ejecutar scripts, escribe esto **una sola vez** y repite:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### Paso 3. Añádelo a `videos.json`

Abre `videos.json` con el Bloc de notas o VS Code. Verás una lista de "fichas", una por vídeo, así:

```json
  {
    "archivo": "media/mi-clip.mp4",
    "miniatura": "media/mi-clip.jpg",
    "titulo": "Nom du projet",
    "tipo": "Clip musical",
    "descripcion": "Une phrase qui explique le projet.",
    "formato": "16:9",
    "modo": "sonido"
  },
```

1. Copia una ficha entera, desde `{` hasta `},`.
2. Pégala donde quieras que aparezca. **El orden del archivo es el orden en la web:** arriba del todo = primer vídeo.
3. Cambia los datos:

| Campo | Qué poner |
|---|---|
| `archivo` | `media/` + el `-Nombre` que usaste + `.mp4` |
| `miniatura` | `media/` + el `-Nombre` que usaste + `.jpg` |
| `titulo` | el título, en francés |
| `tipo` | qué es: `Publicité`, `Clip musical`, `Animation de logo`, `Réseaux sociaux`… |
| `descripcion` | una frase en francés |
| `formato` | `9:16` vertical (TikTok, Reels) · `16:9` horizontal (YouTube) · `1:1` cuadrado · `4:5` Instagram |
| `modo` | `"sonido"` = con reproductor y sonido · `"bucle"` = se reproduce solo, sin sonido, en bucle |
| `transparente` | *(opcional)* pon `"transparente": true` si el vídeo tiene **fondo negro** (por ejemplo un logo incrustado): el negro desaparece y el vídeo flota sobre la página. Si no lo necesitas, no lo pongas. |

⚠️ **Las comas:** entre una ficha y la siguiente va una coma `},`. La **última** ficha de la lista termina en `}` **sin coma**. Las comillas `"` son obligatorias. Si algo de esto falla, la web muestra «Les vidéos n’ont pas pu être chargées». En ese caso revisa las comas.

### Paso 4. Míralo en tu ordenador antes de publicar

En la ventana de PowerShell:

```powershell
npx http-server -p 8080
```

Abre **http://localhost:8080** en el navegador. Para pararlo, pulsa `Ctrl + C`.
(Abrir `index.html` con doble clic **no** funciona: los vídeos no cargan sin este pequeño servidor.)

### Paso 5. Publícalo

```powershell
git add .
git commit -m "Añade vídeo mi-clip"
git push
```

En 1–2 minutos aparece en https://miguelwilches777.github.io (si no lo ves, recarga con `Ctrl + F5`).

---

## B. Cambiar un vídeo que ya está

| Quiero… | Qué hago |
|---|---|
| **Cambiar un texto** (título, descripción, tipo) | Edita esa ficha en `videos.json` → pasos 4 y 5 |
| **Cambiar el orden** | En `videos.json`, corta la ficha entera y pégala en otro sitio (¡cuidado con las comas!) → pasos 4 y 5 |
| **Poner una versión nueva del vídeo** | Copia el nuevo original en `videos/` y comprímelo con **el mismo `-Nombre`** que el antiguo: se sobrescribe. `videos.json` no cambia → pasos 4 y 5 |
| **Cambiar solo la miniatura** | Repite el paso 2 con `-Miniatura` y el segundo que quieras → pasos 4 y 5 |
| **Quitar un vídeo** | Borra su ficha de `videos.json` (y si quieres, sus dos archivos de `media/`) → pasos 4 y 5 |

## C. Cambiar los textos fijos

La presentación, la lista de logiciels y el contacto están en `index.html`. Busca el texto con `Ctrl + F` y cámbialo con cuidado de no borrar las etiquetas `<...>`. Luego, pasos 4 y 5.

---

## Cómo funciona (para aprender)

- **index.html**: las secciones. La lista de vídeos (`<div id="liste-travaux">`) está vacía: la rellena JavaScript.
- **js/main.js**:
  1. `fetch("videos.json")` lee la lista y `creerFiche()` crea el HTML de cada vídeo.
  2. Solo suena un vídeo a la vez; mientras suena, la página se oscurece (`lights-down`).
  3. Los vídeos en bucle solo se reproducen cuando se ven en pantalla (`IntersectionObserver`), para ahorrar batería y datos.
- **css/style.css**: los colores y tamaños están en variables al principio (`:root`). Cambia `--blanc` o `--gris` y cambia toda la web.
- Las animaciones respetan la opción del móvil "reducir movimiento" (`prefers-reduced-motion`).
