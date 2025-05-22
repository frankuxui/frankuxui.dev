
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isTest = import.meta.env.TEST
export const mode = import.meta.env.MODE

export const AUTHOR = 'Frank Esteban'
export const AUTHOR_NAME = 'Frank Esteban Isdray Junco'
export const ALTERNATE_NAME = 'Frankuxui'

// Información del sitio
export const SITE_NAME = 'Frankuxui'
export const SITE_TITLE = 'Frankuxui - Front-end developer y diseñador UX/UI'
export const SITE_DESCRIPTION = 'Explora el portafolio de Frank Esteban Isdray Junco, conocido como Frankuxui, desarrollador front-end y diseñador UX/UI en Tarragona con más de 8 años de experiencia.'
export const KEYWORDS = 'frankuxui, frankuxui portfolio, frankuxui developer, frankuxui designer, frankuxui front-end developer, frankuxui ux/ui designer, frankuxui tarragona, frankuxui españa'

// URL del sitio
export const SITE_URL = isDev ? 'http://localhost:4312' : 'https://frankuxui.com'

// Información de contacto
export const PHONE = '+34 641932611'
export const EMAIL = 'fisdray@gmail.com'
export const PROFESSION = 'Frontend Developer & UX/UI Designer'

// Address
export const ADDRESS_LOCALITY = 'Salou'
export const ADDRESS_REGION = 'Tarragona'
export const POSTAL_CODE = '43840'
export const ADDRESS_COUNTRY = 'España'

export const PROFILE_FIGMA = 'https://www.figma.com/@frankuxui'
export const PROFILE_GITHUB = 'https://github.com/frankuxui'
export const PROFILE_INSTAGRAM = 'https://instagram.com/frankuxui'
export const PROFILE_LINKEDIN = 'https://www.linkedin.com/in/frankuxui'
export const PROFILE_FACEBOOK = 'https://www.facebook.com/frankuxui'
export const PROFILE_CODEPEN = 'https://codepen.io/frankuxui'
export const PROFILE_CODESANDBOX = 'https://codesandbox.io/u/frankuxui'
export const PROFILE_DRIBBBLE = 'https://dribbble.com/frankuxui'
export const PROFILE_TAILWIND_COMPONENTS = 'https://www.creative-tim.com/twcomponents/u/frankuxui'
export const PROFILE_DEVTO = 'https://dev.to/frankuxui'

export const FRANKUXUI_IMAGE = `${SITE_URL}/images/frankuxui_frontend_developer_ux_ui_designer.png`
export const OPENGRAPH_IMAGE = `${SITE_URL}/images/Opengraph_imagen_de_Frankuxui_desarrollador_frontend_en_Tarragona_Salou.png`
export const FRANKUXUI_LOGO = `${SITE_URL}/images/frankuxui_frontend_developer_ux_ui_designer_logo_redondo.png`


export const siteConfig = {
  author: AUTHOR,
  authorName: AUTHOR_NAME,
  alternateName: ALTERNATE_NAME,
  siteName: SITE_NAME,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  profession: PROFESSION,
  contact: {
    phone: PHONE,
    telephone: PHONE,
    email: EMAIL,
  },
  address: {
    locality: ADDRESS_LOCALITY,
    region: ADDRESS_REGION,
    postalCode: POSTAL_CODE,
    country: ADDRESS_COUNTRY,
  },
  social: {
    figma: PROFILE_FIGMA,
    github: PROFILE_GITHUB,
    instagram: PROFILE_INSTAGRAM,
    linkedin: PROFILE_LINKEDIN,
    facebook: PROFILE_FACEBOOK,
    codepen: PROFILE_CODEPEN,
    codesandbox: PROFILE_CODESANDBOX,
    dribbble: PROFILE_DRIBBBLE,
    tailwindComponents: PROFILE_TAILWIND_COMPONENTS,
    devto: PROFILE_DEVTO,
  },
  meta: {
    description: SITE_DESCRIPTION,
    keywords: KEYWORDS,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}/Opengraph_imagen_de_Frankuxui_desarrollador_frontend_en_Tarragona_Salou.png`,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  siteUrl: SITE_URL,
  url: {
    base: SITE_URL,
    canonical: `${SITE_URL}/`,
    sitemap: `${SITE_URL}/sitemap.xml`,
    robots: `${SITE_URL}/robots.txt`,
  },
  logo: FRANKUXUI_LOGO,
};

