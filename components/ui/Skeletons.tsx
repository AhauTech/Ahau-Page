// Skeleton para usar con <Suspense fallback={<PostGridSkeleton />}>
// No tiene JS — es CSS puro con animate-pulse de Tailwind.

export function PostCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden animate-pulse">
      <div className="aspect-video bg-canvas-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-surface-raised rounded-full" />
        <div className="h-5 w-full bg-surface-raised rounded-lg" />
        <div className="h-5 w-3/4 bg-surface-raised rounded-lg" />
        <div className="h-3 w-full bg-canvas-muted rounded-full" />
        <div className="h-3 w-2/3 bg-canvas-muted rounded-full" />
        <div className="flex justify-between pt-2 mt-2 border-t border-surface-border">
          <div className="h-3 w-16 bg-canvas-muted rounded-full" />
          <div className="h-3 w-12 bg-canvas-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="post-grid">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
