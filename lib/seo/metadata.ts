import type { Metadata } from "next";
import type { WPSeo } from "@/lib/wp/types";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AhauTech";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahautech.com";
const OG_DEFAULT = `${SITE_URL}/og-default.jpg`;
const DEFAULT_DESCRIPTION =  "Tecnología, IA y recursos para crecer online.";
function resolveUrl(path: string) {
  return path.startsWith("http")
    ? path
    : `${SITE_URL}${path}`;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = image ?? OG_DEFAULT; // ← siempre hay imagen
  const safeDescription = description ?? DEFAULT_DESCRIPTION;
  const url = resolveUrl(path);

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: safeDescription,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: "AhauTech" }],
    openGraph: {
      title: fullTitle,
      description: safeDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage, width: 1200,
          height: 630, }], // ← siempre presente
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: safeDescription,
      images: [ogImage], // ← siempre presente
    },
  };
}

export function buildMetadataFromWPSeo(
  seo: WPSeo,
  path: string = ""
): Metadata {
  const url = seo.canonical ?? `${SITE_URL}${path}`;
  const ogImage = seo.opengraphImage?.sourceUrl ?? OG_DEFAULT; // ← siempre hay imagen

  return {
    title: seo.title,
    description: seo.metaDesc,
    alternates: {
      canonical: url,
    },
    authors: [{ name: "AhauTech" }],
    openGraph: {
      title: seo.opengraphTitle ?? seo.title,
      description: seo.opengraphDescription ?? seo.metaDesc,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: ogImage }], // ← siempre presente
    },
    twitter: {
      card: "summary_large_image",
      title: seo.opengraphTitle ?? seo.title,
      description: seo.opengraphDescription ?? seo.metaDesc,
      images: [ogImage], // ← siempre presente
    },
  };
}