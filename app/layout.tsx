import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import Script from "next/script";
import { CookieBanner } from "@/components/ui/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "AhauTech",
    template: "%s | AhauTech",
  },
  description: "Tecnología, IA y recursos para crecer online.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahautech.com",
  ),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Evita flash de tema incorrecto al recargar — debe ir antes del body */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >{`(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')})()`}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AhauTech",
              url: "https://ahautech.com",
              logo: "https://ahautech.com/logo.png",
              sameAs: [
                // Añade tus redes sociales cuando las tengas
                // "https://twitter.com/ahautech",
                // "https://linkedin.com/company/ahautech"
              ],
            }),
          }}
        />
      </head>
      <body className="bg-canvas text-ink min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
