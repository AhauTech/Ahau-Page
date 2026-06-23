import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-7xl font-display font-extrabold text-surface-border select-none">
        404
      </span>
      <h1 className="mt-4 font-display font-bold text-display-sm text-ink tracking-tight">
        Página no encontrada
      </h1>
      <p className="mt-3 text-ink-secondary max-w-sm">
        El artículo que buscas no existe o fue movido.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-accent text-ink-inverse font-display font-semibold rounded-xl hover:bg-accent-light transition-colors"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
