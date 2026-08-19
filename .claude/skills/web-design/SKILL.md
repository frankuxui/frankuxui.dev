---
name: web-design
description: >
  Design system reference and guide for frankuxui.dev. Use this skill whenever
  you need to create, modify, or review any visual aspect of the site — colors,
  palettes, typography, spacing, layout, animations, component structure, or
  responsive behavior. Consult it before touching any .astro component's
  styling, adding a new palette, creating a new section, or adjusting layout
  widths. This avoids re-reading the entire codebase for every design task.
  Trigger on: palette, color, gradient, typography, font, spacing, layout,
  animation, component design, responsive, Tailwind styling, CSS variables,
  section design, card design, footer, header, hero, minimalist, redesign.
---

# frankuxui.dev — Design System Reference

This skill is a living reference for the visual design system of frankuxui.dev.
Read it before any design task to understand the conventions, tokens, and
patterns already in place. For palette-specific hex values, read
`references/palettes.md`.

---

## 1. Architecture at a Glance

| Layer | Location | Role |
|-------|----------|------|
| Pages (thin routes) | `src/pages/*.astro` | Compose sections, provide JSON-LD / meta |
| Feature sections | `src/features/<domain>/sections/*.astro` | Page-specific UI blocks |
| Shared components | `src/components/*.astro` | Reusable across pages |
| Root layout | `src/layouts/Root.astro` | Shell: `<head>`, header, footer, modals, canvas gradient, logo animation |
| Styles | `src/styles/global.css` | Tokens, palette overrides, keyframes, utility classes |
| Palette definitions | `src/lib/palettes.ts` | Runtime palette data (id, name, primary, gradient stops) |
| Config | `src/config/index.ts` | Site metadata (`siteConfig`) |

### Feature-folder pattern

Every page that has multiple sections follows this structure:

```
src/features/<domain>/
  sections/
    <Domain>HeroSection.astro
    <Domain>ContentSection.astro
    ...
```

Current domains: `home`, `about`, `contact`, `mision`, `biografia`, `notes`, `site-map`.

### Shared components (src/components/)

Header, Footer, Logo, BaseHead, ContactForm, PaletteModal, MobileMenuPanel,
MobileMenuToggle, SiteFeedbackModal, NotesSearchModal, CookieConsent (disabled),
LogoIntroAnimation, FormattedDate, HeaderLink, SvgSuccessAnimation.

---

## 2. Color System

All colors are CSS custom properties on `:root`, overridden per palette via
`[data-palette="<id>"]` selectors.

### Base tokens (always available)

| Variable | Default | Purpose |
|----------|---------|---------|
| `--foreground` | `#15273b` | Primary text |
| `--foreground-muted` | `rgb(29, 41, 54)` | Secondary / muted text |
| `--background` | `#ffffff` | Card / surface bg |
| `--background-card` | `#e8dfd2` | Card alt bg |
| `--body-background` | `#f0e8dc` | Page body bg |
| `--primary` | varies per palette | Buttons, accents — **always the darkest color** |
| `--primary-foreground` | varies | Text on primary |
| `--secondary` | `#ffffff` | Secondary surface |
| `--secondary-foreground` | varies (usually = primary) | Text on secondary |
| `--gradient-1` to `--gradient-5` | varies | Pastel stops for the animated canvas gradient |

### Tailwind mapping

In `@theme inline` these are bridged to Tailwind:

- `--color-primary`, `--color-primary-foreground`, `--color-secondary`, etc.
- `--color-foreground`, `--color-foreground-muted`
- `--color-body-background`, `--color-background`, `--color-background-card`

Use Tailwind classes like `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary/50`, `text-foreground-muted`, `bg-body-background`.

### Golden rule

**Never hardcode colors.** Always use CSS variables or their Tailwind equivalents. This ensures every palette works correctly.

### Palette system

There are 14 palettes defined in `src/lib/palettes.ts` and `src/styles/global.css`. For the full list with hex values, see `references/palettes.md`.

The active palette is stored in localStorage under `"frankuxui-palette"`. A pre-hydration script in Root.astro restores it before first paint. The `PaletteModal.astro` component lets users switch palettes.

When creating a new palette you must:
1. Add the entry to `palettes` array in `src/lib/palettes.ts`
2. Add a `[data-palette="<id>"]` block in `src/styles/global.css` with `--primary`, `--primary-foreground`, `--secondary-foreground`, and `--gradient-1` through `--gradient-5`

The primary color must always be the **darkest** color of the palette — it's used for buttons and accents with light text on top.

---

## 3. Typography

**Font family:** Poppins (Google Fonts), set as `--body-font` / `--font-poppins`.

### Responsive type scale (CSS custom properties)

| Token | Value | Typical use |
|-------|-------|-------------|
| `--font-h1` | `clamp(3.2rem, 0.57rem + 8.24vw, 6rem)` | Page hero titles |
| `--font-h2` | `clamp(1.5rem, 1.1rem + 1.71vw, 2.8125rem)` | Section headings |
| `--font-h2-display` | `clamp(1.875rem, 1.3rem + 2vw, 3.95rem)` | Display headings |
| `--font-h3` | `clamp(1.375rem, 1.18rem + 0.82vw, 2rem)` | Sub-headings |
| `--font-h4` | `clamp(1.375rem, 1.18rem + 0.82vw, 1.6rem)` | Card titles |
| `--font-h5` | `clamp(1rem, 0.92rem + 0.33vw, 1.25rem)` | Descriptions, subtitles |
| `--font-h6` | `clamp(1rem, 0.96rem + 0.16vw, 1.125rem)` | Small headings |
| `--font-body` | `clamp(1.2rem, 0.89rem + 0.49vw, 1.375rem)` | Body text |
| `--font-link` | `clamp(0.875rem, 0.8rem + 0.33vw, 1.125rem)` | Nav / footer links |
| `--font-mini` | `clamp(0.875rem, 0.84rem + 0.16vw, 1rem)` | Captions, meta |

Apply via inline style: `style={{ "font-size": "var(--font-body)" }}` or in class when Tailwind has equivalent. For hero names, the `.hero-name` utility class provides its own clamp.

---

## 4. Spacing & Layout

### Container widths

| Tailwind class | Width | Use case |
|----------------|-------|----------|
| `max-w-12xl` | 2000px | Hero sections, full-width grids |
| `max-w-7xl` | 1280px | Footer content |
| `max-w-5xl` | 1024px | Content sections (about, contact, forms) |
| `max-w-md` | 448px | Constrained text blocks |

### Standard horizontal padding

Always `px-10` on the inner container `div`.

### Section pattern

```html
<section class="w-full py-16 lg:py-24" aria-labelledby="section-title">
  <div class="w-full max-w-5xl mx-auto px-10">
    <!-- content -->
  </div>
</section>
```

Typical vertical padding: `py-16 sm:py-20 lg:py-24`.

### Breakpoints

| Name | Width |
|------|-------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |
| `3xl` | 1920px |
| `4xl` | 2000px |

### Responsive approach

**Mobile-first** — base styles unprefixed, then `sm:`, `lg:`, etc. Prefer `dvh` over `vh` for viewport heights. Use `clamp()` for fluid sizing.

---

## 5. Animation System

Keyframes live only in `src/styles/global.css`. Never define keyframes in component files.

### Utility classes

| Class | Effect |
|-------|--------|
| `.anim-fade-up` | Fade in + slide up |
| `.anim-fade-in` | Fade in (opacity only) |
| `.anim-fade-scale` | Fade in + scale from `--anim-scale-from` (default 0.92) |
| `.anim-slide-left` | Fade in + slide from left |
| `.anim-slide-right` | Fade in + slide from right |

### Tuning CSS variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `--anim-delay` | `0s` | Stagger entrance timing |
| `--anim-duration` | `0.7s` | Animation length |
| `--anim-distance` | `24px` | Translation distance |
| `--anim-easing` | `cubic-bezier(0.22, 1, 0.36, 1)` | Easing curve |
| `--anim-scale-from` | `0.92` | Initial scale for fade-scale |

### Usage example

```html
<h2
  class="anim-fade-up"
  style={{ "--anim-delay": "0.1s", "--anim-duration": "0.8s" }}
>
  Heading
</h2>
```

All animation classes include `@media (prefers-reduced-motion: reduce)` — animation is disabled and elements appear at full opacity immediately.

### GSAP

GSAP is available for complex interactive animations (e.g., LogoIntroAnimation). For simple entrance effects, always prefer the CSS utility classes above.

---

## 6. Component Styling Conventions

### Do

- Use Tailwind utility classes + inline CSS vars
- Use CSS custom properties for colors and font sizes
- Use `clamp()` for responsive values
- Use existing animation utility classes
- Stick to the container width convention for the context (hero = 12xl, content = 5xl, footer = 7xl)
- Apply `aria-hidden="true"` to decorative SVGs
- Apply proper `aria-label` / `aria-labelledby` to sections and interactive elements

### Don't

- Hardcode hex/rgb colors — always reference CSS variables
- Use `<style>` blocks in Astro components unless doing complex media queries or keyframes
- Define new keyframes in components — add them to `global.css`
- Use `vh` — prefer `dvh` with `vh` fallback
- Add feature flags, backwards-compat shims, or speculative abstractions

### Card pattern (when used)

```html
<div class="rounded-4xl bg-background/60 backdrop-blur-2xl p-8 sm:p-12 lg:p-16 xl:p-20">
  <!-- content -->
</div>
```

Current design trend is moving toward **no-card, open layout** for content sections (contact, about brand, social). Cards are still used in specific places like expertise grids.

### Link styling

External links: add `target="_blank" rel="noopener noreferrer"` and `aria-label="Name (abre en nueva ventana)"`.

Footer/nav links: `text-foreground-muted hover:text-foreground transition-colors duration-200`.

### Social icons

Defined in `src/data/social.ts`. 8 platforms with SVG icons (all have `aria-hidden="true"`). Used in Footer and ContactSocialSection.

---

## 7. Animated Gradient Background

`#bg-gradient` is a `<canvas>` element rendered in Root.astro. It creates an animated plasma-style background that samples colors from the active palette's `--gradient-1` through `--gradient-5`.

It re-initializes on:
- `astro:page-load` (view transitions)
- `frankuxui:palette-change` custom event (when user switches palette)

Do not modify or interfere with this canvas. Its z-index is below all content.

---

## 8. Logo Mascot (LogoIntroAnimation)

The SVG logo mascot at `src/components/LogoIntroAnimation.astro` features:
- Assembly animation: pieces fly in from random directions
- Eyes with blinking (periodic, random interval 2.5-5.5s) and cursor tracking (pupils follow mouse)
- Walking animation: hops between screen corners on click
- Pause/resume: click while walking pauses, click again resumes
- Persistence: last position saved in localStorage (`frankuxui-logo-side`)
- Fixed overlay with `pointer-events-none` container, `pointer-events-auto` on the button
- Respects `prefers-reduced-motion`

---

## Quick Reference: Creating a New Section

1. Create `src/features/<domain>/sections/<Domain><Name>Section.astro`
2. Use the section pattern: `<section class="w-full py-16 lg:py-24" aria-labelledby="...">`
3. Inner container: `<div class="w-full max-w-5xl mx-auto px-10">`
4. Apply animation classes with staggered delays
5. Use CSS variable font sizes, never hardcoded px
6. Import into the page file in `src/pages/`
7. Add proper accessibility attributes (`aria-labelledby`, heading hierarchy)
