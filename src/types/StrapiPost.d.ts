import type { StrapiImageComponent } from "./StrapiImageComponent";
import type { StrapiPostCategory } from "./StrapiPostCategory";

export type StrapiPost = {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  cover: StrapiImageComponent | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  categories: StrapiPostCategory[];
}