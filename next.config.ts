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

// El host de uploads puede ser diferente al de GraphQL.
// Si NEXT_PUBLIC_WP_GRAPHQL_URL es https://cms.ahautech.com/graphql,
// WP_HOST será "cms.ahautech.com" y cubrirá también los uploads.
// Si en el futuro usas un CDN separado para medios, añádelo aquí.
function buildRemotePatterns() {
  const patterns: { protocol: "https"; hostname: string }[] = [];

  if (WP_HOST) {
    patterns.push({ protocol: "https", hostname: WP_HOST });
  }

  // Dominio explícito como fallback por si la env var no está disponible en build
  if (!patterns.some((p) => p.hostname === "cms.ahautech.com")) {
    patterns.push({ protocol: "https", hostname: "cms.ahautech.com" });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildRemotePatterns(),
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 3600,
    formats: ["image/webp"],
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
              "img-src 'self' data: blob: https:",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https:",
            ].join("; "),
          },
        ],
      },
      // Eliminado el bloque /_next/static/(.*) — Vercel lo gestiona
      // automáticamente con su CDN. En hosting propio añádelo de nuevo.
    ];
  },
};

export default nextConfig;