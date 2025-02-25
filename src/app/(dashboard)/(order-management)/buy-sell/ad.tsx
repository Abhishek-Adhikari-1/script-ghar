"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function ShadcnStyleSliderToggle() {
  const [value, setValue] = React.useState(1);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue[0]);
  };

  return (
    <div className="inline-flex items-center">
      <span
        className={cn(
          "mr-2 text-sm font-medium transition-colors",
          value === 0 ? "text-primary" : "text-muted-foreground"
        )}
      >
        SELL
      </span>
      <Slider
        defaultValue={[1]}
        value={[value]}
        onValueChange={handleValueChange}
        max={2}
        step={1}
        className="w-20 cursor-pointer"
        // trackClassName="h-6 rounded-full"
        trackClassName="h-6 rounded-full"
        // thumbClassName={
        //   value == 0
        //     ? "ml-[0.45rem]"
        //     : value == 2
        //     ? "mr-[0.45rem]"
        //     : ""
        // }
      />
      <span
        className={cn(
          "ml-2 text-sm font-medium transition-colors",
          value === 2 ? "text-primary" : "text-muted-foreground"
        )}
      >
        BUY
      </span>
    </div>
  );
}
