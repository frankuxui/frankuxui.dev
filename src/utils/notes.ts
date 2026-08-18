export function formatNoteDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function estimateReadingTime(text: string, wordsPerMinute = 200): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} min de lectura`;
}

const DIACRITICS_PATTERN = new RegExp("[̀-ͯ]", "g");

export function slugifyTag(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
