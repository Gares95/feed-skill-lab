import * as React from "react"

import { cn } from "@/lib/utils"

type KbdProps = React.HTMLAttributes<HTMLElement> & {
  pressed?: boolean
  flash?: boolean
}

function Kbd({ className, pressed, flash, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      data-pressed={pressed ? "true" : undefined}
      data-flash={flash ? "true" : undefined}
      className={cn("kbd", className)}
      {...props}
    />
  )
}

type KbdGroupProps = React.HTMLAttributes<HTMLSpanElement>

function KbdGroup({ className, ...props }: KbdGroupProps) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 align-middle", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
