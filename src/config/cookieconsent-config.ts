import type { CookieConsentConfig } from 'vanilla-cookieconsent';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}

export const config: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom left",
      equalWeightButtons: true,
      flipButtons: false
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false
    }
  },
  categories: {
    necessary: {
      readOnly: true
    },
    functionality: {},
    analytics: {
      enabled: true,
      services: {
        ga: {
          label: "Google Analytics",
          onAccept: () => {
            // Grant consent to the Google Analytics service
            console.log("ga4 granted");

            window.gtag("consent", "update", {
              ad_storage: "granted",
              ad_user_data: "granted",
              ad_personalization: "granted",
              analytics_storage: "granted",
            });
          },
          onReject() {
            // Revoke consent to the Google Analytics service
            console.log("ga4 revoked");
            window.gtag("consent", "update", {
              ad_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
              analytics_storage: "denied",
            });
          },
        }
      }
    },
    marketing: {}
  },
  language: {
    default: "es",
    autoDetect: "browser",
    translations: {
      es: {
        consentModal: {
          title: "🍪 Controla tus cookies",
          description: "En este sitio usamos cookies necesarias para que todo funcione bien. También usamos cookies opcionales para estadísticas de uso y, en ocasiones, para mejorar tu experiencia. Tú decides qué aceptar.",
          acceptAllBtn: "Aceptar todo",
          acceptNecessaryBtn: "Rechazar todo",
          showPreferencesBtn: "Gestionar preferencias",
          footer: "<a href=\"/politica-de-privacidad\">Política de privacidad</a>\n<a href=\"/terminos-y-condiciones\">Términos y condiciones</a>"
        },
        preferencesModal: {
          title: "Preferencias de Consentimiento",
          acceptAllBtn: "Aceptar todo",
          acceptNecessaryBtn: "Rechazar todo",
          savePreferencesBtn: "Guardar preferencias",
          closeIconLabel: "Cerrar modal",
          serviceCounterLabel: "Servicios",
          sections: [
            {
              title: "Uso de cookies",
              description: "Las cookies nos ayudan a ofrecer un sitio más seguro y útil. Algunas son esenciales y siempre estarán activas, mientras que otras puedes habilitarlas o deshabilitarlas según tus preferencias."
            },
            {
              title: "Cookies estrictamente necesarias <span class=\"pm__badge\">Siempre activadas</span>",
              description: "Estas cookies son imprescindibles para el funcionamiento básico de la web: seguridad, acceso al servidor y mostrar el contenido correctamente.",
              linkedCategory: "necessary"
            },
            {
              title: "Cookies de funcionalidad",
              description: "Mejoran tu experiencia recordando tus preferencias (como el idioma o el tema de la web) para que todo sea más cómodo en futuras visitas.",
              linkedCategory: "functionality"
            },
            {
              title: "Cookies analíticas",
              description: "Nos permiten entender cómo navegas en frankuxui.dev (páginas más leídas, búsquedas, etc.) usando Google Analytics. Esto nos ayuda a mejorar el contenido y la experiencia de usuario.",
              linkedCategory: "analytics"
            },
            {
              title: "Cookies de marketing",
              description: "Podrían usarse para mostrarte contenido o recursos relevantes en función de tu actividad. Actualmente no usamos campañas publicitarias, pero dejamos esta opción preparada.",
              linkedCategory: "marketing"
            },
            {
              title: "Más información",
              description: "Si quieres saber más sobre cómo tratamos tus datos y cookies, visita nuestra <a class=\"cc__link\" href=\"/politica-de-privacidad\">política de privacidad</a> o <a class=\"cc__link\" href=\"/contacto\">contacta con nosotros</a>."
            }
          ]
        }
      }
    }
  },
  disablePageInteraction: true
}
