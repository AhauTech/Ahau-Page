import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategorySlugs, getPostsByCategory } from "@/lib/wp/posts";
import { buildMetadata, buildMetadataFromWPSeo } from "@/lib/seo/metadata";
import { PostCard } from "@/components/content/PostCard";
import { Pagination } from "@/components/ui/Pagination";

export const revalidate = 3600;

const PER_PAGE = 9;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ after?: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostsByCategory(slug);
  if (!data) return buildMetadata({ title: "Categoría no encontrada" });
  if (data.seo) return buildMetadataFromWPSeo(data.seo, `/categoria/${slug}`);
  return buildMetadata({
    title: data.name,
    description: data.description,
    path: `/categoria/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { after } = await searchParams;
  const data = await getPostsByCategory(slug, PER_PAGE, after ?? undefined);

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-wide px-4 sm:px-6 py-12">
      <header className="mb-12 pb-12 border-b border-surface-border">
        <span className="inline-block text-2xs font-display font-semibold uppercase tracking-widest text-accent mb-3">
          Categoría
        </span>
        <h1 className="font-display font-extrabold text-display-md text-ink tracking-tight leading-none">
          {data.name}
        </h1>
        {data.description && (
          <p className="mt-4 text-lg text-ink-secondary max-w-2xl leading-relaxed">
            {data.description}
          </p>
        )}
      </header>

      {data.posts.length > 0 ? (
        <>
          <div className="post-grid">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            hasNextPage={data.pageInfo.hasNextPage}
            endCursor={data.pageInfo.endCursor}
            basePath={`/categoria/${slug}`}
            currentCursor={after}
          />
        </>
      ) : (
        <div className="text-center py-20 text-ink-muted">
          <p className="text-4xl mb-4">✦</p>
          <p className="font-display">No hay artículos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}