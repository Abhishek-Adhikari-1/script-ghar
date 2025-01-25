"use client";

import { createContext, useContext, useState } from "react";

type Theme = "neutral" | "blue" | "red";
type Mode = number;

interface ThemeContextType {
  theme: Theme;
  setThemeByMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function BuySellThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("neutral");

  const setThemeByMode = (mode: Mode) => {
    switch (mode) {
      case 2:
        setTheme("blue");
        break;

      case 0:
        setTheme("red");
        break;

      default:
        setTheme("neutral");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeByMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useBuySellTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
