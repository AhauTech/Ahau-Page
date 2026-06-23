// Affiliate product box — structured for good SEO semantics.
// rel="sponsored" informa a Google que es un enlace de afiliado.
import Image from "next/image";
type Props = {
  title: string;
  description?: string;
  ctaLabel: string;
  href: string;
  imageUrl?: string;
  badge?: string;
  price?: string;
};

export function AffiliateBox({
  title,
  description,
  ctaLabel,
  href,
  imageUrl,
  badge,
  price,
}: Props) {
  return (
    <aside
      className="not-prose my-8 bg-surface-raised border border-accent/20 rounded-2xl p-5 shadow-glow-accent"
      aria-label={`Producto recomendado: ${title}`}
    >
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Imagen */}
        {imageUrl && (
          <div className="shrink-0 self-start w-24 h-24 rounded-xl overflow-hidden bg-canvas border border-surface-border flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="w-full h-full object-contain" 
            />
          </div>
        )}

        {/* Contenido */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {badge && (
            <span className="self-start px-2.5 py-0.5 rounded-full bg-accent-muted border border-accent/30 text-accent text-2xs font-display font-semibold uppercase tracking-widest">
              {badge}
            </span>
          )}

          <h3 className="font-display font-bold text-base text-ink leading-snug">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-ink-secondary leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-auto pt-3">
            {price && (
              <span className="font-display font-bold text-lg text-ink">
                {price}
              </span>
            )}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-ink-inverse text-sm font-display font-bold rounded-xl hover:bg-accent-light active:scale-95 transition-all"
            >
              {ctaLabel}
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}