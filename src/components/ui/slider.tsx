"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string;
    thumbClassName?: string;
  }
>(({ className, trackClassName, thumbClassName, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    id="three-toggler"
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <>
      <SliderPrimitive.Track
        className={cn(
          "relative h-2 grow overflow-hidden rounded-full bg-secondary -ml-[0.17rem] -mr-[0.17rem]",
          trackClassName
        )}
      >
        <SliderPrimitive.Range className="absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full border bg-slate-700 dark:bg-slate-300 ring-offset-0 transition-colors focus-visible:outline-double focus-visible:outline-primary focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
          thumbClassName
        )}
      />
    </>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
