import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs } from "@/lib/wp/posts";
import { getPageBySlug, getAllPageUris } from "@/lib/wp/pages";
import { buildMetadata, buildMetadataFromWPSeo } from "@/lib/seo/metadata";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { PostContent } from "@/components/content/PostContent";
import { ShareButtonsSidebar } from "@/components/ui/ShareButtonsSidebar"; 

export const revalidate = 3600;

// Slugs que nunca deben resolverse aquí (tienen su propia ruta en /app)
const RESERVED_SLUGS = new Set(["categoria", "api"]);

// Slugs que corresponden a páginas legales
const LEGAL_SLUGS = new Set(["aviso-legal", "privacidad", "afiliados", "terminos", "contacto"]);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [postSlugs, pageUris] = await Promise.all([
    getAllPostSlugs(),
    getAllPageUris(),
  ]);

  const pageSlugs = pageUris.filter((uri) => !RESERVED_SLUGS.has(uri));

  // Deduplicar por si algún slug coincide entre posts y páginas
  const all = new Set([...postSlugs, ...pageSlugs]);
  return Array.from(all).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (post) {
    if (post.seo) return buildMetadataFromWPSeo(post.seo, `/${slug}`);
    return buildMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/${slug}`,
      image: post.image?.sourceUrl,
    });
  }

  const page = await getPageBySlug(slug);
  if (page) {
    if (page.seo) return buildMetadataFromWPSeo(page.seo, `/${slug}`);
    return buildMetadata({ title: page.title, path: `/${slug}` });
  }

  return buildMetadata({ title: "Página no encontrada" });
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) notFound();

  // Intenta como post primero — es el caso más común
  const post = await getPostBySlug(slug);
  if (post) {
    return (
      <>
        <ShareButtonsSidebar title={post.title} slug={post.slug} />
        <ArticleLayout post={post}>
          <PostContent content={post.content ?? ""} />
        </ArticleLayout>
      </>
    );
  }

  // Fallback: página estática de WordPress
  const page = await getPageBySlug(slug);
  
  // Dentro del componente, después de resolver si es page (no post):

  if (!page) notFound();

    const isLegal = LEGAL_SLUGS.has(slug);
    return isLegal ? (
      <LegalLayout title={page.title}>
        <PostContent content={page.content ?? ""} />
      </LegalLayout>
    ) : (
      <div className="mx-auto max-w-content px-4 sm:px-6 py-12 sm:py-16">
        <header className="mb-10 pb-10 border-b border-surface-border">
          <h1 className="font-display font-extrabold text-display-sm text-ink tracking-tight leading-tight">
            {page.title}
          </h1>
        </header>
        <PostContent content={page.content ?? ""} />
      </div>
    );
}