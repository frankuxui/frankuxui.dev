/**
 * Utilidades para resolver URLs de assets (imágenes) que llegan desde la API
 * externa del blog. La API puede devolver strings absolutos, strings
 * relativos ("/uploads/foo.jpg") u objetos anidados tipo { url }, { data: {
 * url } }, etc. Estas funciones normalizan cualquiera de esas formas a una
 * URL absoluta utilizable directamente en <img src>.
 */

export function resolveAssetUrl(url: string | null | undefined, origin: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;

  const cleanOrigin = origin.replace(/\/+$/, "");
  return trimmed.startsWith("/") ? `${cleanOrigin}${trimmed}` : `${cleanOrigin}/${trimmed}`;
}

export function extractImageUrl(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "string") return raw;

  if (typeof raw === "object") {
    const item = raw as Record<string, unknown>;
    if (typeof item.url === "string") return item.url;
    if (typeof item.src === "string") return item.src;
    if (typeof item.path === "string") return item.path;
    if (typeof item.href === "string") return item.href;
    if (item.data) return extractImageUrl(item.data);
    if (item.attributes) return extractImageUrl(item.attributes);
  }

  return null;
}
