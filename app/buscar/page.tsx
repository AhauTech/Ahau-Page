import type { Metadata } from "next";
import { searchPosts } from "@/lib/wp/search";
import { buildMetadata } from "@/lib/seo/metadata";
import { SearchResults } from "@/components/content/SearchResults";
import { SearchForm } from "@/components/ui/SearchForm";

export const metadata: Metadata = buildMetadata({
  title: "Búsqueda",
  path: "/buscar",
});

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchPosts(query) : [];

  return (
    <div className="mx-auto max-w-wide px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display font-extrabold text-display-sm text-ink tracking-tight mb-6">
          Búsqueda
        </h1>
        <SearchForm initialValue={query} />
      </header>

      <SearchResults results={results} query={query} />
    </div>
  );
}