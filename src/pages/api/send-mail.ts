import type { APIRoute } from "astro";
import { Resend } from "resend";
import EmailTemplate from "@/mail/email-template";
import { render } from "@react-email/render";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const GET: APIRoute = async () => {
  // create the email
  const emailContent = EmailTemplate({ name: "Frank", email: "fisdray@gmail.com", message: "Hello, this is a test message!" });
  const html = await render(emailContent);
  const text = await render(emailContent, {
    plainText: true,
  });

  // send an email
  const { data, error } = await resend.emails.send({
    from: "YOUR_NAME <YOUR_EMAIL@YOUR_DOMAIN>",
    to: ["delivered@resend.dev"],
    subject: "It works!",
    html,
    text,
  });

  if (error) {
    return new Response(JSON.stringify(error));
  }

  return new Response(JSON.stringify(data));
};