"use client";

// App Router requiere que error.tsx sea un Client Component.
// Captura errores de renderizado en el árbol de componentes.

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Aquí puedes enviar el error a Sentry u otro servicio de tracking
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-5xl mb-4 select-none">⚠</span>
      <h2 className="font-display font-bold text-display-sm text-ink tracking-tight">
        Algo salió mal
      </h2>
      <p className="mt-3 text-ink-secondary max-w-sm">
        Ocurrió un error inesperado. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-accent text-ink-inverse font-display font-semibold rounded-xl hover:bg-accent-light transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
