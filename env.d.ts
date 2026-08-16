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

declare module "granim" {
  type Gradient = [string, string, string] | string[];

  interface GranimState {
    gradients: Gradient[];
    transitionSpeed?: number;
    loop?: boolean;
  }

  interface GranimOptions {
    element: string | HTMLCanvasElement;
    direction?: "diagonal" | "left-right" | "top-bottom" | "radial";
    isPausedWhenNotInView?: boolean;
    stateTransitionSpeed?: number;
    states: Record<string, GranimState>;
  }

  export default class Granim {
    constructor(options: GranimOptions);
    changeState(stateName: string): void;
    pause(): void;
    play(): void;
    destroy(): void;
  }
}
