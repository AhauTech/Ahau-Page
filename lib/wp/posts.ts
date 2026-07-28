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

interface PostSlugsResponse {
  posts: {
    nodes: { slug: string }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

interface CategorySlugsResponse {
  categories: {
    nodes: { slug: string }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}
// Used in generateStaticParams
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: PostSlugsResponse = await wpFetch(GET_ALL_POST_SLUGS, { first: 100, after }, 86400);

    slugs.push(...data.posts.nodes.map((n) => n.slug));
    hasNextPage = data.posts.pageInfo.hasNextPage;
    after = data.posts.pageInfo.endCursor;
  }

  return slugs;
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: CategorySlugsResponse = await wpFetch(GET_ALL_CATEGORY_SLUGS, { first: 100, after }, 86400);

    slugs.push(...data.categories.nodes.map((n) => n.slug));
    hasNextPage = data.categories.pageInfo.hasNextPage;
    after = data.categories.pageInfo.endCursor;
  }

  return slugs;
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
    const data: {
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
    } = await wpFetch<{
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