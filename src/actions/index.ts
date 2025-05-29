import { defineAction } from "astro:actions";
import { Resend } from "resend";
import EmailTemplate from "@/mail/email-template";
import { render } from "@react-email/render";
import { z } from "astro:schema";
import { RESEND_API_KEY, EMAIL_FROM } from "astro:env/server";

const resend = new Resend(RESEND_API_KEY as string);

export const server = {
  send: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string().optional(),
    }),
    handler: async ({ name, email, message }) => {
      // create the email
      const emailContent = EmailTemplate({ name, email, message });
      const html = await render(emailContent);
      /* const text = await render(emailContent, {
        plainText: true,
      }); */

      // send an email
      const { data, error } = await resend.emails.send({
        from: EMAIL_FROM as string,
        to: email,
        subject: "Gracias por contactarme",
        text: `Hola ${name}, gracias por contactarme, te responderé lo más pronto posible.`,
        html: html,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Email sent successfully",
        data,
        status: 200,
      };
    },
  }),
};