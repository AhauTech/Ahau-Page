import Link from "next/link";

type Props = {
  hasNextPage: boolean;
  endCursor: string | null;
  basePath: string;
  currentCursor?: string;
};

export function Pagination({
  hasNextPage,
  endCursor,
  basePath,
  currentCursor,
}: Props) {
  if (!hasNextPage && !currentCursor) return null;

  const nextHref =
    hasNextPage && endCursor
      ? `${basePath}?after=${encodeURIComponent(endCursor)}`
      : null;

  // Volver al inicio (sin cursor)
  const prevHref = currentCursor ? basePath : null;

  return (
    <nav
      className="flex items-center justify-between mt-14 pt-8 border-t border-surface-border"
      aria-label="Paginación"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surface-border bg-surface text-sm font-display font-semibold text-ink-secondary hover:border-accent/50 hover:text-ink transition-all"
        >
          ← Página anterior
        </Link>
      ) : (
        <span />
      )}

      {nextHref && (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-ink-inverse text-sm font-display font-semibold hover:bg-accent-light transition-all"
        >
          Siguiente página →
        </Link>
      )}
    </nav>
  );
}