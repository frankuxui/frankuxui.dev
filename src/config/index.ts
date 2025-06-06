
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isTest = import.meta.env.TEST
export const mode = import.meta.env.MODE

export const AUTHOR = 'Frank Esteban'
export const AUTHOR_NAME = 'Frank Esteban Isdray Junco'
export const ALTERNATE_NAME = 'Frankuxui'

export const SITE_NAME = 'Frankuxui'
export const SITE_TITLE = 'Frankuxui - Front-end developer y diseñador UX/UI'
export const SITE_DESCRIPTION = 'Explora el portafolio de Frank Esteban Isdray Junco, conocido como Frankuxui, desarrollador front-end y diseñador UX/UI en Tarragona con más de 8 años de experiencia.'
export const KEYWORDS = 'frankuxui, frankuxui portfolio, frankuxui developer, frankuxui designer, frankuxui front-end developer, frankuxui ux/ui designer, frankuxui tarragona, frankuxui españa, frank esteban, frank, developer, figma, ux/ui, ux, ui'

// URL del sitio
export const SITE_URL = isDev ? 'http://localhost:4312' : 'https://frankuxui.dev'

// Address
export const ADDRESS_LOCALITY = 'Salou'
export const ADDRESS_REGION = 'Tarragona'
export const POSTAL_CODE = '43840'
export const ADDRESS_COUNTRY = 'España'

export const FRANKUXUI_IMAGE = `${SITE_URL}/frankuxui_frontend_developer_ux_ui_designer.png`
export const OG_IMAGE = `${SITE_URL}/Opengraph_imagen_de_Frankuxui_desarrollador_frontend_en_Tarragona_Salou.png`
export const LOGO = `${SITE_URL}/frankuxui_frontend_developer_ux_ui_designer_logo.png`


export const siteConfig = {
  author: AUTHOR,
  authorName: AUTHOR_NAME,
  alternateName: ALTERNATE_NAME,
  siteName: SITE_NAME,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  profession: 'Frontend Developer & UX/UI Designer',
  contact: {
    phone: '+34 641932611',
    telephone: '+34 641932611',
    email: 'fisdray@gmail.com',
  },
  address: {
    locality: ADDRESS_LOCALITY,
    region: ADDRESS_REGION,
    postalCode: POSTAL_CODE,
    country: ADDRESS_COUNTRY,
  },
  social: {
    figma: 'https://www.figma.com/@frankuxui',
    github: 'https://github.com/frankuxui',
    instagram: 'https://instagram.com/frankuxui',
    linkedin: 'https://www.linkedin.com/in/frankuxui',
    facebook: 'https://www.facebook.com/frankuxui',
    codepen: 'https://codepen.io/frankuxui',
    codesandbox: 'https://codesandbox.io/u/frankuxui',
    dribbble: 'https://dribbble.com/frankuxui',
    tailwindComponents: 'https://www.creative-tim.com/twcomponents/u/frankuxui',
    devto: 'https://dev.to/frankuxui',
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
    image: OG_IMAGE,
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
  logo: LOGO,
  keywords: KEYWORDS,
};

