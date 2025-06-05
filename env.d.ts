/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API: string;
  readonly RESEND_API_KEY: string;
  readonly EMAIL_FROM: string;
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