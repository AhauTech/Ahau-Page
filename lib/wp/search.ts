const WP_REST_URL = process.env.NEXT_PUBLIC_WP_REST_URL;

export type SearchResult = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const url = `${WP_REST_URL}/posts?search=${encodeURIComponent(query)}&per_page=10&_fields=id,slug,title,excerpt,date&status=publish`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const posts = await res.json();

    return posts.map((p: {
      id: number;
      slug: string;
      title: { rendered: string };
      excerpt: { rendered: string };
      date: string;
    }) => ({
      id: p.id,
      slug: p.slug,
      title: p.title.rendered,
      excerpt: p.excerpt.rendered.replace(/<[^>]*>/g, "").trim(),
      date: p.date,
    }));
  } catch {
    return [];
  }
}