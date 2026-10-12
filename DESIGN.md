---
name: Miguel Moreno · Portfolio
description: Portfolio de monteur vidéo présenté comme un générique de fin de film.
colors:
  noir: "#000000"
  blanc-pellicule: "#f2f0ea"
  gris-credit: "#a3a097"
  gris-fonce: "#2b2a27"
typography:
  display:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(3.25rem, 14vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(1.75rem, 6.5vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.1
  email:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(1.375rem, 6vw, 3rem)"
    fontWeight: 400
  body:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  credit:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    letterSpacing: "0.04em"
  section-title:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "0.32em"
  role:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.24em"
  label:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.18em"
rounded:
  none: "0px"
spacing:
  marge-mobile: "16px"
  marge-desktop: "40px"
  gouttiere-mobile: "20px"
  gouttiere-desktop: "32px"
  works-gap-mobile: "96px"
  works-gap-desktop: "144px"
components:
  text-action:
    backgroundColor: "transparent"
    textColor: "{colors.blanc-pellicule}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  topbar-link:
    backgroundColor: "{colors.noir}"
    textColor: "{colors.blanc-pellicule}"
    typography: "{typography.label}"
    padding: "8px 14px"
  topbar-link-hover:
    textColor: "{colors.gris-credit}"
  video-frame:
    backgroundColor: "{colors.gris-fonce}"
    rounded: "{rounded.none}"
---

# Design System: Miguel Moreno · Portfolio

## Overview

**Creative North Star: "Générique de fin"**

La página entera es el genérico final de una película: pantalla negra, texto centrado, y cada trabajo "acreditado" en dos columnas (rol a la derecha | nombre a la izquierda). Los vídeos son los protagonistas; la interfaz solo los presenta, como los créditos presentan a un equipo.

Es sobria y lenta: mucho espacio negro entre trabajos, dos tipografías (una serif de título de cine y una sans legible), sin color de acento, sin cajas ni bordes. El único gesto "teatral" es apagar las luces: cuando suena un vídeo, todo lo demás se oscurece.

**Key Characteristics:**
- Fondo negro puro, texto blanco cálido, gris para lo secundario. Cero acento.
- Todo centrado; los créditos se alinean a un eje central.
- Bodoni Moda para lo que se "factura" (nombre, títulos, software, email); Hanken Grotesk para todo lo demás.
- Acciones = texto subrayado en mayúsculas espaciadas, nunca botones con caja.
- Un solo momento de movimiento con autor: "lumières éteintes".

## Colors

Paleta de proyección: negro de sala, blanco de película, un gris de créditos. Nada más.

### Neutral
- **Noir de salle** (`noir`): fondo de toda la página y de dentro del reproductor (los bordes del vídeo se funden con la página).
- **Blanc pellicule** (`blanc-pellicule`): texto principal, títulos, valores de los créditos, anillo de foco, selección de texto (invertida).
- **Gris crédit** (`gris-credit`): texto secundario: subtítulo de rol, intro, descripciones, la columna "rol" de los créditos, pie de página, subrayado del email en reposo, hover del enlace Contact. Contraste aprox. 8:1 sobre negro.
- **Gris foncé** (`gris-fonce`): solo superficies que no son texto: fondo del marco mientras carga el vídeo, barra de scroll, subrayado de las acciones en reposo. Nunca para texto.

### Named Rules
**The No-Accent Rule.** No hay color de acento. El único color de la página lo ponen los vídeos. Si algo necesita destacar, se hace con tamaño, Bodoni o blanco frente a gris, nunca con un color nuevo.

**The Two-Greys Rule.** `gris-credit` es para texto; `gris-fonce` es para fondos y líneas. No intercambiarlos.

## Typography

**Display Font:** Bodoni Moda (con Didot, Bodoni 72, Georgia)
**Body Font:** Hanken Grotesk (con Helvetica Neue, Arial)

**Character:** Bodoni es la voz del cartel de cine; Hanken es la voz de la ficha técnica. Una factura, la otra informa.

### Hierarchy
- **Display** (Bodoni 500, `clamp(3.25rem, 14vw, 6rem)`, 0.95): solo el nombre "Miguel *Moreno*"; el apellido en cursiva 400.
- **Headline** (Bodoni cursiva 400, `clamp(1.75rem, 6.5vw, 2.75rem)`, 1.1): título de cada trabajo, debajo del vídeo.
- **Email** (Bodoni cursiva 400, `clamp(1.375rem, 6vw, 3rem)`): la dirección en Contact, el "último cartón".
- **Créditos grandes** (Bodoni 1.35em, 1.2): los nombres de software en "Logiciels".
- **Body** (Hanken 400, 17px, 1.6, cifras tabulares): intro (máx. 34ch), descripción de trabajo (máx. 40ch), texto de contacto (máx. 30ch). En gris.
- **Credit** (Hanken 400, 15px, tracking 0.04em): filas rol | valor de cada trabajo.
- **Section title** (Hanken 500, 15px, tracking 0.32em, MAYÚSCULAS, blanco): "Travaux", "Logiciels", "Contact", como "Distribution" en un genérico.
- **Role** (Hanken 500, 14px, tracking 0.24em, MAYÚSCULAS, gris): la línea "Monteur vidéo · Post-production" bajo el nombre.
- **Label** (Hanken 500, 13px, tracking 0.18em, MAYÚSCULAS): acciones (Contact, Copier l'adresse, LinkedIn).

### Named Rules
**The Billing Rule.** Bodoni solo para lo que se factura: el nombre, los títulos de trabajos, los programas, el email. Párrafos, roles y botones siempre en Hanken.

**The Italic-Is-A-Title Rule.** La cursiva Bodoni marca títulos de obra, el apellido y el email. No usar cursiva para énfasis en párrafos (para eso: `strong` en blanco, peso 500).

## Layout

- **Eje central.** `body` está centrado (`text-align: center`). Cada bloque se apila en columna y se centra.
- **Márgenes laterales:** 16px en móvil, 40px a partir de 768px (`48rem`). Es el único breakpoint.
- **Ritmo vertical:** 96px entre trabajos en móvil, 144px en escritorio. La apertura ocupa 72svh para que el primer vídeo ya asome abajo. Contact ocupa al menos 80svh.
- **Créditos en dos columnas:** rejilla `1fr 1fr`, rol a la derecha en gris, valor a la izquierda en blanco, separación 20px (móvil) / 32px (escritorio). Ancho máximo 34rem. Fila extra 0.35rem; en "Logiciels" 1rem.
- **Marco del vídeo:** siempre con la proporción real (`aspect-ratio: var(--ratio)`), así la página no salta al cargar. `object-fit: contain`, nunca recortar.

### Tamaño de los vídeos según formato
El script lee `formato` en `videos.json` (ej. `"9:16"`) y decide la orientación: ratio < 0.9 vertical, > 1.1 horizontal, si no cuadrado.
- **Vertical** (9:16, 2:3…): alto máximo 80% de la pantalla; ancho = `80svh × ratio`, nunca más que el 100% del ancho.
- **Horizontal con sonido** (16:9…): hasta 70rem de ancho, y alto máximo 80% de la pantalla.
- **Horizontal en bucle** (logos, títulos): más pequeño, hasta 44rem y 70% del alto. Los bucles nunca deben verse más grandes que los vídeos con sonido.
- **Cuadrado:** hasta 40rem y 72% del alto.
- Debajo del vídeo, siempre: título (Bodoni cursiva) → descripción (gris) → créditos "Type | Format" (+ "Boucle | Mettre en pause" si es bucle).
- **En ordenador (≥ 64rem / 1024px), los verticales pasan a dos columnas** alrededor del eje central: el vídeo a un lado y su texto al otro, alternando (impar: vídeo a la izquierda; par: vídeo a la derecha, texto alineado a la derecha). Los horizontales siguen centrados con el texto debajo. En móvil todo queda en una sola columna centrada.

## Elevation & Depth

Plana. No hay sombras, ni capas, ni desenfoques de fondo. La profundidad se crea con luz: lo activo está a opacidad 1, lo que no importa baja a 0.12 (ver "Lumières éteintes").

### Named Rules
**The Dark-Room Rule.** La profundidad es luz, no sombra. Nunca añadir `box-shadow`.

## Shapes

Esquinas rectas en todo (0px). Sin bordes ni contornos de caja. La única línea es el subrayado del texto (1px). El anillo de foco de teclado es la única excepción: 2px blanco, separación 4px, radio 2px.

## Components

### Acciones de texto (Copier l'adresse, LinkedIn, pausa de bucle)
Como una línea más del genérico, no como un botón.
- **Forma:** sin fondo, sin borde, sin radio. Alto mínimo 44px (zona táctil), padding lateral 12px.
- **Texto:** label (13px, 500, tracking 0.18em, mayúsculas), blanco, subrayado 1px en `gris-fonce` separado 0.5em.
- **Hover (solo ratón):** el subrayado pasa a blanco en 200ms.
- **Pulsar:** `scale(0.97)` en 160ms con `--ease-out`.
- **Variante en créditos (pausa de bucle):** mismo componente, pero sin mayúsculas, tracking 0.04em, tamaño heredado; margen vertical negativo para mantener 44px sin separar la fila.
- **Cambio de texto ("Adresse copiée"):** desenfoque 2px y opacidad 0.4 durante 120ms al cambiar la palabra.

### Enlace fijo "Contact" (arriba a la derecha)
- Label en mayúsculas, fondo negro para tapar lo que pasa por detrás, sin subrayado.
- Hover: texto a gris. Se oculta (opacidad 0, 600ms) cuando la sección Contact está visible.

### Email
- Bodoni cursiva grande, subrayado gris que pasa a blanco al hover. Se puede partir en cualquier punto en pantallas estrechas.

### Ficha de trabajo (signature)
Vídeo a tamaño real → título en cursiva → descripción → créditos rol | valor. Los vídeos **con sonido** (`"modo": "sonido"`) llevan controles y no se reproducen solos. Los **bucles** (`"modo": "bucle"`) se reproducen solos, en silencio, solo mientras se ven, y siempre llevan la fila "Boucle | Mettre en pause".

### Créditos
Lista `dl` en rejilla de dos columnas: `dt` (rol, gris, a la derecha) y `dd` (valor, blanco, a la izquierda). Variante grande para "Logiciels": valor en Bodoni.

### Movimiento
- **Curvas:** `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para entradas y cambios; `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` reservada.
- **Lumières éteintes (el único momento con autor):** cuando un vídeo con sonido se reproduce, todo lo demás (otros trabajos, apertura, títulos, Logiciels, Contact, enlace fijo) baja a opacidad 0.12 en 700ms. Solo un vídeo con sonido a la vez: al dar play a uno, los demás se pausan. Si sale de pantalla, se pausa.
- **Aparición de créditos:** solo el bloque de texto de cada trabajo entra con opacidad + `translateY(10px)` + desenfoque 3px, 700ms, una sola vez. El contenido es visible si JavaScript no se ejecuta.
- **Reducir movimiento:** con `prefers-reduced-motion`, todas las transiciones son instantáneas, los textos aparecen ya visibles y los bucles no se reproducen solos (muestran controles).

## Do's and Don'ts

### Do:
- **Do** añadir un vídeo solo editando `videos.json` (`archivo`, `miniatura`, `titulo`, `tipo`, `descripcion`, `formato` tipo `"9:16"`, `modo` `"sonido"` o `"bucle"`); el diseño se adapta solo.
- **Do** dar siempre un póster (`miniatura`) y el `formato` real del vídeo, para que el marco reserve el espacio correcto.
- **Do** escribir cualquier dato nuevo como una fila de créditos rol | valor.
- **Do** usar Bodoni solo para nombres, títulos, programas y el email; Hanken para todo lo demás.
- **Do** mantener 44px de zona táctil en cualquier acción nueva.
- **Do** usar solo `--ease-out` / `--ease-in-out` y respetar `prefers-reduced-motion`.

### Don't:
- **Don't** añadir un color de acento, degradados ni colores nuevos.
- **Don't** meter tarjetas, cajas, bordes, sombras ni esquinas redondeadas.
- **Don't** convertir las acciones en botones con fondo: son texto subrayado.
- **Don't** hacer una cuadrícula de miniaturas; los trabajos van uno tras otro, a tamaño real.
- **Don't** recortar vídeos (`object-fit: cover`) ni forzar una proporción distinta de la real.
- **Don't** añadir más animaciones de entrada: solo los créditos de cada trabajo aparecen con suavidad; nada más se anima al hacer scroll.
- **Don't** poner etiquetas pequeñas en mayúsculas encima de los títulos; las mayúsculas espaciadas son solo para títulos de sección, la línea de rol y las acciones.
