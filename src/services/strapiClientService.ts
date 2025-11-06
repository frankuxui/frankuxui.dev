import { strapi } from '@strapi/client'

/**
 * @function getStrapiClient
 * @description
 * Inicializa y retorna un cliente de Strapi para interactuar con la API de Strapi desde el frontend o backend.
 *
 * - Lee la URL base y el token de autenticación desde variables de entorno.
 * - Lanza un error si no encuentra la configuración necesaria.
 * - Configura el cliente con cabeceras JSON por defecto.
 *
 * @returns {import('@strapi/client').StrapiClient} Instancia configurada del cliente de Strapi.
 *
 * @throws {Error} Si faltan las variables de entorno necesarias:
 *  - `NEXT_PUBLIC_STRAPI_CMS_API` o `STRAPI_CMS_API`
 *  - `NEXT_PUBLIC_STRAPI_CMS_TOKEN` o `STRAPI_CMS_TOKEN`
 *
 * @example
 * ```ts
 * const client = getStrapiClient()
 * const articles = await client.collection('articles').find()
 * ```
 */

export function getStrapiClient() {
  const API_URL = import.meta.env.STRAPI_API
  const TOKEN = import.meta.env.STRAPI_TOKEN

  if (!API_URL || !TOKEN) {
    throw new Error('Strapi API URL and token must be defined in environment variables.')
  }

  return strapi({
    baseURL: API_URL,
    auth: TOKEN,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
