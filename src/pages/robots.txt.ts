import type { APIRoute } from "astro";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Amazonbot",
  "Applebot-Extended",
  "CCBot",
  "FacebookBot",
  "Twitterbot",
  "LinkedInBot",
  "Bytespider",
] as const;

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Disallow: /search
Disallow: /?q=
Disallow: /*?*
Disallow: /api/
Allow: /

${AI_CRAWLERS.map((userAgent) => `User-agent: ${userAgent}\nAllow: /`).join("\n\n")}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL("https://frankuxui.dev");
  const sitemapURL = new URL("sitemap-index.xml", siteUrl);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
