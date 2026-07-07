import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { contactLeadSchema } from "@/schemas/contactLead.schema";

export const prerender = false;

class N8nWebhookError extends Error {
  constructor(statusCode: number) {
    super(`El webhook de n8n respondió con código ${statusCode}`);
    this.name = "N8nWebhookError";
  }
}

async function sendContactLeadToN8n(data: { name: string; email: string; subject: string; message: string }) {
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

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json().catch(() => null);
  const result = contactLeadSchema.safeParse(payload);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "root");
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Datos del formulario no válidos",
        errors: fieldErrors,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await sendContactLeadToN8n(result.data);
    return new Response(JSON.stringify({ success: true, message: "Mensaje enviado correctamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[contact] Failed to send contact lead.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error al enviar el mensaje. Inténtalo de nuevo más tarde.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
