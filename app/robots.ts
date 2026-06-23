import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahautech.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"], // No indexar endpoints internos
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
