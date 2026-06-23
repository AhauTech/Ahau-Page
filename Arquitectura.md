# Ahau — Frontend Architecture

Next.js 14+ App Router + WordPress Headless (WPGraphQL) + ISR

---

## Decisiones técnicas

### Data layer
- `wpFetch` centraliza todos los fetches a WPGraphQL con soporte nativo de ISR (`next: { revalidate }`)
- Las queries viven en `queries.ts` — fácil de auditar y reutilizar
- Los mappers desacoplan el contrato del CMS del contrato de la app. Si WP cambia un campo, solo actualizas el mapper

### Renderizado
- Todo es Server Component por defecto — cero JS de cliente salvo necesidad explícita
- `revalidate = 3600` en páginas dinámicas — ISR limpio sin SSR innecesario
- `generateStaticParams` en `/[slug]` pre-genera posts en build time

### SEO
- `generateMetadata` en todas las páginas dinámicas
- `buildMetadataFromWPSeo` usa datos de Yoast/RankMath cuando están disponibles
- `buildMetadata` como fallback si el plugin SEO no está configurado
- HTML semántico: `<article>`, `<time dateTime>`, `<figure>`, `<aside aria-label>`

### Revalidación ISR
- Endpoint `/api/revalidate` recibe webhooks de WP
- Valida un secret compartido via header `x-revalidation-secret`
- Invalida rutas específicas (`/[slug]`, `/`, `/categoria/[slug]`) sin revalidar todo el sitio

### Futuro: block parser
- `PostContent` usa `dangerouslySetInnerHTML` como capa de compatibilidad
- Cuando actives `contentBlocks` en WPGraphQL, reemplaza el contenido de `PostContent` con un switch sobre `block.__typename`

---

## Setup

```bash
cp .env.local.example .env.local
# Editar variables de entorno

npm install
npm run dev
```

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_WP_GRAPHQL_URL` | Endpoint de WPGraphQL |
| `NEXT_PUBLIC_SITE_NAME` | Nombre del sitio para metadata |
| `NEXT_PUBLIC_SITE_URL` | URL base para canonical y OG |
| `REVALIDATION_SECRET` | Secret para webhook de revalidación |

## WPGraphQL: plugins requeridos

- **WPGraphQL** (base)
- **WPGraphQL for Yoast SEO** o **WPGraphQL for RankMath** (para el campo `seo` en posts/categorías)
