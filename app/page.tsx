import type { Metadata } from "next";
import { getPostsForHome } from "@/lib/wp/posts";
import { buildMetadata } from "@/lib/seo/metadata";
import { PostCard } from "@/components/content/PostCard";
import { Pagination } from "@/components/ui/Pagination";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "AhauTech — Tecnología, IA y recursos para crecer online",
  description:
    "AhauTech: análisis de tecnología, inteligencia artificial, herramientas digitales y estrategias para generar ingresos online. Contenido práctico para desarrolladores y emprendedores.",
  path: "/",
});

const PER_PAGE = 9;

type Props = {
  searchParams: Promise<{ after?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { after } = await searchParams;
  const { posts, pageInfo } = await getPostsForHome(PER_PAGE, after);

  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid-subtle opacity-100" aria-hidden />
        <div className="relative mx-auto max-w-wide px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent-muted text-accent text-xs font-display font-semibold tracking-wider uppercase mb-6">
              Tecnología · IA · Recursos
            </span>
            <h1 className="font-display font-extrabold text-display-md sm:text-display-lg text-ink leading-none tracking-tight">
              Crece online con{" "}
              <em className="not-italic text-accent">tecnología real</em>
            </h1>
            <p className="mt-5 text-lg text-ink-secondary max-w-xl leading-relaxed">
              Análisis, herramientas e ideas probadas para construir ingresos
              con IA y contenido digital.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-wide px-4 sm:px-6 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-bold text-display-sm text-ink tracking-tight">
            Últimos artículos
          </h2>
        </div>

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination
          hasNextPage={pageInfo.hasNextPage}
          endCursor={pageInfo.endCursor}
          basePath="/"
          currentCursor={after}
        />
      </section>
    </>
  );
}