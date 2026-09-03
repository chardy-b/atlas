import type { ReactNode } from "react"
import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

interface AppShellProps {
  children: ReactNode
  appName?: string
}

export function AppShell({
  children,
  appName = "Application template",
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only"
      >
        Skip to content
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="shrink-0 font-semibold tracking-tight">
            {appName}
          </Link>
          <nav aria-label="Primary navigation" className="min-w-0 flex-1">
            <ul className="flex items-center gap-1 overflow-x-auto text-sm">
              <li>
                <a
                  className="inline-flex rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="#board"
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  className="inline-flex rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="/api/health"
                >
                  Health
                </a>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
      >
        {children}
      </main>
    </div>
  )
}
