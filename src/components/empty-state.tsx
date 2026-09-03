import type { ReactNode } from "react"
import { InboxIcon } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <section className="flex min-h-48 flex-col items-start justify-center rounded-lg border border-dashed border-border p-6">
      <div className="mb-3 text-muted-foreground" aria-hidden="true">
        {icon ?? <InboxIcon className="size-6" />}
      </div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 max-w-prose text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
