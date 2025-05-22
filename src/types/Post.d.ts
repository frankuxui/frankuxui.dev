export type Post = {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  tags?: string[];
  cover?: {
    src: string;
    alt?: string;
  };
};
export type PostCollection = Post[];
export type PostCollectionMap = Record<string, PostCollection>;