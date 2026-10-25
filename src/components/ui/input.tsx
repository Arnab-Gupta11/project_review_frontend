import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-white/[0.09] bg-white/[0.035] backdrop-blur-md px-3.5 py-2 text-base text-primary-text shadow-inner shadow-black/20 transition-all outline-none placeholder:text-muted-foreground/60 md:text-sm",
        "focus-visible:bg-white/[0.06] focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-primary/20",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
