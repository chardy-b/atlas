import type { ReactNode } from "react"
import { CircleAlertIcon } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string
  action?: ReactNode
}

export function ErrorState({
  title = "Something went wrong",
  message = "We could not load this content. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/5 p-6"
    >
      <div className="flex gap-3">
        <CircleAlertIcon
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-destructive"
        />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </section>
  )
}
