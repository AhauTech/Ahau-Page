"use client";

// Client Component justificado: maneja estado de apertura/cierre del menú.
// Se mantiene mínimo — solo UI de toggle, sin lógica de negocio.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

type Props = {
  links: NavLink[];
};

export function MobileMenu({ links }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú al navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquea scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-raised transition-colors"
      >
        <span className="block w-5 h-px bg-current mb-1.5 transition-transform" />
        <span className="block w-5 h-px bg-current mb-1.5 transition-transform" />
        <span className="block w-5 h-px bg-current transition-transform" />
      </button>

      {/* Overlay + panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-canvas/60"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-canvas) 80%, transparent)" }}
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Slide-in panel */}
          <nav
            className="fixed top-16 left-0 right-0 z-50 bg-canvas border-b border-surface-border px-4 py-6 flex flex-col gap-1"
            aria-label="Navegación móvil"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 font-display font-semibold text-ink-secondary hover:text-ink hover:bg-surface-raised rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-surface-border">
              <Link
                href="/categoria/herramientas"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-accent text-ink-inverse font-display font-bold rounded-xl hover:bg-accent-light transition-colors"
              >
                Recursos gratis
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
