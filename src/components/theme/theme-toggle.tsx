"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonToSun, SunToMoon } from "./theme-svg";

export function ModeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [resolvedTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative w-auto h-auto p-4 rounded-full bg-card"
        >
          <div className="absolute flex justify-center items-center h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-none dark:-rotate-90 dark:scale-0">
            <SunToMoon key={`moon${key}`} width={"2rem"} />
          </div>
          <div className="absolute flex justify-center items-center h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-none dark:rotate-0 dark:scale-100">
            <MoonToSun key={`sun${key}`} width={"2rem"} />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={theme === "light" ? "bg-muted" : "focus:bg-muted/40"}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={theme === "dark" ? "bg-muted" : "focus:bg-muted/40"}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={theme === "system" ? "bg-muted" : "focus:bg-muted/40"}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
