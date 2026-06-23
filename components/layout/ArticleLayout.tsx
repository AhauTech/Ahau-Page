import Link from "next/link";
import type { ReactNode } from "react";
import type { Post } from "@/lib/wp/types";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ReaderSettingsMobile } from "@/components/ui/ReaderSettings";

type Props = {
  post: Post;
  children: ReactNode;
};

export function ArticleLayout({ post, children }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-wide px-4 sm:px-6 py-12 relative">
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">

        {/* ── Main column ── */}
        <div className="min-w-0">
          {/* Breadcrumb */}
          {post.categories.length > 0 && (
            <nav className="flex items-center gap-2 mb-6 flex-wrap" aria-label="Breadcrumb">
              <Link
                href="/"
                className="text-sm text-ink-muted hover:text-ink transition-colors font-display"
              >
                Inicio
              </Link>
              <span className="text-ink-muted text-sm" aria-hidden>/</span>
              {post.categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="text-2xs font-display font-semibold text-accent hover:text-accent-light transition-colors uppercase tracking-widest"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Title */}
          <h1 className="font-display font-extrabold text-display-sm sm:text-display-md text-ink leading-tight tracking-tight mb-5">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-surface-border flex-wrap">
            <time dateTime={post.date} className="text-sm text-ink-muted font-display">
              {formattedDate}
            </time>
            {post.modified && post.modified !== post.date && (
              <>
                <span className="text-ink-muted text-xs" aria-hidden>·</span>
                <span className="text-xs text-ink-muted font-display">
                  Actualizado{" "}
                  {new Date(post.modified).toLocaleDateString("es-MX", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          {/* WordPress HTML content */}
          <div className="wp-content">{children}</div>
        </div>

        {/* ── Sidebar (server-rendered shell + client ToC) ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            {/* Table of contents — Client Component */}
            
            <TableOfContents />

            {/* Category pills */}
            {post.categories.length > 0 && (
              <div className="bg-surface rounded-2xl border border-surface-border p-5">
                <p className="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted mb-3">
                  Categorías
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categoria/${cat.slug}`}
                      className="px-3 py-1 text-xs font-display font-semibold bg-canvas-muted border border-surface-border rounded-full text-ink-secondary hover:border-accent/50 hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
      {/* FAB configuración — desktop: esquina inferior izquierda del sidebar */}
      {/* Móvil: se oculta aquí, lo maneja ShareButtonsSidebar */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <ReaderSettingsMobile />
      </div>
    </div>
  );
}
