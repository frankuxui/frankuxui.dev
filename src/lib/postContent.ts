import { unified, type Processor } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { rehypePrettyCode } from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { VFile } from "vfile";
import { resolveAssetUrl } from "@/lib/blogAssets";

/**
 * El contenido de los posts llega desde la API como **Markdown** (no HTML),
 * así que no pasa por el pipeline de contenido de Astro (Content
 * Collections). Aquí se re-implementa el mismo pipeline remark/rehype que
 * usa `astro.config.ts` para `.md`/`.mdx` (mismo resaltado de código con
 * Shiki vía `rehype-pretty-code`, mismo tema "vitesse-light", mismos ids de
 * encabezado) para que el resultado visual sea idéntico al del resto del
 * sitio.
 *
 * Nota: se usa un pipeline `unified` propio en lugar de
 * `@astrojs/markdown-remark`'s `createMarkdownProcessor` porque este último
 * añade `remarkCollectImages` + `rehypeImages`, pensados para el pipeline de
 * optimización de imágenes de Astro (Content Collections/`<Image />`); sin
 * ese contexto, reescriben el `src` de las imágenes en un atributo interno
 * (`__ASTRO_IMAGE_`) que rompería el `<img>` renderizado aquí.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ProcessedPostContent {
  html: string;
  toc: TocHeading[];
}

const IMG_SRC_PATTERN = /(<img[^>]*\ssrc=)"([^"]+)"/gi;

let processorPromise: Promise<Processor> | null = null;

async function getProcessor(): Promise<Processor> {
  if (!processorPromise) {
    processorPromise = Promise.resolve(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkSmartypants)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypePrettyCode, {
          theme: "vitesse-light",
          showLineNumbers: true,
          keepBackground: true,
          bypassInlineCode: true,
          tokensMap: {
            comment: "astro-shiki-comment",
            keyword: "astro-shiki-keyword",
            string: "astro-shiki-string",
            number: "astro-shiki-number",
          },
          transformers: [
            transformerCopyButton({ visibility: "hover", feedbackDuration: 2500 }),
            {
              code(node: any) {
                node.properties.className = (node.properties.className || []).concat("astro-shiki-code enabledLineNumbers");
                return node;
              },
            },
          ],
        } as any)
        .use(rehypeHeadingIds)
        .use(rehypeRaw)
        .use(rehypeStringify, { allowDangerousHtml: true })
    );
  }
  return processorPromise;
}

function resolveContentImages(html: string, origin: string): string {
  return html.replace(IMG_SRC_PATTERN, (match, prefix, src) => {
    const resolved = resolveAssetUrl(src, origin);
    return resolved ? `${prefix}"${resolved}"` : match;
  });
}

export async function processPostContent(markdown: string, origin: string): Promise<ProcessedPostContent> {
  if (!markdown) return { html: "", toc: [] };

  try {
    const processor = await getProcessor();
    const vfile = new VFile({ value: markdown });
    const result = await processor.process(vfile);

    const html = resolveContentImages(String(result.value), origin);
    const headings = ((result.data as any)?.astro?.headings ?? []) as { depth: number; slug: string; text: string }[];
    const toc: TocHeading[] = headings
      .filter((heading) => heading.depth === 2 || heading.depth === 3)
      .map((heading) => ({ id: heading.slug, text: heading.text, level: heading.depth as 2 | 3 }));

    return { html, toc };
  } catch (error) {
    console.error("[postContent] No se pudo renderizar el Markdown del post", error);
    // Fallback defensivo: mostramos el markdown en crudo dentro de un <pre>
    // en vez de romper la página si el pipeline de render falla.
    return { html: `<pre>${markdown.replace(/</g, "&lt;")}</pre>`, toc: [] };
  }
}
