import { wpFetch } from "./client";
import { mapPost, mapPosts, mapCategory } from "./mappers";
import {
  GET_POST_BY_SLUG,
  GET_ALL_POST_SLUGS,
  GET_POSTS_FOR_HOME,
  GET_POSTS_BY_CATEGORY,
  GET_ALL_CATEGORY_SLUGS,
} from "./queries";
import type { Post, Category, WPRawPost, PaginatedPosts, PaginatedCategory, WPSeo, PageInfo } from "./types";

// Used in generateStaticParams
export async function getAllPostSlugs(): Promise<string[]> {
  const data = await wpFetch<{ posts: { nodes: { slug: string }[] } }>(
    GET_ALL_POST_SLUGS,
    {},
    86400 // 24h — slugs don't change often
  );
  return data.posts.nodes.map((n) => n.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const data = await wpFetch<{ categories: { nodes: { slug: string }[] } }>(
    GET_ALL_CATEGORY_SLUGS,
    {},
    86400
  );
  return data.categories.nodes.map((n) => n.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const data = await wpFetch<{ post: WPRawPost | null }>(
      GET_POST_BY_SLUG,
      { slug },
      3600
    );
    return data.post ? mapPost(data.post) : null;
  } catch {
    return null;
  }
}

export async function getPostsForHome(
  first = 10,
  after?: string
): Promise<PaginatedPosts> {
  const data = await wpFetch<{
    posts: {
      pageInfo: PageInfo;
      nodes: WPRawPost[];
    };
  }>(GET_POSTS_FOR_HOME, { first, after: after ?? null }, 3600);

  return {
    posts: mapPosts(data.posts.nodes),
    pageInfo: data.posts.pageInfo,
  };
}

export async function getPostsByCategory(
  slug: string,
  first = 10,
  after?: string
): Promise<PaginatedCategory | null> {
  try {
    const data = await wpFetch<{
      category: {
        name: string;
        slug: string;
        description?: string;
        seo?: WPSeo;
        posts: {
          pageInfo: PageInfo;
          nodes: WPRawPost[];
        };
      } | null;
    }>(GET_POSTS_BY_CATEGORY, { slug, first, after: after ?? null }, 3600);

    if (!data.category) return null;

    return {
      name: data.category.name,
      slug: data.category.slug,
      description: data.category.description,
      seo: data.category.seo,
      posts: mapPosts(data.category.posts.nodes),
      pageInfo: data.category.posts.pageInfo,
    };
  } catch {
    return null;
  }
}