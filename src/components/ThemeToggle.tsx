"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-stone-200 backdrop-blur-md"
      >
        <Moon className="h-4 w-4 text-amber-400" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Warm Ivory Light Mode" : "Switch to Obsidian Dark Mode"}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-stone-200 backdrop-blur-md transition-all hover:border-amber-400/40 hover:bg-white/10 hover:text-amber-400 cursor-pointer"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
