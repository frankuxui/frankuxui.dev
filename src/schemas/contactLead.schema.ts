import { z } from "zod";

export const CONTACT_NAME_MIN_LENGTH = 2;
export const CONTACT_NAME_MAX_LENGTH = 100;
export const CONTACT_EMAIL_MAX_LENGTH = 254;
export const CONTACT_SUBJECT_MIN_LENGTH = 3;
export const CONTACT_SUBJECT_MAX_LENGTH = 160;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 250;
export const CONTACT_MIN_SUBMIT_DELAY_MS = 2500;

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*[\p{L}\p{M}]$/u;
const CONTROL_CHARACTERS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const HTML_PATTERN = /<\/?[a-z][\s\S]*>/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|es|dev|app|info|biz|ru|cn)\b)/gi;
const URL_DETECTION_PATTERN = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|es|dev|app|info|biz|ru|cn)\b)/i;
const EMAIL_LIKE_PATTERN = /\S+@\S+\.\S+/;
const REPEATED_CHARACTER_PATTERN = /(.)\1{6,}/u;
const REPEATED_WORD_PATTERN = /\b([\p{L}\p{N}]{3,})\b(?:[\s.,;:!?-]+\1\b){4,}/iu;
const BOT_KEYWORDS_PATTERN = /\b(?:casino|crypto|viagra|loan|forex|betting|seo\s+backlinks|telegram|whatsapp\s+marketing)\b/i;

function normalizeSingleLine(value: string) {
  return value.replace(CONTROL_CHARACTERS_PATTERN, "").replace(/\s+/g, " ").trim();
}

function normalizeEmail(value: string) {
  return value.replace(CONTROL_CHARACTERS_PATTERN, "").trim().toLowerCase();
}

function normalizeMessage(value: string) {
  return value
    .replace(CONTROL_CHARACTERS_PATTERN, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

function hasTooManyUppercaseLetters(value: string) {
  const letters = value.replace(/[^\p{L}]/gu, "");
  if (letters.length < 20) return false;

  const uppercaseLetters = letters.replace(/[^\p{Lu}]/gu, "");
  return uppercaseLetters.length / letters.length > 0.75;
}

function hasTooManySymbols(value: string) {
  const symbols = value.replace(/[\p{L}\p{N}\s.,;:!?'"()¿¡@/-]/gu, "");
  return symbols.length > 12 || symbols.length / Math.max(value.length, 1) > 0.15;
}

function addSpamIssues(ctx: z.RefinementCtx, value: string, path: string[], options: { maxLinks: number; allowEmail?: boolean }) {
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

const requiredString = (message: string) => z.string({ error: message }).refine((value) => normalizeSingleLine(value).length > 0, message);

export const contactLeadSchema = z
  .object({
    name: requiredString("El nombre es obligatorio")
      .transform(normalizeSingleLine)
      .pipe(
        z
          .string()
          .min(CONTACT_NAME_MIN_LENGTH, `El nombre debe tener al menos ${CONTACT_NAME_MIN_LENGTH} caracteres`)
          .max(CONTACT_NAME_MAX_LENGTH, `El nombre no puede superar los ${CONTACT_NAME_MAX_LENGTH} caracteres`)
          .regex(NAME_PATTERN, "El nombre solo puede contener letras, espacios, apóstrofes, puntos o guiones")
          .refine((value) => !URL_DETECTION_PATTERN.test(value), "El nombre no puede contener URLs")
          .refine((value) => !EMAIL_LIKE_PATTERN.test(value), "El nombre no puede contener correos electrónicos")
          .refine((value) => !/\d/.test(value), "El nombre no puede contener números")
          .refine((value) => !REPEATED_CHARACTER_PATTERN.test(value), "El nombre parece inválido")
      ),
    email: requiredString("El correo es obligatorio")
      .transform(normalizeEmail)
      .pipe(
        z
          .email("Correo electrónico no válido")
          .max(CONTACT_EMAIL_MAX_LENGTH, `El correo no puede superar los ${CONTACT_EMAIL_MAX_LENGTH} caracteres`)
          .refine((value) => !/\s/.test(value), "El correo no puede contener espacios")
          .refine((value) => !CONTROL_CHARACTERS_PATTERN.test(value), "El correo contiene caracteres inválidos")
      ),
    subject: requiredString("El asunto es obligatorio")
      .transform(normalizeSingleLine)
      .pipe(
        z
          .string()
          .min(CONTACT_SUBJECT_MIN_LENGTH, `El asunto debe tener al menos ${CONTACT_SUBJECT_MIN_LENGTH} caracteres`)
          .max(CONTACT_SUBJECT_MAX_LENGTH, `El asunto no puede superar los ${CONTACT_SUBJECT_MAX_LENGTH} caracteres`)
      ),
    message: z
      .string({ error: "El mensaje es obligatorio" })
      .transform(normalizeMessage)
      .pipe(
        z
          .string()
          .min(CONTACT_MESSAGE_MIN_LENGTH, `El mensaje debe tener al menos ${CONTACT_MESSAGE_MIN_LENGTH} caracteres`)
          .max(CONTACT_MESSAGE_MAX_LENGTH, `El mensaje no puede superar los ${CONTACT_MESSAGE_MAX_LENGTH} caracteres`)
      ),
    company: z.string().max(0, "No se pudo validar el envío").optional().or(z.literal("")),
    formStartedAt: z.string({ error: "No se pudo validar el envío" }).regex(/^\d+$/, "No se pudo validar el envío"),
  })
  .strict()
  .superRefine((data, ctx) => {
    const startedAt = Number(data.formStartedAt);

    if (!Number.isFinite(startedAt) || Date.now() - startedAt < CONTACT_MIN_SUBMIT_DELAY_MS) {
      ctx.addIssue({
        code: "custom",
        path: ["formStartedAt"],
        message: "El formulario se envió demasiado rápido. Inténtalo de nuevo.",
      });
    }

    addSpamIssues(ctx, data.subject, ["subject"], { maxLinks: 0 });
    addSpamIssues(ctx, data.message, ["message"], { maxLinks: 2, allowEmail: true });
  });

export type ContactLeadInput = z.input<typeof contactLeadSchema>;
export type ContactLeadData = z.output<typeof contactLeadSchema>;
