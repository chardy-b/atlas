import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  label?: string
  className?: string
}

export function LoadingState({
  label = "Loading content",
  className,
}: LoadingStateProps) {
  return (
    <section aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </section>
  )
}
