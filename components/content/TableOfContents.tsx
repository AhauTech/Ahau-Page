"use client";

// Client Component justificado: necesita acceder al DOM para leer los headings
// del contenido renderizado por dangerouslySetInnerHTML, e implementar
// IntersectionObserver para resaltar la sección activa.
//
// Se monta tarde (después de que PostContent renderiza el HTML),
// por eso usa useEffect para parsear el DOM.

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Props = {
  contentSelector?: string; // selector del contenedor con el HTML de WP
};

export function TableOfContents({ contentSelector = ".wp-content" }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extrae headings del DOM y añade IDs si no los tienen
  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const nodes = container.querySelectorAll<HTMLHeadingElement>("h2, h3");
    const extracted: Heading[] = [];

    nodes.forEach((node) => {
      if (!node.id) {
        node.id = node.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 60) ?? Math.random().toString(36).slice(2);
      }
      extracted.push({
        id: node.id,
        text: node.textContent ?? "",
        level: node.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(extracted);
    if (extracted.length > 0) setActiveId(extracted[0].id);
  }, [contentSelector]);

  // IntersectionObserver para el heading activo
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-5">
      <nav aria-label="Tabla de contenidos">
        <p className="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted mb-3">
          En este artículo
        </p>
        <ol className="space-y-1">
          {headings.map(({ id, text, level }) => (
            <li key={id} className={level === 3 ? "pl-3" : ""}>
              <a
                href={`#${id}`}
                className={[
                  "block text-sm leading-snug py-1 transition-colors border-l-2 pl-3",
                  activeId === id
                    ? "text-accent border-accent font-display font-semibold"
                    : "text-ink-secondary hover:text-ink border-transparent",
                ].join(" ")}
              >
                {text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
    
  );
}
