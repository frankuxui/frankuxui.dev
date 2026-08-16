
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isTest = import.meta.env.TEST
export const mode = import.meta.env.MODE

export const AUTHOR = 'Frankuxui'
export const AUTHOR_NAME = 'Frank Esteban Isdray Junco'
export const ALTERNATE_NAME = 'Frankuxui'
export const AUTHOR_ALTERNATE_NAMES = ['Frankuxui', 'Frank Isdray', 'Frank Esteban Isdray Junco']
export const JOB_TITLE = 'Diseñador UX/UI y desarrollador Frontend'

export const SITE_NAME = 'Frankuxui'
export const SITE_TITLE = 'Frankuxui - Front-end developer y diseñador UX/UI'
export const SITE_DESCRIPTION = 'Diseñador UX/UI y frontend developer especializado en Astro, Next.js, React, TypeScript, Markdown, MDX y SEO técnico desde Tarragona, España.'
export const KEYWORDS = 'frankuxui, frankuxui portfolio, frankuxui developer, frankuxui designer, frankuxui front-end developer, frankuxui ux/ui designer, frankuxui tarragona, frankuxui españa, frank esteban, frank esteban isdray junco, frank isdray, frank, developer, figma, ux/ui, ux, ui'
export const KNOWS_ABOUT = [
  'Diseño UX/UI',
  'Sistemas de diseño',
  'Astro',
  'Next.js',
  'React',
  'TypeScript',
  'SEO técnico',
  'Markdown',
  'MDX',
  'Automatización con n8n',
  'Arquitectura web',
  'Experiencia de usuario',
  'Conversion Rate Optimization',
]

export const PRODUCTION_URL = 'https://frankuxui.dev'
export const SITE_URL = isDev ? 'http://localhost:4312' : 'https://frankuxui.dev'

export const DOMAIN = 'frankuxui.dev'

export const ADDRESS_STREET = 'Carrer de la Ciència, 7'
export const ADDRESS_LOCALITY = 'Tarragona'
export const ADDRESS_REGION = 'Catalunya'
export const POSTAL_CODE = '43007'
export const ADDRESS_COUNTRY = 'ES'

export const FRANKUXUI_IMAGE = `${SITE_URL}/frankuxui_frontend_developer_ux_ui_designer.png`
export const DEFAULT_OG_IMAGE = `${SITE_URL}/Opengraph_imagen_de_Frankuxui_desarrollador_frontend_en_Tarragona_Salou.png`
export const LOGO = `${SITE_URL}/frankuxui_frontend_developer_ux_ui_designer_logo.png`

export const siteConfig = {
  author: AUTHOR,
  authorName: AUTHOR_NAME,
  alternateName: ALTERNATE_NAME,
  alternateNames: AUTHOR_ALTERNATE_NAMES,
  jobTitle: JOB_TITLE,
  knowsAbout: KNOWS_ABOUT,
  siteName: SITE_NAME,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  profession: 'Frontend Developer & UX/UI Designer',
  locale: 'es-ES',
  contact: {
    phone: '+34 641932611',
    telephone: '+34 641932611',
    email: 'frankuxui.dev@gmail.com',
  },
  address: {
    street: ADDRESS_STREET,
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
    image: DEFAULT_OG_IMAGE,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  productionURL: PRODUCTION_URL,
  siteUrl: SITE_URL,
  domain: DOMAIN,
  url: {
    base: SITE_URL,
    canonical: `${SITE_URL}/`,
    sitemap: `${SITE_URL}/sitemap.xml`,
    robots: `${SITE_URL}/robots.txt`,
  },
  logo: LOGO,
  keywords: KEYWORDS,
};
