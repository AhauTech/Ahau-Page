import type { ReactNode } from "react";

type Props = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 pb-8 border-b border-surface-border">
        <p className="text-2xs font-display font-semibold uppercase tracking-widest text-accent mb-3">
          Legal
        </p>
        <h1 className="font-display font-extrabold text-display-sm text-ink tracking-tight leading-tight">
          {title}
        </h1>
        {lastUpdated && (
          <p className="mt-3 text-sm text-ink-muted font-display">
            Última actualización: {lastUpdated}
          </p>
        )}
      </header>
      <div className="wp-content">{children}</div>
    </div>
  );
}