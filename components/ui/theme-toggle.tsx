"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className="p-2 rounded border bg-background hover:bg-muted transition"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      type="button"
    >
      {resolvedTheme === "dark" ? (
        <span role="img" aria-label="Light mode">
          🌞
        </span>
      ) : (
        <span role="img" aria-label="Dark mode">
          🌙
        </span>
      )}
    </button>
  );
}
