import type { Post } from "@/types/Post";
import { getCollection } from "astro:content";

export async function getPosts() {
  const posts: Post[] = await getCollection("blog")
    .then((entries) =>
      entries.map(({ data, id }) => ({
        id: id ?? "",
        title: data.title ?? "",
        slug: data.slug ?? "",
        subtitle: data.subtitle ?? "",
        description: data.description ?? "",
        cover: data.cover,
        tags: data.tags ?? [],
        date: data.date?.toString() ?? "",
      }) as Post)
    )
    .then((posts) =>
      posts.sort((a, b) => {
        const dateA = new Date(a.date ?? "");
        const dateB = new Date(b.date ?? "");
        return dateB.getTime() - dateA.getTime();
      })
    );

  return posts;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostById(id: string) {
  const posts = await getPosts();
  return posts.find((post) => post.id === id);
}

export async function getPostTags() {
  const posts = await getPosts();
  const allTags = posts.flatMap((post) => post.tags);
  const uniqueTags = Array.from(new Set(allTags));

  return uniqueTags
    .sort((a, b) => (a ?? "").localeCompare(b ?? ""))
    .map((tag) => ({
      name: tag?.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      slug: tag?.toLowerCase(),
    }));
}
