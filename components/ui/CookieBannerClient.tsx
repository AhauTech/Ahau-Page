"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "ahau-cookie-consent";

export function CookieBannerClient() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    // Aquí puedes inicializar Google Analytics u otros scripts
    // window.gtag?.("consent", "update", { analytics_storage: "granted" });
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl bg-surface border border-surface-border rounded-2xl shadow-card-hover p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-semibold text-ink mb-1">
              Este sitio usa cookies
            </p>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Usamos cookies para analizar el tráfico y mejorar tu experiencia.
              Puedes aceptar o rechazar el uso de cookies no esenciales.{" "}
              <Link
                href="/privacidad"
                className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
              >
                Política de privacidad
              </Link>
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={reject}
              className="px-4 py-2 rounded-xl border border-surface-border bg-canvas text-sm font-display font-medium text-ink-secondary hover:text-ink hover:border-ink-muted transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 rounded-xl bg-accent text-ink-inverse text-sm font-display font-bold hover:bg-accent-light transition-all"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}