import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { designFeedbackSchema } from "@/schemas/designFeedback.schema";

export const prerender = false;

const FEEDBACK_COOKIE_NAME = "frankuxui_design_feedback_sent";
const FEEDBACK_WEBHOOK_TIMEOUT_MS = 8000;

export const POST: APIRoute = async ({ request, cookies }) => {
  const payload = await request.json().catch(() => null);
  const result = designFeedbackSchema.safeParse(payload);

  if (!result.success) {
    return new Response(JSON.stringify({ ok: false, message: "Datos inválidos." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const feedback = {
    ...result.data,
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = getSecret("N8N_FEEDBACK_WEBHOOK_URL");

  if (!webhookUrl) {
    console.error("[design-feedback] N8N_FEEDBACK_WEBHOOK_URL is not configured.");
    return new Response(JSON.stringify({ ok: false, message: "Webhook no configurado." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FEEDBACK_WEBHOOK_TIMEOUT_MS);

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
      signal: controller.signal,
    });

    if (!webhookResponse.ok) {
      console.error("[design-feedback] N8N webhook failed.", {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
      });

      return new Response(JSON.stringify({ ok: false, message: "No se pudo registrar la valoración." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("[design-feedback] N8N webhook request failed.", error);
    return new Response(JSON.stringify({ ok: false, message: "No se pudo registrar la valoración." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    clearTimeout(timeout);
  }

  cookies.set(FEEDBACK_COOKIE_NAME, "true", {
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
