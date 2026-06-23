import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/wp/types";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group flex flex-col bg-surface rounded-2xl border border-surface-border overflow-hidden shadow-card hover:shadow-card-hover hover:border-accent/30 transition-all duration-300">
      {/* Thumbnail */}
      {post.image ? (
        <Link href={`/${post.slug}`} className="block overflow-hidden aspect-video">
          <Image
            src={post.image.sourceUrl}
            alt={post.image.altText}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      ) : (
        <div className="aspect-video bg-canvas-muted flex items-center justify-center">
          <span className="text-4xl opacity-20 select-none">✦</span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category badge */}
        {post.categories.length > 0 && (
          <Link
            href={`/categoria/${post.categories[0].slug}`}
            className="self-start text-2xs font-display font-semibold uppercase tracking-widest text-accent hover:text-accent-light transition-colors"
          >
            {post.categories[0].name}
          </Link>
        )}

        {/* Title */}
        <h2 className="font-display font-bold text-base leading-snug text-ink group-hover:text-accent transition-colors line-clamp-2">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-surface-border">
          <time
            dateTime={post.date}
            className="text-xs text-ink-muted font-display"
          >
            {formattedDate}
          </time>
          <Link
            href={`/${post.slug}`}
            className="text-xs font-display font-semibold text-ink-secondary hover:text-accent transition-colors"
            aria-label={`Leer: ${post.title}`}
          >
            Leer →
          </Link>
        </div>
      </div>
    </article>
  );
}
