# AGENTS.md — frankuxui.dev (Astro)

Guía rápida para agentes que trabajen en este proyecto.

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 4312) |
| `npm run build` | Build de producción (`astro build`) |
| `npm run preview` / `npm run start` | Sirve el build de producción |
| `npm run test` / `npm run test:ui` | Tests con Playwright |

No hay script de `typecheck` ni `lint` definido en `package.json`.

## Stack

- **Astro 7** (`output: "server"`, adapter `@astrojs/node`, modo standalone).
- Integraciones: `@astrojs/mdx`, `@astrojs/react`, `@astrojs/rss`, `@astrojs/sitemap`, `@astrojs/vercel`, `@astrojs/partytown`.
- **Tailwind CSS v4** vía `@tailwindcss/vite`. No existe `tailwind.config.js`: la configuración vive en `src/styles/global.css` mediante `@theme` y bloques `:root`.
- Envío de correo con `resend` + `@react-email/components` (usado en `/contacto`).
- Alias de importación: `@/*` → `./src/*`.

## Arquitectura

- `src/pages/` — rutas de Astro. Páginas estáticas actuales: `index.astro` (home), `sobre-mi.astro`, `contacto.astro`, legales (`politica-de-cookies`, `politica-de-privacidad`, `terminos-y-condiciones`), `robots.txt.ts`.
- `src/features/<feature>/sections/*.astro` — secciones de página autocontenidas (frontmatter con datos locales + template), importadas y compuestas por la página correspondiente. Seguir este patrón al añadir nuevas secciones (ver `features/home/sections` y `features/about/sections`).
- `src/layouts/Root.astro` — layout raíz (Header, Footer, CookieConsent, MenuMobile, PaletteModal). Todas las páginas se envuelven en `<Root>`.
- `src/components/` — componentes compartidos (Header, MenuMobile, Logo, PaletteModal, SendMail, etc.).
- `src/views/Footer.astro` — footer del sitio; el mapa del sitio del footer debe reflejar únicamente las rutas que existen en `src/pages/`.
- `src/config/index.ts` — `siteConfig` y constantes SEO/negocio (nombre, contacto, redes, SEO por defecto).
- `src/data/social.ts` — listado de redes sociales con iconos SVG inline, usado en `/contacto`.

## Sistema visual (identidad de frankuxui.dev)

- Estilo "neobrutalista": bordes de 2px (`border-2 border-foreground`), sombra dura (`shadow-[4px_4px_0px_var(--color-foreground)]`) en botones y chips, tipografía monoespaciada en todo el sitio (`--font-mono` en `body`).
- Paneles de color sólido (`bg-foreground`, `bg-primary`, `bg-secondary`, `bg-tertiary` con `text-background`) para bloques destacados de kicker + título, alternando con contenido en `bg-background`.
- Animaciones de entrada de texto vía atributo `style` con variables `--hero-text-reveal-*` (clase `motion-safe:animate-text-reveal`) o `--animate-reveal-*` (clase `animate-reveal`), definidas en `src/styles/global.css` y `@theme`.

### Paleta de colores (selector existente)

Hay **dos fuentes de verdad que deben mantenerse sincronizadas manualmente**:

1. `src/styles/global.css` — bloques `:root, html[data-palette="<id>"] { --color-background; --color-foregound (sic); --color-primary; --color-secondary; --color-tertiary; }`.
2. `src/components/PaletteModal.astro` — array `palettes` (id, name, colors) que renderiza las tarjetas del selector.

Paletas actuales: `refreshing-summer-fun`, `sunny-beach-day`, `mystic-evening`, `ocean-sunset` (por defecto), `asteroid-impact`, `neutral-earthtones`, `sunset-beach-escape`. El switcher guarda la elección en `localStorage` (`frankuxui-palette`) y en `document.documentElement.dataset.palette`. Cualquier sección nueva debe usar las variables semánticas (`bg-background`, `text-foreground`, `bg-primary`, `bg-secondary`, `bg-tertiary`, `border-border`), nunca colores hardcodeados, para heredar automáticamente la paleta activa.

## Migración de contenido desde frankuxui-v3.com (Next.js)

El proyecto Next.js en `../frankuxui-v3.com` es una versión previa del sitio (Next.js + React) y se trata como **fuente de solo lectura**: nunca debe modificarse, moverse ni borrarse.

Estado de la migración de contenido estático (2026-07-07):

- **Home**: se añadió `features/home/sections/HomeCtaSection.astro` con el CTA final ("¿Construimos algo útil?" → "Hablemos"), que faltaba respecto a la versión Next.js. Hero/About/Expertise ya eran equivalentes.
- **Sobre mí** (`pages/sobre-mi.astro`): reconstruida por completo a partir del contenido real de `frankuxui-v3.com/src/features/about/*` (antes tenía un placeholder "Agregando skills..."). Nuevas secciones en `features/about/sections/`: `AboutHeroSection`, `AboutProfileSection`, `AboutStackSection`, `AboutNextjsSection`, `AboutKnowledgeSection`, `AboutBrandSection`. La sección "Socials" de Next.js no se duplicó porque su contenido (título, texto y grid de redes sociales) ya existe tal cual en `pages/contacto.astro`.
- **Misión, Blog y Proyectos**: eliminados de este proyecto por decisión explícita del propietario (junto con toda instancia de Strapi CMS). Se borraron páginas (`pages/mision/`, `pages/blog/`, `pages/proyectos/`, `pages/articulos/`, `pages/rss.xml.js`, `pages/api/projects.ts`), componentes (`MissionCard`, `components/post/*`, `components/project/*`, `components/fallbacks/*`, `PostTag`, `WidgetAboutMe`, `SyntaxHighlight`), layouts (`Post.astro`, `PostLayout.astro`, `Project.astro`), `services/strapiClientService.ts`, tipos `Strapi*.d.ts`/`Post.d.ts`/`Project.d.ts`, utilidades (`getPosts.ts`, `getProjects.ts`, `markdownParser.ts`), `content/blog/`, `content/projects/`, `content.config.ts`, `data/projects.json`, y la dependencia `@strapi/client` de `package.json`. Los enlaces de navegación correspondientes se quitaron de `Header.astro`, `MenuMobile.astro` y `views/Footer.astro`.
- Si en el futuro se retoman blog/proyectos/misión, deberán reconstruirse desde cero (contenido, colecciones y navegación), no quedan restos funcionales de esas rutas.
- No se implementó lógica de formularios nueva ni se tocó el formulario de contacto existente (`SendMail.tsx`, `pages/api/send-mail.ts`).

## Convenciones a respetar

- Nuevas secciones estáticas van en `src/features/<feature>/sections/*.astro`, con datos locales en el frontmatter (sin CMS ni props externas), siguiendo el mismo estilo que las secciones existentes.
- No enlazar a rutas que no existen (verificar `src/pages/` antes de añadir un `href`).
- No reintroducir Strapi ni CMS externos sin instrucción explícita.
