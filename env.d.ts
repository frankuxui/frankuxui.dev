/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly N8N_CONTACT_WEBHOOK_URL: string;
  readonly N8N_FEEDBACK_WEBHOOK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  theme: {
    setTheme: (theme: "system" | "dark" | "light") => void;
    getTheme: () => "system" | "dark" | "light";
    getSystemTheme: () => "light" | "dark";
    getDefaultTheme: () => "system" | "dark" | "light";
  };
  dataLayer: Array<Record<string, any>>;
}
