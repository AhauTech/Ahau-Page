import type { Post, Category, WPRawPost } from "./types";

export function mapPost(raw: WPRawPost): Post {
  return {
    id: raw.databaseId,
    slug: raw.slug,
    title: raw.title,
    date: raw.date,
    modified: raw.modified,
    content: raw.content,
    excerpt: raw.excerpt ? stripHtmlTags(raw.excerpt) : undefined,
    image: raw.featuredImage?.node,
    categories: raw.categories?.nodes ?? [],
    seo: raw.seo,
  };
}

export function mapPosts(raws: WPRawPost[]): Post[] {
  return raws.map(mapPost);
}

export function mapCategory(raw: {
  name: string;
  slug: string;
  description?: string;
  seo?: Category["seo"];
  posts: { nodes: WPRawPost[] };
}): Category {
  return {
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    seo: raw.seo,
    posts: mapPosts(raw.posts.nodes),
  };
}

// WordPress wraps excerpts in <p> tags — strip them for meta descriptions
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
