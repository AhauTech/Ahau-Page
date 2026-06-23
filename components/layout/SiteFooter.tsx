import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-surface-border bg-canvas-soft">
      <div className="mx-auto max-w-wide px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-lg text-ink">
              Ahau<span className="text-accent">Tech</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Tecnología e IA para crecer online.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-secondary"
            aria-label="Navegación secundaria"
          >
            <Link href="/aviso-legal" className="hover:text-ink transition-colors">
              Aviso legal
            </Link> 
            <Link href="/privacidad" className="hover:text-ink transition-colors">
              Privacidad
            </Link>
            <Link href="/afiliados" className="hover:text-ink transition-colors">
              Política de afiliados
            </Link>
            <Link href="/terminos" className="hover:text-ink transition-colors">
              Términos y condiciones
            </Link>
            <Link href="/contacto" className="hover:text-ink transition-colors">
              Contacto
            </Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          © {new Date().getFullYear()} AhauTech. Este sitio puede contener enlaces de afiliado.
        </p>
      </div>
    </footer>
  );
}
