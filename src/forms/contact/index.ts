import { ActionError, defineAction } from "astro:actions";
import { getSecret } from "astro:env/server";
import { type ContactFormData, contactFormSchema } from "@/forms/contact/schema";

// Este módulo solo debe importarse desde src/actions/index.ts (servidor).
// El formulario en el navegador debe importar @/forms/contact/schema, que no
// depende de astro:env/server ni astro:actions.
export * from "@/forms/contact/schema";

class N8nWebhookError extends Error {
  constructor(statusCode: number) {
    super(`El webhook de n8n respondió con código ${statusCode}`);
    this.name = "N8nWebhookError";
  }
}

async function sendContactLeadToN8n(data: Pick<ContactFormData, "name" | "email" | "subject" | "message">) {
  const webhookUrl = getSecret("N8N_CONTACT_WEBHOOK_URL");

  if (!webhookUrl) {
    throw new Error("N8N_CONTACT_WEBHOOK_URL is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
      source: "frankuxui-dev-contact-form",
      siteUrl: "https://frankuxui.dev",
    }),
  });

  if (!response.ok) {
    throw new N8nWebhookError(response.status);
  }
}

export const contact = defineAction({
  accept: "form",
  input: contactFormSchema,
  handler: async ({ name, email, subject, message }) => {
    try {
      await sendContactLeadToN8n({ name, email, subject, message });
    } catch (error) {
      console.error("[contact] Failed to send contact lead.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });

      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al enviar el mensaje. Inténtalo de nuevo más tarde.",
      });
    }

    return { success: true as const };
  },
});
