import { getSecret } from "astro:env/server";
import { extractImageUrl, resolveAssetUrl } from "@/lib/blogAssets";
import { processPostContent, type TocHeading } from "@/lib/postContent";

/**
 * Cliente para la API de blog de frankuxui.com (`/api/v1/blog`).
 *
 * La API es un servicio externo que no controlamos desde este repo, así que
 * el parseo de la respuesta es deliberadamente defensivo: aceptamos varios
 * nombres de campo habituales (title/name, slug, excerpt/summary,
 * coverImage/image, category/categories, publishedAt/date, content/body,
 * meta/pagination, envoltorios `{ data: ... }`, etc.) para no romper el sitio
 * si la forma exacta del JSON difiere ligeramente de lo esperado.
 *
 * Si algún día se confirma la forma exacta de la respuesta, esta capa de
 * normalización puede simplificarse.
 */

const DEFAULT_PAGE_SIZE = 9;

export interface BlogCategoryRef {
  slug: string;
  name: string;
}

export interface BlogCategory extends BlogCategoryRef {
  count?: number;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  coverImageCaption: string | null;
  categories: BlogCategoryRef[];
  publishedAt: string | null;
  updatedAt: string | null;
  readingTime: string | null;
  author: string | null;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  toc: TocHeading[];
  seoTitle: string | null;
  seoDescription: string | null;
  /** Puede ser una ruta relativa a frankuxui.dev (no a la API del blog); se deja sin resolver para que <Root>/<BaseHead> la resuelvan contra Astro.site. */
  seoImage: string | null;
}

export interface BlogPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface BlogPostsResult {
  posts: BlogPostSummary[];
  pagination: BlogPagination;
}

export interface GetBlogPostsParams {
  page?: number;
  pageSize?: number;
  category?: string[] | string;
  q?: string;
}

export class BlogApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BlogApiError";
    this.status = status;
  }
}

function getApiBaseUrl(): string {
  const configured = getSecret("BLOG_API_URL");
  return (configured || "https://frankuxui.com/api/v1/blog").replace(/\/+$/, "");
}

function getApiToken(): string {
  return getSecret("BLOG_API_TOKEN") ?? "";
}

function getApiOrigin(): string {
  try {
    return new URL(getApiBaseUrl()).origin;
  } catch {
    return "https://frankuxui.com";
  }
}

async function blogFetch(path: string, searchParams?: Record<string, string | undefined>): Promise<{ status: number; data: any }> {
  const url = new URL(`${getApiBaseUrl()}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, value);
    }
  }

  const token = getApiToken();

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (error) {
    console.error("[blogApiService] Error de red al llamar a la API del blog", { url: url.toString(), error });
    throw new BlogApiError("No se pudo conectar con la API del blog");
  }

  if (response.status === 404) {
    return { status: 404, data: null };
  }

  if (!response.ok) {
    console.error("[blogApiService] La API del blog respondió con error", { url: url.toString(), status: response.status });
    throw new BlogApiError(`La API del blog respondió con el código ${response.status}`, response.status);
  }

  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

// --- normalización defensiva ---

function pick<T = unknown>(source: Record<string, any> | undefined | null, keys: string[]): T | undefined {
  if (!source || typeof source !== "object") return undefined;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];
  }
  return undefined;
}

function unwrap(raw: any): Record<string, any> {
  if (!raw || typeof raw !== "object") return {};
  if (raw.attributes && typeof raw.attributes === "object") return { id: raw.id, ...raw.attributes };
  if (raw.data && typeof raw.data === "object" && !Array.isArray(raw.data)) return unwrap(raw.data);
  return raw;
}

function normalizeCategoryRef(raw: any): BlogCategoryRef | null {
  if (typeof raw === "string") return { slug: raw, name: raw };
  const item = unwrap(raw);
  const slug = pick<string>(item, ["slug", "categorySlug", "value"]);
  if (!slug) return null;
  const name = pick<string>(item, ["name", "title", "label"]) ?? slug;
  return { slug, name };
}

function normalizeCategories(raw: any): BlogCategoryRef[] {
  const list = Array.isArray(raw) ? raw : pick<any[]>(raw, ["categories", "category"]);
  if (!Array.isArray(list)) return [];
  return list.map(normalizeCategoryRef).filter((category): category is BlogCategoryRef => category !== null);
}

/**
 * Extrae la imagen principal del post. La API real la expone como
 * `media: [{ url, alt, caption, width, height }]` (primer elemento = imagen
 * destacada). Se mantienen además varios nombres de campo "clásicos" como
 * fallback por si un endpoint distinto devuelve otra forma.
 */
function normalizeCoverImage(item: Record<string, any>, origin: string): { url: string | null; alt: string | null; caption: string | null } {
  const media = Array.isArray(item.media) ? item.media : pick<any[]>(item, ["media", "images", "gallery"]);
  const firstMedia = Array.isArray(media) ? unwrap(media[0]) : null;

  if (firstMedia) {
    const url = resolveAssetUrl(extractImageUrl(firstMedia), origin);
    if (url) {
      return {
        url,
        alt: pick<string>(firstMedia, ["alt", "alternativeText"]) ?? null,
        caption: pick<string>(firstMedia, ["caption", "credit"]) ?? null,
      };
    }
  }

  const legacyRaw = pick<any>(item, ["coverImage", "cover", "image", "thumbnail", "featuredImage"]);
  return { url: resolveAssetUrl(extractImageUrl(legacyRaw), origin), alt: null, caption: null };
}

function normalizePostSummary(raw: any, origin: string): BlogPostSummary | null {
  const item = unwrap(raw);
  const slug = pick<string>(item, ["slug", "id"]);
  const title = pick<string>(item, ["title", "name"]);
  if (!slug || !title) return null;

  const cover = normalizeCoverImage(item, origin);

  return {
    slug,
    title,
    subtitle: pick<string>(item, ["subtitle"]) ?? null,
    excerpt: pick<string>(item, ["description", "excerpt", "summary", "seoDescription"]) ?? "",
    coverImage: cover.url,
    coverImageAlt: cover.alt,
    coverImageCaption: cover.caption,
    categories: normalizeCategories(item.categories ?? item.category ?? []),
    publishedAt: pick<string>(item, ["publishedAt", "publishDate", "date", "createdAt"]) ?? null,
    updatedAt: pick<string>(item, ["updatedAt", "updateDate", "modifiedAt"]) ?? null,
    readingTime: pick<string | number>(item, ["readingTime", "readTime", "readingTimeMinutes"]) != null ? String(pick(item, ["readingTime", "readTime", "readingTimeMinutes"])) : null,
    author: pick<string>(item, ["author", "authorName"]) ?? null,
  };
}

function normalizePostDetail(raw: any, origin: string): Omit<BlogPostDetail, "toc"> | null {
  const summary = normalizePostSummary(raw, origin);
  if (!summary) return null;
  const item = unwrap(raw);
  const content = pick<string>(item, ["content", "html", "body", "contentHtml"]) ?? "";

  const seoRaw = pick<any>(item, ["seo"]);
  const seo = seoRaw ? unwrap(seoRaw) : null;
  const seoImageRaw = seo ? pick<any>(seo, ["image"]) : null;

  return {
    ...summary,
    content,
    seoTitle: (seo && pick<string>(seo, ["title"])) ?? null,
    seoDescription: (seo && pick<string>(seo, ["description"])) ?? null,
    seoImage: seoImageRaw ? extractImageUrl(seoImageRaw) : null,
  };
}

function normalizePagination(raw: any, fallbackPage: number, fallbackPageSize: number, itemCount: number): BlogPagination {
  const meta = unwrap(pick(raw, ["meta", "pagination"]) ?? raw);
  const page = Number(pick(meta, ["page", "currentPage"])) || fallbackPage;
  const pageSize = Number(pick(meta, ["pageSize", "perPage", "limit"])) || fallbackPageSize;
  const totalRaw = Number(pick(meta, ["total", "totalItems", "count"]));
  const total = Number.isFinite(totalRaw) ? totalRaw : itemCount;
  const totalPagesRaw = Number(pick(meta, ["totalPages", "pageCount"]));
  const totalPages = Number.isFinite(totalPagesRaw) && totalPagesRaw > 0 ? totalPagesRaw : Math.max(1, Math.ceil(total / (pageSize || DEFAULT_PAGE_SIZE)));

  return { page, pageSize, total, totalPages };
}

// --- API pública ---

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data } = await blogFetch("/categories");
    const list = Array.isArray(data) ? data : pick<any[]>(data, ["data", "categories", "items"]);
    if (!Array.isArray(list)) return [];

    return list
      .map((raw) => {
        const ref = normalizeCategoryRef(raw);
        if (!ref) return null;
        const item = unwrap(raw);
        const countRaw = Number(pick(item, ["count", "postsCount", "total"]));
        return { ...ref, count: Number.isFinite(countRaw) ? countRaw : undefined };
      })
      .filter((category): category is BlogCategory => category !== null);
  } catch (error) {
    console.error("[blogApiService] getBlogCategories falló", error);
    return [];
  }
}

export async function getBlogPosts(params: GetBlogPostsParams = {}): Promise<BlogPostsResult> {
  const page = params.page && params.page > 0 ? Math.floor(params.page) : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? Math.floor(params.pageSize) : DEFAULT_PAGE_SIZE;
  const category = Array.isArray(params.category) ? params.category.filter(Boolean).join(",") : params.category;

  try {
    const { data } = await blogFetch("/posts", {
      page: String(page),
      pageSize: String(pageSize),
      category: category || undefined,
      q: params.q || undefined,
    });

    const origin = getApiOrigin();
    const list = Array.isArray(data) ? data : pick<any[]>(data, ["data", "posts", "items"]);
    const posts = Array.isArray(list)
      ? list.map((item) => normalizePostSummary(item, origin)).filter((post): post is BlogPostSummary => post !== null)
      : [];
    const pagination = normalizePagination(data, page, pageSize, posts.length);

    return { posts, pagination };
  } catch (error) {
    console.error("[blogApiService] getBlogPosts falló", error);
    return { posts: [], pagination: { page, pageSize, total: 0, totalPages: 1 } };
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const { status, data } = await blogFetch(`/posts/${encodeURIComponent(slug)}`);
    if (status === 404 || !data) return null;

    const raw = pick(data, ["data", "post"]) ?? data;
    const origin = getApiOrigin();
    const detail = normalizePostDetail(raw, origin);
    if (!detail) return null;

    const processed = await processPostContent(detail.content, origin);
    return { ...detail, content: processed.html, toc: processed.toc };
  } catch (error) {
    console.error("[blogApiService] getBlogPostBySlug falló", { slug, error });
    return null;
  }
}
