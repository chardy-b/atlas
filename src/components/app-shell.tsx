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
          <span className="flex-1 text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground max-sm:text-left">
            Interactive works
          </span>
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
