// Server-rendered YouTube embed con aspect ratio via Tailwind.
// Sin JS en cliente.

type Props = {
  videoId: string;
  title: string;
};

export function YouTubeEmbed({ videoId, title }: Props) {
  const src = `https://www.youtube.com/embed/${videoId}`;

  return (
    <figure className="not-prose my-8 rounded-2xl overflow-hidden border border-surface-border shadow-card">
      <div className="relative w-full aspect-video bg-canvas-muted">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      {title && (
        <figcaption className="px-4 py-2.5 bg-surface text-xs text-ink-muted font-display border-t border-surface-border">
          ▶ {title}
        </figcaption>
      )}
    </figure>
  );
}
