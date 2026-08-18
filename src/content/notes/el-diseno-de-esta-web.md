---
title: "El diseño de esta web: de dónde viene la inspiración"
description: "Por qué elegí degradados suaves, esquinas redondeadas y cristal esmerilado para frankuxui.dev, y qué referencias tuve en mente."
pubDate: 2026-08-18
icon: "🎨"
accentColor: "#145b5b"
tags: ["diseño", "astro", "frontend"]
---

Cada vez que empiezo un proyecto personal me hago la misma pregunta: ¿qué quiero que sienta alguien al entrar? Para frankuxui.dev la respuesta fue clara desde el principio: calma, calidez y un poco de movimiento orgánico. Nada de esquinas afiladas ni contrastes duros. Quería una web que se sintiera más como un espacio habitado que como un panel de control.

![Imagen del nuevo diseño de frankuxui.dev](/notes/imagen-del-nuevo-diseno-de-frankuxui-dev.webp)

## El fondo que respira

Lo primero que ves al cargar la página es un degradado animado detrás de todo el contenido, pintado en un `<canvas>` de baja resolución y suavizado con `blur`. No es un vídeo ni una imagen: son ondas senoidales calculadas cuadro a cuadro, muestreadas contra una paleta de colores pastel.

```css
.bg-gradient-canvas {
  image-rendering: auto;
  filter: blur(28px) saturate(1.05);
  transform: scale(1.08);
}
```

Esa técnica —baja resolución interna, blur generoso por fuera— es la misma que usan muchos sitios inspirados en el "mesh gradient" que popularizaron herramientas como Coolors o los fondos de macOS Sonoma. Me gustó tanto la idea que dejé varias paletas intercambiables (`Ocean Sunset`, `Mystic Evening`, `Warm Autumn Glow`...) para que la web pueda cambiar de humor sin cambiar de estructura.

## Cristal, no cajas

Casi ningún panel de la web usa un fondo sólido. En su lugar, todo flota sobre el degradado con `backdrop-blur` y una opacidad baja, más una línea de luz sutil en el borde superior:

```html
<div class="relative overflow-hidden rounded-4xl bg-background/40 backdrop-blur-2xl">
  <div aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
  <!-- contenido -->
</div>
```

Ese patrón —esquinas muy redondeadas (`rounded-3xl`/`rounded-4xl`), vidrio esmerilado y un highlight de un píxel arriba— se repite en casi todas las secciones: las tarjetas de principios, el carrusel de tecnologías, el menú móvil que sube desde abajo como una hoja de bottom sheet. La inspiración aquí viene de la ola de interfaces "glassmorphism" que se popularizó con visionOS y las últimas versiones de iOS: superficies que dejan pasar la luz del fondo en lugar de bloquearla.

## Tipografía y ritmo

Toda la web usa **Poppins**, una geométrica con formas muy redondas que combina bien con el resto del lenguaje visual. Los títulos grandes usan `clamp()` para escalar de forma fluida entre móvil y pantallas 4K sin necesidad de decenas de media queries, y casi todo entra en pantalla con una animación de aparición suave (`fade-up`, `fade-scale`) para que la primera impresión no sea un golpe seco de contenido.

## Notas, la sección más nueva

Esta misma nota que estás leyendo se abre como si fuera un modal: la URL cambia de verdad a `/notas/el-diseno-de-esta-web` —así que puedes compartir el enlace o recargar la página sin perder nada— pero visualmente la tarjeta sube desde abajo, como una hoja que se despliega sobre el resto del sitio. Está construido con las View Transitions nativas de Astro, sin ninguna librería extra: solo un par de animaciones CSS personalizadas y un `<ClientRouter />`.

Si algo quiero que se lleve quien navegue por aquí es esa sensación de coherencia: que cada componente nuevo, aunque resuelva un problema distinto, se sienta hecho por la misma persona, con las mismas reglas de siempre.
