import type { z } from "astro/zod";

// ─── Patrones reutilizables de detección de spam ───

export const CONTROL_CHARACTERS_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
export const HTML_PATTERN = /<\/?[a-z][\s\S]*>/i;
export const URL_PATTERN = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|es|dev|app|info|biz|ru|cn)\b)/gi;
export const URL_DETECTION_PATTERN = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|es|dev|app|info|biz|ru|cn)\b)/i;
export const EMAIL_LIKE_PATTERN = /\S+@\S+\.\S+/;
export const REPEATED_CHARACTER_PATTERN = /(.)\1{6,}/u;
export const REPEATED_WORD_PATTERN = /\b([\p{L}\p{N}]{3,})\b(?:[\s.,;:!?-]+\1\b){4,}/iu;
export const BOT_KEYWORDS_PATTERN = /\b(?:casino|crypto|viagra|loan|forex|betting|seo\s+backlinks|telegram|whatsapp\s+marketing)\b/i;

// ─── Normalización de texto ───

export function normalizeSingleLine(value: string) {
  return value.replace(CONTROL_CHARACTERS_PATTERN, "").replace(/\s+/g, " ").trim();
}

export function normalizeEmail(value: string) {
  return value.replace(CONTROL_CHARACTERS_PATTERN, "").trim().toLowerCase();
}

export function normalizeMessage(value: string) {
  return value
    .replace(CONTROL_CHARACTERS_PATTERN, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

export function hasTooManyUppercaseLetters(value: string) {
  const letters = value.replace(/[^\p{L}]/gu, "");
  if (letters.length < 20) return false;

  const uppercaseLetters = letters.replace(/[^\p{Lu}]/gu, "");
  return uppercaseLetters.length / letters.length > 0.75;
}

export function hasTooManySymbols(value: string) {
  const symbols = value.replace(/[\p{L}\p{N}\s.,;:!?'"()¿¡@/-]/gu, "");
  return symbols.length > 12 || symbols.length / Math.max(value.length, 1) > 0.15;
}

/** Añade issues de spam (enlaces, HTML, repeticiones, mayúsculas/símbolos excesivos, palabras clave de bots) a un campo de texto libre dentro de un `superRefine`. */
export function addSpamIssues(ctx: z.RefinementCtx, value: string, path: string[], options: { maxLinks: number; allowEmail?: boolean }) {
  const linkCount = countMatches(value, URL_PATTERN);

  if (linkCount > options.maxLinks) {
    ctx.addIssue({ code: "custom", path, message: "Demasiados enlaces para un mensaje de contacto." });
  }

  if (!options.allowEmail && EMAIL_LIKE_PATTERN.test(value)) {
    ctx.addIssue({ code: "custom", path, message: "Este campo no debe contener correos electrónicos." });
  }

  if (HTML_PATTERN.test(value)) {
    ctx.addIssue({ code: "custom", path, message: "No se permite HTML en este campo." });
  }

  if (REPEATED_CHARACTER_PATTERN.test(value) || REPEATED_WORD_PATTERN.test(value)) {
    ctx.addIssue({ code: "custom", path, message: "El contenido parece repetitivo o automatizado." });
  }

  if (hasTooManyUppercaseLetters(value) || hasTooManySymbols(value) || BOT_KEYWORDS_PATTERN.test(value)) {
    ctx.addIssue({ code: "custom", path, message: "El contenido parece spam. Revisa el texto antes de enviarlo." });
  }
}

/** Añade un issue si el formulario se envió antes del delay mínimo anti-bot (honeypot temporal). */
export function addHoneypotIssues(ctx: z.RefinementCtx, data: { formStartedAt: string }, minSubmitDelayMs: number) {
  const startedAt = Number(data.formStartedAt);

  if (!Number.isFinite(startedAt) || Date.now() - startedAt < minSubmitDelayMs) {
    ctx.addIssue({
      code: "custom",
      path: ["formStartedAt"],
      message: "El formulario se envió demasiado rápido. Inténtalo de nuevo.",
    });
  }
}
