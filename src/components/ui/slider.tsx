"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full select-none items-center py-1", className)}
      {...props}
    >
      {/* thin, rounded track with light right side */}
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
        {/* dark left segment like in the preview */}
        <SliderPrimitive.Range className="absolute h-full bg-black" />
      </SliderPrimitive.Track>

      {/* white knob with dark border, easy to see */}
      <SliderPrimitive.Thumb
        aria-label="value"
        className="block h-5 w-5 -ml-2 rounded-full border-2 border-black bg-white shadow
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40
                   disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
