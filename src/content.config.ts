import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		id: z.string().optional(),
		slug: z.string(),
		title: z.string(),
		subtitle: z.string().optional(),
		description: z.string().optional(),
		date: z.string().optional(),
		tags: z.array(z.string()).optional(),
		cover: z.object({
			src: z.string(),
			alt: z.string().optional(),
			author: z.string().optional(),
			authorName: z.string().optional(),
		}).optional(),
	}),
});

export const collections = { blog };
