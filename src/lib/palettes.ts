export interface PaletteDefinition {
  id: string;
  name: string;
  /** Color sólido usado en botones y acentos (--primary). Tono medio/mate, legible con texto claro. */
  primary: string;
  /** Texto sobre --primary (--primary-foreground). */
  primaryForeground: string;
  /** Paradas pastel para el degradado animado del canvas de fondo. */
  gradient: string[];
}

export const defaultPaletteId = "ocean-sunset";

export const palettes: PaletteDefinition[] = [
  {
    id: "ocean-sunset",
    name: "Ocean Sunset",
    primary: "#145b5b",
    primaryForeground: "#e1f8f8",
    gradient: ["#c6dda6", "#f4eebd", "#fff0df", "#f2e7db", "#e0eecc"]
  },
  {
    id: "refreshing-summer-fun",
    name: "Refreshing Summer Fun",
    primary: "#4a72b8",
    primaryForeground: "#f5f9ff",
    gradient: ["#d7e6f5", "#f5ecc9", "#f7d9b0", "#eef3d8"]
  },
  {
    id: "sunny-beach-day",
    name: "Sunny Beach Day",
    primary: "#2f8f83",
    primaryForeground: "#f0faf8",
    gradient: ["#cfe9e2", "#f6dfb0", "#f2c3a8", "#e7f0d2"]
  },
  {
    id: "mystic-evening",
    name: "Mystic Evening",
    primary: "#6b4f7a",
    primaryForeground: "#f6f1f7",
    gradient: ["#e6dbea", "#ecd7de", "#d9c8e0", "#f1e6ea"]
  },
  {
    id: "asteroid-impact",
    name: "Asteroid Impact",
    primary: "#4a5a99",
    primaryForeground: "#f2f4fb",
    gradient: ["#dbe6f5", "#f5cfc9", "#cdeaf2", "#e8f0da"]
  },
  {
    id: "neutral-earthtones",
    name: "Neutral Earthtones",
    primary: "#263740",
    primaryForeground: "#f2f6f7",
    gradient: ["#dde6e6", "#cfd9d6", "#e3ded2", "#d3ddd9"]
  },
  {
    id: "sunset-beach-escape",
    name: "Sunset Beach Escape",
    primary: "#8a4a52",
    primaryForeground: "#faf1ee",
    gradient: ["#eef0c9", "#f2e6b0", "#e8caa0", "#f5efd8"]
  },
  {
    id: "warm-autumn-glow",
    name: "Warm Autumn Glow",
    primary: "#351e14",
    primaryForeground: "#fbf1e8",
    gradient: ["#f7dcb0", "#f2c69f", "#ecb98a", "#f8e6cf"]
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    primary: "#231942",
    primaryForeground: "#ffffff",
    gradient: ["#9F86C0", "#E0B1CB", "#E3B8D0", "#ECCEDF", "#FFE5D9"]
  },
  {
    id: "soft-peachy-delight",
    name: "Soft Peachy Delight",
    primary: "#4E2C26",
    primaryForeground: "#F8EDEB",
    gradient: ["#FCD5CE", "#FAE1DD", "#E8E8E4", "#ECE4DB", "#FFD7BA"]
  },
  {
    id: "mountain",
    name: "Mountain",
    primary: "#304421",
    primaryForeground: "#ffffff",
    gradient: ["#DDFFDD", "#B6B5B3", "#6D6A67", "#383D1D", "#59694C"]
  },
  {
    id: "turquoise-waters",
    name: "Turquoise Waters",
    primary: "#077C78",
    primaryForeground: "#ffffff",
    gradient: ["#07BEB8", "#3DCCC7", "#68D8D6", "#9CEAEF", "#C4FFF9"]
  }
];

export const paletteStorageKey = "frankuxui-palette";
