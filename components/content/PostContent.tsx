// Renderiza HTML de WordPress.
// La clase `wp-content` aplica prose + overrides definidos en globals.css
// Usar not-prose en componentes hijos que no deben heredir el prose (AffiliateBox, YouTubeEmbed).

import { parseShortcodes } from "@/lib/wp/shortcodes";
import { AffiliateBox } from "@/components/ui/AffiliateBox";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

type Props = {
  content: string;
};

export function PostContent({ content }: Props) {
  if (!content) return null;
  // DEBUG TEMPORAL — eliminar después

  const blocks = parseShortcodes(content);
  
  // Sin shortcodes — path más común, renderizado directo
  if (blocks.length === 1 && blocks[0].type === "html") {
    return (
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: blocks[0].content }}
      />
    );
  }

  return (
    <div className="wp-content">
      {blocks.map((block, i) => {
        if (block.type === "html") {
          return (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        }

        if (block.type === "youtube") {
          const { id, title } = block.attrs;
          if (!id || !title) return null;
          return <YouTubeEmbed key={i} videoId={id} title={title} />;
        }

        if (block.type === "affiliate") {
          const { title, description, cta, url, badge, price, image } = block.attrs;
          if (!title || !url || !cta) return null;
          return (
            <AffiliateBox
              key={i}
              title={title}
              description={description}
              ctaLabel={cta}
              href={url}
              badge={badge}
              price={price}
              imageUrl={image}
            />
          );
        }

        return null;
      })}
    </div>
  );
}