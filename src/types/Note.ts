export type Note = {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    icon: string;
    accentColor: string;
    tags: string[];
    draft: boolean;
  };
};
