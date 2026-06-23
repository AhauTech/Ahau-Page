"use client";
import { ReaderSettingsMobile } from "@/components/ui/ReaderSettings";
import { useState, useEffect } from "react";

type Props = {
  title: string;
  slug: string;
};

const getShareLinks = (title: string, url: string) => [
  {
    label: "WhatsApp",
    href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.233 1.608 6.099L.057 23.882a.75.75 0 0 0 .921.921l5.783-1.551A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.771-.505-5.407-1.462l-.387-.23-4.01 1.075 1.074-4.01-.23-.387A9.945 9.945 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "X",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    color: "hover:bg-black hover:text-white hover:border-black",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Copiar",
    href: null,
    color: "hover:bg-surface-raised hover:border-accent hover:text-accent",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5" aria-hidden>
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ShareButtonsSidebar({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/${slug}`);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const links = getShareLinks(title, url);

  return (
    <>
      {/* ── Desktop: barra vertical sticky izquierda ── */}
      <aside
        className={[
          "hidden lg:flex flex-col items-center gap-2 fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-40 transition-all duration-300",
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none",
        ].join(" ")}
        aria-label="Compartir artículo"
      >
        <span
          className="text-2xs font-display font-semibold uppercase tracking-widest text-ink-muted mb-1"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Compartir
        </span>

        <div className="w-px h-6 bg-surface-border" aria-hidden />

        {links.map((link) =>
          link.href ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Compartir en ${link.label}`}
              title={link.label}
              className={[
                "w-10 h-10 flex items-center justify-center rounded-xl border border-surface-border bg-surface text-ink-secondary transition-all duration-200",
                link.color,
              ].join(" ")}
            >
              {link.icon}
            </a>
          ) : (
            <button
              key={link.label}
              onClick={handleCopy}
              aria-label="Copiar enlace"
              title={copied ? "Copiado" : "Copiar enlace"}
              className={[
                "w-10 h-10 flex items-center justify-center rounded-xl border border-surface-border bg-surface text-ink-secondary transition-all duration-200",
                copied ? "border-accent text-accent" : link.color,
              ].join(" ")}
            >
              {copied ? <CheckIcon /> : link.icon}
            </button>
          )
        )} 

        <div className="w-px h-6 bg-surface-border" aria-hidden />
      </aside>

      {/* ── Móvil: FAB con menú desplegable ── */}
        <div className="lg:hidden fixed bottom-24 right-4 z-50">
          <ReaderSettingsMobile />
        </div>
        <div className="lg:hidden">
        {/* Overlay para cerrar al tocar fuera */}
        {mobileOpen && (
            <div
            className="fixed inset-0 z-40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
            />
        )}

        {/* Botones desplegables — aparecen encima del FAB */}
        <div
            className={[
            "fixed bottom-24 right-4 z-50 flex flex-col-reverse items-center gap-3 transition-all duration-300",
            mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none",
            ].join(" ")}
        >
            {links.map((link) =>
            link.href ? (
                <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Compartir en ${link.label}`}
                onClick={() => setMobileOpen(false)}
                className={[
                    "w-12 h-12 flex items-center justify-center rounded-full border border-surface-border bg-surface text-ink-secondary shadow-card transition-all duration-200",
                    link.color,
                ].join(" ")}
                >
                {link.icon}
                </a>
            ) : (
                <button
                key={link.label}
                onClick={handleCopy}
                aria-label="Copiar enlace"
                className={[
                    "w-12 h-12 flex items-center justify-center rounded-full border border-surface-border bg-surface text-ink-secondary shadow-card transition-all duration-200",
                    copied ? "border-accent text-accent" : link.color,
                ].join(" ")}
                >
                {copied ? <CheckIcon /> : link.icon}
                </button>
            )
            )}
        </div>

        {/* FAB principal */}
        <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar opciones de compartir" : "Compartir artículo"}
            aria-expanded={mobileOpen}
            className={[
            "fixed bottom-6 right-4 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-card-hover transition-all duration-300",
            mobileOpen
                ? "bg-surface-raised border-2 border-accent text-accent rotate-45"
                : "bg-accent text-ink-inverse border-2 border-transparent",
            ].join(" ")}
        >
            {mobileOpen ? (
            // X para cerrar
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
            ) : (
            // Ícono de compartir
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6" aria-hidden>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 6 12 2 8 6" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="2" x2="12" y2="15" strokeLinecap="round"/>
            </svg>
            )}
        </button>
        </div>
      
    </>
  );
}