import type { StrapiImageComponent } from "./StrapiImageComponent";

export type StrapiMission = {
  id: number;
  documentId: string;
  title: string;
  createAt: string;
  updatedAt: string;
  publishedAt: string;
  subtitle: string;
  cover: StrapiImageComponent
};