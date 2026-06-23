// Raw types coming from WPGraphQL — mirror the GraphQL schema
export type WPImage = {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
};

export type WPSeo = {
  title: string;
  metaDesc: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: { sourceUrl: string };
  canonical?: string;
};

export type WPCategory = {
  name: string;
  slug: string;
};

export type WPRawPost = {
  databaseId: number;
  slug: string;
  title: string;
  date: string;
  modified?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: { node: WPImage };
  categories?: { nodes: WPCategory[] };
  seo?: WPSeo;
};

// Normalized application types — what the rest of the app uses
export type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  modified?: string;
  content?: string;
  excerpt?: string;
  image?: WPImage;
  categories: WPCategory[];
  seo?: WPSeo;
};

export type Category = {
  name: string;
  slug: string;
  description?: string;
  seo?: WPSeo;
  posts: Post[];
};
export type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type PaginatedPosts = {
  posts: Post[];
  pageInfo: PageInfo;
};

export type PaginatedCategory = {
  name: string;
  slug: string;
  description?: string;
  seo?: WPSeo;
  posts: Post[];
  pageInfo: PageInfo;
};