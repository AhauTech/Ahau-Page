import type { NextConfig } from "next";

function getWpHostname(): string {
  const url = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
} 

const WP_HOST = getWpHostname();

function buildRemotePatterns() {
  const patterns: { protocol: "https"; hostname: string }[] = [];

  if (WP_HOST) {
    patterns.push({ protocol: "https", hostname: WP_HOST });
  }

  if (!patterns.some((p) => p.hostname === "cms.ahautech.com")) {
    patterns.push({ protocol: "https", hostname: "cms.ahautech.com" });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
    // 1. PERMITIR SVG: Crucial para que textos y diagramas nunca pierdan calidad
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // 2. CALIDAD ELEVADA: Sube de 75 a 85/90 para romper la compresión agresiva en texto
    // quality no es una propiedad válida en la configuración global de imágenes de Next.js
    
    minimumCacheTTL: 3600,
    
    // 3. FORMATOS EXPANDIDOS: Permitimos AVIF (mejor compresión) y dejamos que Next.js 
    // decida cuándo mantener el formato original (como PNG para textos limpios)
    formats: ["image/avif", "image/webp"],

    // 4. CALIDAD DE IMÁGENES: Ajustamos la calidad de las imágenes generadas por Next.js
    qualities: [75, 90],
  },

  allowedDevOrigins: ["192.168.1.10"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Ajustado para permitir las imágenes remotas de tu WordPress en la CSP
              "img-src 'self' data: blob: https://cms.ahautech.com " + (WP_HOST ? `https://${WP_HOST}` : ""),
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
