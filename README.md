# AhauTech — Frontend

Sitio de contenido enfocado en tecnología, IA, finanzas y desarrollo de software. Arquitectura headless: WordPress como CMS, Next.js como frontend.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| CMS | WordPress + WPGraphQL |
| Estilos | Tailwind CSS v4 |
| Renderizado | ISR (Incremental Static Regeneration) |
| SEO | Yoast SEO + WPGraphQL for Yoast |
| Deploy | Vercel |

---

## Estructura del proyecto

```
ahau-page/
├── app/
│   ├── layout.tsx                   # Root layout — header, footer, cookie banner
│   ├── page.tsx                     # Home con paginación cursor-based
│   ├── not-found.tsx                # 404 global
│   ├── error.tsx                    # Error boundary (Client Component)
│   ├── globals.css                  # Tailwind v4 @theme + @utility + base styles
│   ├── sitemap.ts                   # Sitemap dinámico (posts + páginas)
│   ├── robots.ts                    # robots.txt
│   ├── llms.txt/
│   │   └── route.ts                 # llms.txt para crawlers de IA
│   ├── buscar/
│   │   └── page.tsx                 # Búsqueda via WP REST API
│   ├── categoria/[slug]/
│   │   └── page.tsx                 # Listado de posts por categoría + paginación
│   ├── [slug]/
│   │   └── page.tsx                 # Post o página estática (post-then-page fallback)
│   └── api/
│       └── revalidate/
│           └── route.ts             # Webhook ISR — recibe notificaciones de WordPress
│
├── lib/
│   ├── wp/
│   │   ├── client.ts                # wpFetch — cliente GraphQL con ISR nativo
│   │   ├── queries.ts               # Queries GraphQL centralizadas
│   │   ├── types.ts                 # Tipos raw (WP) y normalizados (app)
│   │   ├── mappers.ts               # Normalización CMS → app
│   │   ├── posts.ts                 # Acceso a datos: posts y categorías
│   │   ├── pages.ts                 # Acceso a datos: páginas estáticas
│   │   ├── search.ts                # Búsqueda via REST API
│   │   ├── shortcodes.ts            # Parser de shortcodes [youtube] [affiliate]
│   │   └── index.ts                 # Barrel exports
│   └── seo/
│       └── metadata.ts              # buildMetadata + buildMetadataFromWPSeo
│
├── components/
│   ├── layout/
│   │   ├── ArticleLayout.tsx        # Layout de artículo: breadcrumb, título, sidebar
│   │   ├── SiteHeader.tsx           # Header sticky con nav, logo, ThemeToggle
│   │   ├── SiteFooter.tsx           # Footer con links legales
│   │   ├── MobileMenu.tsx           # Menú móvil (Client Component)
│   │   └── LegalLayout.tsx          # Layout para páginas legales
│   ├── content/
│   │   ├── PostContent.tsx          # Renderiza HTML de WP + shortcodes
│   │   ├── PostCard.tsx             # Card para listados
│   │   ├── TableOfContents.tsx      # ToC con IntersectionObserver (Client Component)
│   │   └── SearchResults.tsx        # Resultados de búsqueda
│   └── ui/
│       ├── AffiliateBox.tsx         # Caja de producto afiliado
│       ├── YouTubeEmbed.tsx         # Embed de YouTube sin JS
│       ├── ShareButtonsSidebar.tsx  # Botones de compartir (sidebar desktop + FAB móvil)
│       ├── ReaderSettings.tsx       # Configuración de lectura (tamaño, fuente, etc.)
│       ├── ThemeToggle.tsx          # Toggle claro/oscuro
│       ├── SearchForm.tsx           # Formulario de búsqueda (Client Component)
│       ├── Pagination.tsx           # Paginación cursor-based
│       ├── CookieBanner.tsx         # Banner de cookies (shell)
│       ├── CookieBannerClient.tsx   # Banner de cookies (Client Component)
│       └── Skeletons.tsx            # Skeletons para Suspense
│
├── public/
│   ├── logo.png                     # Logo sin fondo para header
│   └── og-default.jpg               # Imagen Open Graph por defecto (1200×630px)
│
├── next.config.ts
├── tsconfig.json
└── .env.local                       # Variables de entorno (no commitear)
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz con estos valores:

```bash
# WordPress / WPGraphQL
NEXT_PUBLIC_WP_GRAPHQL_URL=
NEXT_PUBLIC_WP_REST_URL=

# SEO / Open Graph
NEXT_PUBLIC_SITE_NAME=AhauTech
NEXT_PUBLIC_SITE_URL=

# Webhook de revalidación ISR
# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
REVALIDATION_SECRET=tu-secreto-seguro-aqui
```

---

## Setup local

```powershell
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en modo producción (simula Vercel)
npm run start

# Limpiar caché de Next.js
Remove-Item -Recurse -Force .next
```

---

## Shortcodes en WordPress

Los shortcodes se escriben en bloques **HTML personalizado** (`<!-- wp:html -->`) en el editor de WordPress.

### YouTube

```
[youtube id="VIDEO_ID" title="Título del video"]
```

Donde `VIDEO_ID` es la parte después de `?v=` en la URL de YouTube.

### Afiliado

```
[affiliate title="Nombre del producto" description="Descripción opcional." price="$49" cta="Ver precio" url="https://enlace-afiliado.com" badge="Recomendado" image="https://url-imagen.com/img.jpg"]
```

Atributos obligatorios: `title`, `url`, `cta`. El resto son opcionales.

---

## Revalidación ISR

El webhook en `/api/revalidate` recibe notificaciones de WordPress cuando se publica o edita contenido. Requiere el plugin `ahau-revalidate.php` activo en WordPress y las constantes en `wp-config.php`:

```php
define('AHAU_REVALIDATION_SECRET', 'mismo-valor-que-REVALIDATION_SECRET');
define('AHAU_FRONTEND_URL', 'https://ahautech.com');
```

El endpoint acepta POST con este body:

```json
{ "slug": "nombre-del-post", "type": "post" }
```

Tipos válidos: `post`, `page`, `category`.

---

## SEO

Cada página dinámica implementa `generateMetadata` que prioriza los datos de Yoast SEO. Si no hay datos de Yoast, usa el título y extracto del post como fallback.

**En cada post de WordPress, configurar en Yoast:**
- SEO Title (máx. 60 caracteres)
- Meta descripción (150–160 caracteres, incluye keyword principal)
- Focus keyword

La imagen Open Graph por defecto se sirve desde `/public/og-default.jpg` cuando un post no tiene imagen destacada.

---

## Modo claro / oscuro

El tema se persiste en `localStorage` bajo la clave `theme`. El script anti-flash en `<head>` aplica la clase `dark` antes del primer render para evitar parpadeo. El modo claro es el predeterminado.

Las preferencias de lectura (tamaño de fuente, tipografía, interlineado, etc.) se persisten bajo la clave `ahau-reader-settings`.

---

## Plugins de WordPress requeridos

| Plugin | Función |
|---|---|
| WPGraphQL | Expone el endpoint GraphQL |
| Yoast SEO | SEO on-page |
| WPGraphQL for Yoast SEO | Expone campo `seo` en GraphQL |
| Headless Mode | Redirige tráfico público del CMS al frontend |
| Ahau Revalidate (custom) | Webhook ISR al publicar/editar contenido |

---

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno en **Settings → Environment Variables**
3. El dominio `ahautech.com` debe apuntar a los nameservers de Vercel
4. Una vez desplegado, registra `https://ahautech.com/sitemap.xml` en Google Search Console

---

## Verificación antes de deploy

```powershell
# 1. Build limpio
Remove-Item -Recurse -Force .next
npm run build

# 2. Verificar en modo producción
npm run start

# 3. Comprobar manualmente
# http://localhost:3000/robots.txt
# http://localhost:3000/sitemap.xml
# http://localhost:3000/llms.txt

# 4. Ver código fuente de un post y buscar:
# <title>, <meta name="description">, <meta property="og:*">
```

---

## Decisiones técnicas

**Cursor-based pagination** sobre offset — WordPress GraphQL expone `pageInfo.endCursor` de forma nativa. Es más estable que el paginado por número de página cuando el contenido cambia frecuentemente.

**Post-then-page fallback en `[slug]`** — una sola ruta dinámica intenta resolver el slug como post primero y como página estática si no existe. Evita conflictos entre rutas dinámicas al mismo nivel.

**Shortcode parser en servidor** — el parsing de `[youtube]` y `[affiliate]` ocurre en `PostContent` (Server Component). Ningún JS de cliente interviene en el renderizado del contenido.

**`@theme` en Tailwind v4** — la configuración del design system vive en `globals.css` con tokens `@theme` y utilidades `@utility`. No existe `tailwind.config.ts` (incompatible con v4).

**Client Components mínimos** — solo 6 componentes usan `"use client"`: `MobileMenu`, `ThemeToggle`, `TableOfContents`, `ShareButtonsSidebar`, `ReaderSettings`, `CookieBannerClient` y `SearchForm`. Todos tienen justificación explícita (estado de UI, DOM, localStorage o eventos del navegador).
