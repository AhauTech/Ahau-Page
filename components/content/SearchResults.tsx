import Link from "next/link";
import type { SearchResult } from "@/lib/wp/search";

type Props = {
  results: SearchResult[];
  query: string;
};

export function SearchResults({ results, query }: Props) {
  if (!query) {
    return (
      <p className="text-ink-muted font-display text-sm">
        Escribe algo para buscar artículos.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl mb-4 select-none">✦</p>
        <p className="font-display font-semibold text-ink">
          Sin resultados para &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm text-ink-muted mt-2">
          Prueba con otras palabras clave.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-ink-muted font-display mb-8">
        {results.length} resultado{results.length !== 1 ? "s" : ""} para{" "}
        <span className="text-ink font-semibold">&ldquo;{query}&rdquo;</span>
      </p>
      <ul className="space-y-4">
        {results.map((result) => (
          <li key={result.id}>
            <Link
              href={`/${result.slug}`}
              className="group flex flex-col gap-1.5 p-5 bg-surface rounded-2xl border border-surface-border hover:border-accent/30 hover:shadow-card transition-all"
            >
              <time
                dateTime={result.date}
                className="text-2xs font-display font-semibold uppercase tracking-widest text-ink-muted"
              >
                {new Date(result.date).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <h2 className="font-display font-bold text-base text-ink group-hover:text-accent transition-colors">
                {result.title}
              </h2>
              {result.excerpt && (
                <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2">
                  {result.excerpt}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}