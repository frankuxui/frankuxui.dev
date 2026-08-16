// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypePrettyCode } from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import partytown from '@astrojs/partytown';
import node from '@astrojs/node';

export default defineConfig({
	output: 'server',
	site: 'https://frankuxui.dev',
	adapter: node({
		mode: 'standalone',
	}),
	server: {
		host: true,
		allowedHosts: ['frankuxui.dev', 'www.frankuxui.dev'],
		port: process.env.PORT ? Number(process.env.PORT) : 4312,
	},
	env: {
		schema: {
			N8N_CONTACT_WEBHOOK_URL: envField.string({ context: "server", access: "secret" }),
			N8N_FEEDBACK_WEBHOOK_URL: envField.string({ context: "server", access: "secret" }),
		}
	},
	integrations: [
		mdx(),
		sitemap({
			entryLimit: 10000,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		server: {
			host: true,
			allowedHosts: ['frankuxui.dev', 'www.frankuxui.dev'],
			port: process.env.PORT ? Number(process.env.PORT) : 4312,
		},
		preview: {
			host: true,
			allowedHosts: ['frankuxui.dev', 'www.frankuxui.dev'],
			port: process.env.PORT ? Number(process.env.PORT) : 4312,
		},
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
						comment: 'astro-shiki-comment',
						keyword: 'astro-shiki-keyword',
						string: 'astro-shiki-string',
						number: 'astro-shiki-number',
					},
					transformers: [
						transformerCopyButton({
							visibility: 'hover',
							feedbackDuration: 2500,
						}),
						{
							code(node: any) {
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
