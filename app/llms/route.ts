import { NextResponse } from "next/server";
import { getAllPostSlugs } from "@/lib/wp/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahautech.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AhauTech";

export const revalidate = 3600;

export async function GET() {
  const slugs = await getAllPostSlugs();

  const content = `# ${SITE_NAME}
> Tecnología, IA y recursos para crecer online.

## Sitio

- Sitio principal: ${SITE_URL}
- Sitemap: ${SITE_URL}/sitemap.xml

## Contenido permitido para modelos de lenguaje

Los artículos publicados en ${SITE_NAME} pueden ser referenciados e indexados
por modelos de lenguaje con fines informativos, siempre citando la fuente.

## Artículos disponibles

${slugs.map((slug) => `- ${SITE_URL}/${slug}`).join("\n")}

## Contacto

- Email: labs@ahautech.com
- Política de privacidad: ${SITE_URL}/privacidad
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}