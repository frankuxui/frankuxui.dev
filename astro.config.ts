// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypePrettyCode } from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';


// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: 'https://frankuxui.dev',
	adapter: vercel(),
	env: {
		schema: {
			RESEND_API: envField.string({ context: "server", access: "secret" }),
			RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
			SITE_URL: envField.string({ context: "server", access: "public" }),
		}
	},
	integrations: [
		mdx(),
		react(),
		sitemap({
			entryLimit: 10000,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		})
	],
	vite: {
		plugins: [
			tailwindcss()
		]
	},
	markdown: {
		syntaxHighlight: false,
		shikiConfig: {
			themes: {
				light: "vitesse-light",
				dark: "vitesse-dark",
			}
		},
		rehypePlugins: [
			[
				rehypePrettyCode,

				{
					theme: "vitesse-light",
					showLineNumbers: true,
					keepBackground: true,
					bypassInlineCode: true,
					tokensMap: {
						'comment': 'astro-shiki-comment',
						'keyword': 'astro-shiki-keyword',
						'string': 'astro-shiki-string',
						'number': 'astro-shiki-number',
					},
					// Use the `transformers` option to add a copy button
					transformers: [
						transformerCopyButton({
							visibility: 'hover',
							feedbackDuration: 2_500,
						}),

						{
							code(node: any) {
								// Add a class to the code element for styling
								node.properties.className = (node.properties.className || []).concat('astro-shiki-code enabledLineNumbers');
								return node;
							},
						},
					],
				},
			],
		],
	},
});
