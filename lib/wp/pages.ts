// Queries, tipos y acceso a datos para páginas estáticas de WordPress.
// Separado de posts.ts porque tiene ciclo de vida y campos diferentes.

import { wpFetch } from "./client";
import type { WPSeo } from "./types";

// ── Queries ────────────────────────────────────────────────────────────────

const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      databaseId
      slug
      title
      content
      date
      modified
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        canonical
      }
    }
  }
`;

const GET_ALL_PAGE_SLUGS = `
  query GetAllPageSlugs($first: Int = 100, $after: String) {
    pages(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        uri
      }
    }
  }
`;

// ── Types ──────────────────────────────────────────────────────────────────

type WPRawPage = {
  databaseId: number;
  slug: string;
  title: string;
  content?: string;
  date: string;
  modified?: string;
  seo?: WPSeo;
};

export type Page = {
  id: number;
  slug: string;
  title: string;
  content?: string;
  date: string;
  modified?: string;
  seo?: WPSeo;
};

// ── Mapper ─────────────────────────────────────────────────────────────────

function mapPage(raw: WPRawPage): Page {
  return {
    id: raw.databaseId,
    slug: raw.slug,
    title: raw.title,
    content: raw.content,
    date: raw.date,
    modified: raw.modified,
    seo: raw.seo,
  };
}

// ── Accessors ──────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const data = await wpFetch<{ page: WPRawPage | null }>(
      GET_PAGE_BY_SLUG,
      { slug },
      86400 // páginas estáticas cambian poco — 24h
    );
    return data.page ? mapPage(data.page) : null;
  } catch {
    return null;
  }
}

export async function getAllPageUris(): Promise<string[]> {
  const uris: string[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: {
      pages: {
        nodes: { uri: string }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } = await wpFetch<{
      pages: {
        nodes: { uri: string }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>(GET_ALL_PAGE_SLUGS, { first: 100, after }, 3600, ["sitemap"]);

    uris.push(...data.pages.nodes.map((n) => n.uri.replace(/^\/|\/$/g, "")));
    hasNextPage = data.pages.pageInfo.hasNextPage;
    after = data.pages.pageInfo.endCursor;
  }

  return uris;
}
