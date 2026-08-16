import { z } from "astro/zod";
import { addHoneypotIssues, addSpamIssues, normalizeEmail, normalizeMessage, normalizeSingleLine } from "@/forms/utils";

// Módulo cliente-seguro: solo Zod y utilidades puras, sin `astro:env/server`
// ni `astro:actions`, para poder importarse tanto desde el handler de la
// Action (servidor) como desde el script del formulario (navegador).

export const CONTACT_NAME_MIN_LENGTH = 2;
export const CONTACT_NAME_MAX_LENGTH = 100;
export const CONTACT_EMAIL_MAX_LENGTH = 254;
export const CONTACT_SUBJECT_MIN_LENGTH = 3;
export const CONTACT_SUBJECT_MAX_LENGTH = 160;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 250;
export const CONTACT_MIN_SUBMIT_DELAY_MS = 2500;

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*[\p{L}\p{M}]$/u;
const URL_DETECTION_PATTERN = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|es|dev|app|info|biz|ru|cn)\b)/i;
const EMAIL_LIKE_PATTERN = /\S+@\S+\.\S+/;
const REPEATED_CHARACTER_PATTERN = /(.)\1{6,}/u;
const CONTROL_CHARACTERS_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

const requiredString = (message: string) => z.string({ error: message }).refine((value) => normalizeSingleLine(value).length > 0, message);

// Formulario y validación de spam/honeypot que ya vivían en src/schemas/contactLead.schema.ts,
// ahora expuestos como el input Zod de la Astro Action de contacto.
export const contactFormSchema = z
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
    company: z.string().max(0, "No se pudo validar el envío").nullish(),
    formStartedAt: z.string({ error: "No se pudo validar el envío" }).regex(/^\d+$/, "No se pudo validar el envío"),
  })
  .strict()
  .superRefine((data, ctx) => {
    addHoneypotIssues(ctx, data, CONTACT_MIN_SUBMIT_DELAY_MS);
    addSpamIssues(ctx, data.subject, ["subject"], { maxLinks: 0 });
    addSpamIssues(ctx, data.message, ["message"], { maxLinks: 2, allowEmail: true });
  });

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;
