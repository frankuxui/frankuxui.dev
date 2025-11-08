import type { StrapiCover } from "./StrapiCover";
import type { StrapiSeo } from "./StrapiSeo";

export type StrapiProject = {
  id: number; // id del proyecto en Strapi
  documentId: string; // id del documento
  type: string; // tipo de contenido ( web | figma | otro ) // luego creare otra coleccion para relacionar
  slug: string; // slug del proyecto
  title: string; // titulo del proyecto
  subtitle: string; // subtitulo ( breve descripcion resumida ) del proyecto
  description: string; // descripcion larga del proyecto
  url: string; // url del proyecto en internet
  repository: string; // url del repositorio del proyecto en GitHub
  topics: string[]; // temas del proyecto
  languages: string[]; // lenguajes usados en el proyecto
  technologies: string[]; // tecnologias usadas en el proyecto
  cover: StrapiCover | null; // imagen de portada del proyecto ( esta imagen sera la url de la imagen que estara en el proyecto )
  content: string; // contenido en markdown del proyecto
  createdAt: string; // fecha de creacion del proyecto
  updatedAt: string; // fecha de actualizacion del proyecto
  publishedAt: string; // fecha de publicacion del proyecto
  seo: StrapiSeo | null; // datos SEO del proyecto
};

