import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/categoria/tecnologia", label: "Tecnología" },
  { href: "/categoria/inteligencia-artificial", label: "IA" },
  { href: "/categoria/herramientas", label: "Herramientas" },
  { href: "/categoria/dinero-online", label: "Ganar online" },
  { href: "/categoria/game", label: "Juegos" },
  { href: "/categoria/desarrollo", label: "Desarrollo" },
];

// Server Component — no JS salvo el MobileMenu client
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border"
      style={{ backgroundColor: "color-mix(in srgb, var(--color-canvas) 85%, transparent)" }}
    >
      {/* backdrop-blur via inline style porque Tailwind v4 no genera
          la utilidad de opacidad para colores custom con "/" directamente */}
      <div
        className="absolute inset-0 backdrop-blur-md -z-10"
        aria-hidden
      />

      <div className="mx-auto max-w-wide px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Wordmark */}
        
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="AhauTech logo"
            width={50}
            height={50}
            className="w-15 h-15 object-contain"
            priority 
          />
          <span className="font-display font-bold text-xl tracking-tight text-ink">
            Ahau<span className="text-accent">Tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1 flex-1"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-display font-medium text-ink-secondary hover:text-ink hover:bg-surface-raised rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2">
          
          <Link href="/categoria/recursos-gratis" className="...">
            Recursos gratis
          </Link>
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-surface-raised transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </Link>
        </div>

        {/* Mobile menu — único Client Component en el header */}
        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
