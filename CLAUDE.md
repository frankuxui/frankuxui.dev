# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Astro dev server on port 4312
- `npm run build` — production build
- `npm run preview` / `npm start` — preview the production build on port 4312
- `npm run astro <cmd>` — passthrough to the Astro CLI (e.g. `npm run astro check` for type checking)
- `npm test` — run Playwright tests (`tests/*.spec.ts`)
- `npx playwright test tests/index.spec.ts` — run a single test file
- `npm run test:ui` — Playwright UI mode

There is no lint script. Prettier and `prettier-plugin-astro` are devDependencies for formatting only.

## Architecture

This is an Astro 7 site with `output: "server"` using the `@astrojs/node` standalone adapter — it's server-rendered, not static. It runs behind Traefik with TLS terminated upstream, which is why `security.checkOrigin` is disabled in `astro.config.ts` (the adapter doesn't honor `X-Forwarded-Proto`, so it would otherwise see `http://` and trip the CSRF check against the browser's `https://` Origin).

Path aliases `@/*` and `~/*` both resolve to `src/*` (see `tsconfig.json`).

### Feature-folder pattern

Route files in `src/pages/` are thin; page-specific UI lives in `src/features/<name>/` (with a `sections/` subfolder for page sections), imported into the route. Shared UI lives in `src/components/`.

### Content collections

`src/content.config.ts` defines a `notes` collection: a glob loader over `src/content/notes/**/*.md` with a zod schema (`title`, `description`, `pubDate`, `updatedDate?`, `icon`, `accentColor`, `tags`, `draft`). This powers `src/pages/notas/` (list, `[slug]`, `tag/[tag]`) and `src/layouts/NoteLayout.astro`.

### Server actions

`src/actions/index.ts` aggregates per-domain action modules — currently `src/forms/<domain>/`. Each domain follows a client/server split:
- `schema.ts` — zod schema and types only, safe to import from client-side form code
- `index.ts` — the `defineAction` handler, which uses `astro:env/server` secrets (`getSecret`) and must only be imported server-side (see `src/forms/contact/index.ts` for the pattern and its enforcing comment)

Server secrets are declared via `env.schema` in `astro.config.ts` (`N8N_CONTACT_WEBHOOK_URL`, `N8N_FEEDBACK_WEBHOOK_URL`) and forward form submissions to n8n webhooks.

### Root layout and theming

`src/layouts/Root.astro` is the single shared page shell. Notable pieces:
- `ClientRouter` (Astro view transitions)
- An inline pre-hydration `<script>` in `<head>` that restores the saved color palette from `localStorage` before paint, to avoid a flash of the default palette
- A canvas (`#bg-gradient`) that renders an animated plasma-style background gradient, sampled from the active palette's colors (`src/lib/palettes.ts`); it re-initializes on `astro:page-load` and on a custom `frankuxui:palette-change` event
- Header, Footer, `MobileMenuPanel`, `PaletteModal`, `SiteFeedbackModal`, `LogoIntroAnimation` are all mounted here

Palette/theme state is persisted in `localStorage` under `frankuxui-palette` (palette id) and `frankuxui-palette-style` (custom primary color overrides), applied as a `data-palette` attribute plus CSS custom properties on `<html>`.

`src/config/index.ts` exports `siteConfig` (title, description, keywords, etc.), consumed by `Root.astro` / `BaseHead`.

### Markdown/MDX pipeline

`rehype-pretty-code` is configured in `astro.config.ts` with vitesse light/dark themes, a copy-button transformer, and a custom transformer that injects extra classNames — used for the notes collection and any MDX content.

## Styling conventions

These are binding project conventions (from the prior `AGENTS.md` style guide):

- Container max width: `max-w-12xl` (2000px), horizontal padding `px-10` — applied to `.hero-inner` and main content grids/sections
- Never hardcode colors — use CSS variables (`--foreground`, `--foreground-muted`, etc.); typography uses Tailwind size classes or `--font-h1`/`--font-h2`-style vars
- Reuse the existing animation utility classes (`.anim-fade-up`, `.anim-fade-in`, `.anim-fade-scale`, `.anim-slide-left`, `.anim-slide-right`) and tune them via inline CSS vars: `--anim-delay`, `--anim-duration` (default `0.7s`), `--anim-distance` (default `24px`), `--anim-easing` (default `cubic-bezier(0.22, 1, 0.36, 1)`). Keyframes belong only in `src/styles/global.css`, never in component files
- Prefer `dvh` for viewport-relative heights (fallback to `vh`), and `clamp()` for responsive sizing
- Astro components should stick to Tailwind + inline CSS vars; avoid `<style>` blocks unless doing complex media queries or keyframes that can't be expressed with Tailwind
- Grid/layout: Tailwind grid/flex utilities, mobile-first (base styles unprefixed, then `sm:`, `lg:`)
