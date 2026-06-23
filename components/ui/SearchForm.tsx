"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialValue?: string;
};

export function SearchForm({ initialValue = "" }: Props) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl" role="search">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar artículos..."
        aria-label="Buscar artículos"
        className="flex-1 px-4 py-3 rounded-xl border border-surface-border bg-surface text-ink placeholder:text-ink-muted font-display text-sm focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-accent text-ink-inverse font-display font-semibold text-sm rounded-xl hover:bg-accent-light transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}