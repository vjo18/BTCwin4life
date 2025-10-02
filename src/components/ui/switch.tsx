"use client"

import * as React from "react"
import * as SwitchPr from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPr.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPr.Root>
>(({ className, ...props }, ref) => (
  <SwitchPr.Root
    ref={ref}
    className={cn(
      // dark track when OFF, clear color when ON
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
      "bg-black/80 data-[state=checked]:bg-emerald-600",
      className
    )}
    {...props}
  >
    {/* white knob with subtle border; slides clearly */}
    <SwitchPr.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 translate-x-0 rounded-full border border-black/70 bg-white shadow transition-transform",
        "data-[state=checked]:translate-x-5"
      )}
    />
  </SwitchPr.Root>
))
Switch.displayName = SwitchPr.Root.displayName

export { Switch }
