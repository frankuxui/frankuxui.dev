import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";

/**
 * Renderiza Markdown (de Strapi) a HTML, aplicando syntax highlight con Shiki
 * y las mismas opciones que usas en astro.config.ts
 */

export async function renderStrapiMarkdown(markdown: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode as any, {
      theme: "vitesse-light", // puedes cambiar a light/dark dinámicamente
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
    })
    .use(rehypeStringify);

  const file = await processor.process(markdown);
  return String(file);
}

