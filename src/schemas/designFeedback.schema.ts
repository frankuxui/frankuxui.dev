import { z } from "zod";

export const FEEDBACK_NAME_MIN_LENGTH = 2;
export const FEEDBACK_NAME_MAX_LENGTH = 100;

const CONTROL_CHARACTERS_PATTERN = /[\p{Cc}]/gu;
const URL_DETECTION_PATTERN = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|es|dev|app|info|biz|ru|cn)\b)/i;
const EMAIL_LIKE_PATTERN = /\S+@\S+\.\S+/;
const REPEATED_CHARACTER_PATTERN = /(.)\1{6,}/u;
const REPEATED_WORD_PATTERN = /\b([\p{L}\p{N}]{3,})\b(?:[\s.,;:!?-]+\1\b){4,}/iu;
const CONSONANT_CLUSTER_PATTERN = /[bcdfghjklmnñpqrstvwxyz]{5,}/iu;

const FEEDBACK_NAME_ALLOWED_CHARACTERS_PATTERN = /[^\p{L}\p{M}\s'.-]/gu;
export const FEEDBACK_NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*[\p{L}\p{M}]$/u;

export function normalizeFeedbackNameInput(value: string) {
  return value.replace(CONTROL_CHARACTERS_PATTERN, "").replace(/\s+/g, " ").trim();
}

export function sanitizeFeedbackNameInput(value: string) {
  return value.replace(FEEDBACK_NAME_ALLOWED_CHARACTERS_PATTERN, "").slice(0, FEEDBACK_NAME_MAX_LENGTH);
}

function isLowEntropyName(value: string) {
  const compact = value.toLowerCase().replace(/[\s'.-]/g, "");
  if (compact.length < 10) return false;

  if (/^([\p{L}\p{M}])\1{5,}$/u.test(compact)) {
    return true;
  }

  const uniqueChars = new Set(compact);
  if (uniqueChars.size <= 2) return true;

  const frequencies = new Map<string, number>();
  for (const character of compact) {
    frequencies.set(character, (frequencies.get(character) ?? 0) + 1);
  }

  const maxFrequency = Math.max(...frequencies.values());
  if (maxFrequency / compact.length >= 0.75) return true;

  return false;
}

export function getFeedbackNameValidationMessage(value: string) {
  const normalizedValue = normalizeFeedbackNameInput(value);
  const compactValue = normalizedValue.toLowerCase().replace(/[\s'.-]/g, "");

  if (normalizedValue.length < FEEDBACK_NAME_MIN_LENGTH) {
    return `El nombre debe tener al menos ${FEEDBACK_NAME_MIN_LENGTH} caracteres.`;
  }

  if (normalizedValue.length > FEEDBACK_NAME_MAX_LENGTH) {
    return `El nombre no puede superar los ${FEEDBACK_NAME_MAX_LENGTH} caracteres.`;
  }

  if (!FEEDBACK_NAME_PATTERN.test(normalizedValue)) {
    return "El nombre solo puede contener letras, espacios, apostrofes, puntos o guiones, y no puede incluir numeros.";
  }

  if (URL_DETECTION_PATTERN.test(normalizedValue) || EMAIL_LIKE_PATTERN.test(normalizedValue)) {
    return "El nombre no puede contener enlaces ni correos electrónicos.";
  }

  if (/^([\p{L}\p{M}])\1{4,}$/u.test(compactValue)) {
    return "El nombre parece repetitivo o automatizado.";
  }

  if (REPEATED_CHARACTER_PATTERN.test(normalizedValue) || REPEATED_WORD_PATTERN.test(normalizedValue)) {
    return "El nombre parece repetitivo o automatizado.";
  }

  if (isLowEntropyName(normalizedValue)) {
    return "El nombre parece repetitivo o automatizado.";
  }

  const singleToken = normalizedValue.split(" ").length === 1;
  if (singleToken && normalizedValue.length >= 18 && CONSONANT_CLUSTER_PATTERN.test(normalizedValue)) {
    return "El nombre parece inválido. Escribe tu nombre real para enviar la valoración.";
  }

  return "";
}

export const designFeedbackSchema = z.object({
  name: z
    .string()
    .transform(normalizeFeedbackNameInput)
    .pipe(
      z
        .string()
        .min(FEEDBACK_NAME_MIN_LENGTH)
        .max(FEEDBACK_NAME_MAX_LENGTH)
        .regex(FEEDBACK_NAME_PATTERN)
        .refine((value) => getFeedbackNameValidationMessage(value).length === 0, "Nombre inválido")
    ),
  rating: z.number().int().min(1).max(5)
});

export type DesignFeedbackInput = z.input<typeof designFeedbackSchema>;
export type DesignFeedbackData = z.output<typeof designFeedbackSchema>;
