"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useEffect, useState } from "react";

export function ThemeButton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { theme, setTheme } = useTheme();

  if (!isClient) return null;

  const themes = [
    { name: "light", icon: FiSun },
    { name: "dark", icon: FiMoon },
    { name: "system", icon: FiMonitor },
  ];

  return (
    <div className="flex items-center bg-muted p-1 rounded-full space-x-[2px]">
      {themes.map(({ name, icon: Icon }) => (
        <TooltipProvider key={name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setTheme(name)}
                className={`
            relative rounded-full transition-all duration-200 h-6 text-xs p-1
            ${
              theme === name
                ? "text-primary bg-background shadow-sm hover:bg-background"
                : "text-muted-foreground hover:text-primary hover:bg-foreground/10"
            }
          `}
              >
                <Icon size={5} />
                <span className="sr-only">{name} mode</span>
                {theme === name && (
                  <span className="absolute inset-0 rounded-full bg-background mix-blend-exclusion"></span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="bottom">
              <p>{name.slice(0, 1).toUpperCase() + name.slice(1)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
