import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wp/posts";
import { getAllPageUris } from "@/lib/wp/pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahautech.com";

// Las categorías no tienen un endpoint para listar todos los slugs en este
// setup, así que las manejamos con las que aparecen en los posts.
// Si necesitas un listado completo, agrega GET_ALL_CATEGORY_SLUGS en queries.ts.

//Para evitar que el sitemap se genere en build time y no se quede con los datos de ese momento, forzamos a que sea dinámico para que siempre se genere con los datos más recientes.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, pageUris] = await Promise.all([
    getAllPostSlugs(),
    getAllPageUris(),
  ]);

  const posts: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const pages: MetadataRoute.Sitemap = pageUris.map((uri) => ({
    url: `${SITE_URL}/${uri}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts,
    ...pages,
  ];
}
