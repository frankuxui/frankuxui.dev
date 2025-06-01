import { useState } from "react";
import { actions } from "astro:actions";
import Success from "@/components/Success";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);

    const result = await actions.send(formData);

    if (result?.data) {
      setSuccess(true);
      console.log("Email sent successfully:", result.data);
    } else if (result.error) {
      setError("Por favor completa todos los campos correctamente.");
    } else {
      console.error("Error sending email:", result);
      setError("Ocurrió un error al enviar el mensaje.");
    }

    setLoading(false);
  }
  const a = false;

  if (a) {
    return (
      <div className="grid text-center place-items-center sm:p-20">
        <Success size={80} color="#4709e0" />
        <div className="flex flex-col items-center justify-start text-center mx-auto w-full max-w-xs gap-2">
          <h2 className="text-2xl font-medium mt-3">Mensaje enviado</h2>
          <p className="text-gray-600 dark:text-gray-300">Gracias por tu mensaje, te responderé lo más pronto posible.</p>
          <button
            onClick={() => {
              setSuccess(false);
              if (typeof window !== "undefined") {
                const form = document?.getElementById("fmhx438f934xj43dd__") as HTMLFormElement;
                form.reset();
              }
            }}
            className="mt-4 inline-flex items-center justify-center rounded-full uppercase font-roboto-mono font-medium border-2 border-transparent cursor-pointer motion-safe:transition-colors motion-safe:duration-500 bg-primary text-primary-foreground hover:bg-primary-hover h-16 px-8 sm:px-10 text-sm sm:text-base"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-6" id="fmhx438f934xj43dd__">
      <div className="grid gap-4">
        <label htmlFor="name" className="font-medium text-lg">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre"
          className="h-16 xl:h-20 px-6 rounded-lg text-base font-roboto-mono placeholder:text-sm font-normal font-medium outline-none ring-0 ring-transparent motion-safe:transition-colors motion-safe:duration-300 border-3 border-transparent focus:border-foreground bg-foreground/5 hover:bg-foreground/8 focus:bg-white dark:focus:placeholder:text-background/50 dark:focus:text-black"
          required
        />
      </div>

      <div className="grid gap-4">
        <label htmlFor="email" className="font-medium text-lg">
          Correo
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Correo electrónico"
          className="h-16 xl:h-20 px-6 rounded-lg text-base font-roboto-mono placeholder:text-sm font-normal font-medium outline-none ring-0 ring-transparent motion-safe:transition-colors motion-safe:duration-300 border-3 border-transparent focus:border-foreground bg-foreground/5 hover:bg-foreground/8 focus:bg-white dark:focus:placeholder:text-background/50 dark:focus:text-black"
          required
        />
      </div>

      <div className="grid gap-4">
        <label htmlFor="message" className="font-medium text-lg">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Deja tu mensaje"
          rows={4}
          cols={30}
          className="resize-none px-6 py-4 rounded-lg text-base font-roboto-mono placeholder:text-sm font-normal font-medium outline-none ring-0 ring-transparent motion-safe:transition-colors motion-safe:duration-300 border-3 border-transparent focus:border-foreground bg-foreground/5 hover:bg-foreground/8 focus:bg-white dark:focus:placeholder:text-background/50 dark:focus:text-black"
          required
        />
      </div>

      <div className="grid gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full uppercase font-roboto-mono font-medium border-2 border-transparent cursor-pointer disabled:pointer-events-none motion-safe:transition-colors motion-safe:duration-500 bg-primary text-primary-foreground hover:bg-primary-hover h-16 px-8 sm:px-10 text-sm sm:text-base"
        >
          {loading ? "Enviando..." : "Envíame un mensaje"}
        </button>
      </div>

      {error && <div className={`text-base font-medium text-red-500`}>{error}</div>}
    </form>
  );
}
