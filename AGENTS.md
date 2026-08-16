# Guía de estilos y reglas CSS

Documento de referencia para mantener consistencia en los estilos del proyecto. Todas las decisiones de diseño y restricciones técnicas se documentan aquí.

## Contenedores

- **Ancho máximo**: `max-w-12xl` (2000px)
- **Padding horizontal**: `px-10` (2.5rem / 40px)
- Aplicar a: `.hero-inner`, grillas principales, secciones de contenido
- Ejemplo: `<div class="max-w-12xl px-10">`

---

## Tipografía

- Usar clases de tamaño de Tailwind o variables CSS (`--font-h1`, `--font-h2`, etc)
- Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- `--foreground`: color principal de texto
- `--foreground-muted`: color secundario/más claro
- Nunca hardcodear colores, usar variables

---

## Animaciones

- Usar clases `.anim-fade-up`, `.anim-fade-in`, `.anim-fade-scale`, `.anim-slide-left`, `.anim-slide-right`
- Controlar con variables CSS inline:
  - `--anim-delay`: tiempo de espera (ej: `0.1s`, `0.25s`)
  - `--anim-duration`: duración (default: `0.7s`)
  - `--anim-distance`: distancia de movimiento (default: `24px`)
  - `--anim-easing`: función de timing (default: `cubic-bezier(0.22, 1, 0.36, 1)`)
- Keyframes definidos en `global.css`, no en ficheros de componentes

---

## Viewport y unidades

- Usar `dvh` (dynamic viewport height) cuando sea relevante para altura de pantalla
- Fallback a `vh` para compatibilidad
- Usar `clamp()` para tamaños responsivos (ancho, alto, font-size)
- Ejemplo: `min-height: clamp(140px, 15dvh, 220px)`

---

## Estructura de ficheros

- **Estilos**: Solo en `global.css` (keyframes, animaciones complejas, utility classes)
- **Componentes Astro**: Máximo Tailwind + variables CSS inline
- **No** poner bloques `<style>` en componentes a menos que sea necesario para media queries complejas o keyframes

---

## Colores y gradientes

- Paleta base en `:root` de `global.css`
- Gradientes animados: usar `--gradient-1` a `--gradient-5` para body
- Otros gradientes (anillo de foto, etc): definidos con valores hexadecimales específicos
- Nunca duplicar estilos de color entre ficheros

---

## Grid y layout

- Usar Tailwind grid: `grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]`
- Flexbox para alineación: `flex items-center justify-center`
- Gaps: `gap-8` (móvil), `lg:gap-12` (desktop)
- Responsive first: estilos base para móvil, `sm:`, `lg:` para mayores

---

*Última actualización: 2026-08-16*
