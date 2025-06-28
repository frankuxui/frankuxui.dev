export type Project = {
  id: string;
  type: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  repository: string;
  topics: string[];
  languages: string[];
  technologies: string[];
  cover: string;
  content: {
    title: string;
    description: string | string[];
  };
  keywords: string[];
};

