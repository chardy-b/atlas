"use client"

import * as React from "react"
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeOptions = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const

export function ThemeToggle() {
  const mounted = React.useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setTimeout(onStoreChange, 0)
      return () => window.clearTimeout(id)
    },
    () => true,
    () => false,
  )
  const { setTheme, theme } = useTheme()

  if (!mounted) {
    return (
      <Button
        aria-label="Change color theme"
        size="icon-sm"
        variant="ghost"
        disabled
      >
        <SunIcon aria-hidden="true" />
      </Button>
    )
  }

  const selectedTheme = theme ?? "system"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change color theme"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <SunIcon aria-hidden="true" className="dark:hidden" />
        <MoonIcon aria-hidden="true" className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup value={selectedTheme} onValueChange={setTheme}>
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon aria-hidden="true" />
              {label}
              {selectedTheme === value ? (
                <CheckIcon aria-hidden="true" className="ml-auto" />
              ) : null}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
