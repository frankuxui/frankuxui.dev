import { siteConfig } from "@/config";
import { Body, Container, Head, Html, Img, Link, Text, Tailwind, Font, Section, Row, Column } from "@react-email/components";
import * as React from "react";

interface Props {
  name: string;
  email: string;
  message?: string;
}

export default function EmailTemplate({ name, email, message }: Props) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Html lang="es" dir="ltr" style={{ backgroundColor: "#f9fafb" }} className="bg-gray-50 dark:bg-gray-950 dark:text-white">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://frankuxui.dev/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://frankuxui.dev/favicon-32x32.png" />

          <title>{`Mensaje recibido a través del formulario de contacto de ${siteConfig.title}`}</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily={"Arial"}
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap%22%20rel=%22stylesheet",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>

        <Body
          className="px-4 pt-6 bg-gray-50 dark:bg-gray-950 dark:text-white"
          style={{
            backgroundColor: "#f9fafb",
            background: "#f9fafb",
            paddingTop: "24px",
          }}
        >
          <Container className="max-w-[40rem]">
            <Link href={siteConfig.siteUrl} className="inline-block">
              <Img src={siteConfig.logo} width="56px" height="56px" className="w-14 rounded overflow-hidden max-w-full" />
            </Link>
            <Text className="text-black text-[20px] sm:text-[24px] font-bold mx-0 my-0 mt-8 dark:text-white">Hola, {name ?? "Person"}</Text>
            <Text className="w-full max-w-lg text-base text-gray-700 dark:text-gray-200">
              Es un placer recibir tu mensaje. En breve me pondré en contacto contigo para resolver tus dudas o atender tus necesidades.
            </Text>
          </Container>

          <Container className="max-w-[40rem]">
            <Section className="max-w-[40rem] p-6 mt-4 rounded bg-white shadow-sm">
              <Row>
                <Column>
                  <Text className="m-0 text-base font-semibold">Nombre:</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="mt-1 text-sm">{name ?? "Nombre Doble Completo"}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="m-0 text-base font-semibold">Email:</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="mt-1 text-sm">{email ?? "fisdray@gmail.com"}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="m-0 text-base font-semibold">Tu mensaje:</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="mt-1 text-sm">
                    {message ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis lectus in lectus aliquam tincidunt. Ut auctor, velit sit amet ultricies."}
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>

          <Container className="max-w-[40rem]">
            <Text className="text-gray-700 text-sm mt-8 p-4 rounded bg-gray-100 dark:bg-gray-900 dark:text-gray-400">
              Este mensaje ha sido generado automáticamente por la web de{" "}
              <Link target="_blank" href={siteConfig.siteUrl} className="text-brand font-semibold text-black dark:text-white">
                frankuxui.com
              </Link>
              . Por favor, no respondas a este correo.
            </Text>
          </Container>

          <Container className="max-w-[40rem]">
            <Text className="text-gray-700 text-sm mt-8 dark:text-gray-500">
              © {new Date().getFullYear()}{" "}
              <Link target="_blank" href={siteConfig.siteUrl} className="text-brand font-semibold text-black dark:text-white">
                frankuxui
              </Link>{" "}
              Todos los derechos reservados
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
