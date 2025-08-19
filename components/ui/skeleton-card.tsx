import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  hasHeader?: boolean
  hasFooter?: boolean
  lines?: number
}

export function SkeletonCard({ className, hasHeader = true, hasFooter = false, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      {hasHeader && (
        <div className="mb-4 space-y-2">
          <div className="h-5 w-2/3 animate-shimmer rounded bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%]" />
          <div className="h-4 w-1/2 animate-shimmer rounded bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%]" />
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-full animate-shimmer rounded bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%]"
            style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
          />
        ))}
      </div>

      {hasFooter && (
        <div className="mt-4 flex justify-end">
          <div className="h-9 w-24 animate-shimmer rounded bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%]" />
        </div>
      )}
    </div>
  )
}
