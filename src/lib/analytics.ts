export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsParams = Record<string, AnalyticsValue>;

function compactParams(params: AnalyticsParams) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null));
}

/**
 * Envía un evento a Google Tag Manager / Google Analytics a través de
 * `window.dataLayer`, ya inicializado en `BaseHead.astro`.
 */
export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...compactParams(params) });
}
