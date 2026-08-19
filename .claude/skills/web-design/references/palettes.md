# Palette Reference

Complete list of all 14 palettes with their exact hex values. Each entry shows
the palette id (used in `data-palette` attribute and localStorage), the display
name, and all color tokens.

**Files to edit when adding/modifying palettes:**
- `src/lib/palettes.ts` — runtime data (id, name, primary, primaryForeground, gradient array)
- `src/styles/global.css` — CSS overrides (`[data-palette="<id>"]` block with --primary, --primary-foreground, --secondary-foreground, --gradient-1..5)

---

## 1. Ocean Sunset (default)

- **id:** `ocean-sunset`
- **primary:** `#145b5b` (teal oscuro)
- **primaryForeground:** `#e1f8f8`
- **secondaryForeground:** `#145b5b`
- **gradient:** `#c6dda6`, `#f4eebd`, `#fff0df`, `#f2e7db`, `#e0eecc`

## 2. Refreshing Summer Fun

- **id:** `refreshing-summer-fun`
- **primary:** `#4a72b8` (azul medio)
- **primaryForeground:** `#f5f9ff`
- **secondaryForeground:** `#4a72b8`
- **gradient:** `#d7e6f5`, `#f5ecc9`, `#f7d9b0`, `#eef3d8`, `#d7e6f5`

## 3. Sunny Beach Day

- **id:** `sunny-beach-day`
- **primary:** `#2f8f83` (verde azulado)
- **primaryForeground:** `#f0faf8`
- **secondaryForeground:** `#2f8f83`
- **gradient:** `#cfe9e2`, `#f6dfb0`, `#f2c3a8`, `#e7f0d2`, `#cfe9e2`

## 4. Mystic Evening

- **id:** `mystic-evening`
- **primary:** `#6b4f7a` (violeta oscuro)
- **primaryForeground:** `#f6f1f7`
- **secondaryForeground:** `#6b4f7a`
- **gradient:** `#e6dbea`, `#ecd7de`, `#d9c8e0`, `#f1e6ea`, `#e6dbea`

## 5. Asteroid Impact

- **id:** `asteroid-impact`
- **primary:** `#4a5a99` (azul índigo)
- **primaryForeground:** `#f2f4fb`
- **secondaryForeground:** `#4a5a99`
- **gradient:** `#dbe6f5`, `#f5cfc9`, `#cdeaf2`, `#e8f0da`, `#dbe6f5`

## 6. Neutral Earthtones

- **id:** `neutral-earthtones`
- **primary:** `#263740` (gris azulado oscuro)
- **primaryForeground:** `#f2f6f7`
- **secondaryForeground:** `#263740`
- **gradient:** `#dde6e6`, `#cfd9d6`, `#e3ded2`, `#d3ddd9`, `#dde6e6`

## 7. Sunset Beach Escape

- **id:** `sunset-beach-escape`
- **primary:** `#8a4a52` (rosa oscuro / vino)
- **primaryForeground:** `#faf1ee`
- **secondaryForeground:** `#8a4a52`
- **gradient:** `#eef0c9`, `#f2e6b0`, `#e8caa0`, `#f5efd8`, `#eef0c9`

## 8. Warm Autumn Glow

- **id:** `warm-autumn-glow`
- **primary:** `#120906` (en CSS) / `#351e14` (en palettes.ts)
- **primaryForeground:** `#fbf1e8`
- **secondaryForeground:** `#351e14`
- **gradient:** `#f7dcb0`, `#f2c69f`, `#ecb98a`, `#f8e6cf`, `#f7dcb0`

## 9. Purple Dream

- **id:** `purple-dream`
- **primary:** `#231942` (púrpura profundo)
- **primaryForeground:** `#ffffff`
- **secondaryForeground:** `#e8c4d8`
- **gradient:** `#9f86c0`, `#e0b1cb`, `#e3b8d0`, `#eccedf`, `#ffe5d9`

## 10. Soft Peachy Delight

- **id:** `soft-peachy-delight`
- **primary:** `#4e2c26` (marrón oscuro)
- **primaryForeground:** `#f8edeb`
- **secondaryForeground:** `#4e2c26`
- **gradient:** `#fcd5ce`, `#fae1dd`, `#e8e8e4`, `#ece4db`, `#ffd7ba`

## 11. Mountain

- **id:** `mountain`
- **primary:** `#17240d` (en CSS) / `#304421` (en palettes.ts)
- **primaryForeground:** `#ffffff`
- **secondaryForeground:** `#304421`
- **gradient:** `#ddffdd`, `#fff2e0`, `#fff3d3`, `#e1ffc8`, `#d1d2cd`

## 12. Turquoise Waters

- **id:** `turquoise-waters`
- **primary:** `#043534` (en CSS) / `#077C78` (en palettes.ts)
- **primaryForeground:** `#ffffff`
- **secondaryForeground:** `#077c78`
- **gradient:** `#ccf7ff`, `#b0e2ff`, `#fffbc6`, `#ccffef`, `#d6fffb`

## 13. Coral Reef

- **id:** `coral-reef`
- **primary:** `#5c2a2e` (vino profundo)
- **primaryForeground:** `#fff5f3`
- **secondaryForeground:** `#5c2a2e`
- **gradient:** `#f8d5cc`, `#d8efe6`, `#fde8d5`, `#f0ddd5`, `#e0f0e8`

## 14. Honey Dew

- **id:** `honey-dew`
- **primary:** `#3a3520` (oliva oscuro)
- **primaryForeground:** `#fdf8ef`
- **secondaryForeground:** `#3a3520`
- **gradient:** `#f0e8c8`, `#dde8d0`, `#f8edd0`, `#e5e0c8`, `#e8f0d8`

## 15. Midnight Lavender

- **id:** `midnight-lavender`
- **primary:** `#2e2350` (índigo profundo)
- **primaryForeground:** `#f5f2fc`
- **secondaryForeground:** `#2e2350`
- **gradient:** `#e4d9f5`, `#d0e3f7`, `#f5dff0`, `#dce8f9`, `#ece0fa`

## 16. Citrus Grove

- **id:** `citrus-grove`
- **primary:** `#1f3d1a` (verde bosque oscuro)
- **primaryForeground:** `#f2fbef`
- **secondaryForeground:** `#1f3d1a`
- **gradient:** `#f5f0c9`, `#d9f0c0`, `#fce8b8`, `#e0f5d0`, `#f0f7d8`

## 17. Rose Quartz

- **id:** `rose-quartz`
- **primary:** `#4a1f30` (ciruela/vino oscuro)
- **primaryForeground:** `#fdf0f3`
- **secondaryForeground:** `#4a1f30`
- **gradient:** `#f7d9e0`, `#f0e0e8`, `#fce4d8`, `#f5d5db`, `#ede0e5`

## 18. Arctic Frost

- **id:** `arctic-frost`
- **primary:** `#17293d` (azul marino oscuro)
- **primaryForeground:** `#eef7fc`
- **secondaryForeground:** `#17293d`
- **gradient:** `#d5ecf7`, `#e0f2fa`, `#f0f9fc`, `#d8e8f0`, `#e8f5f9`
