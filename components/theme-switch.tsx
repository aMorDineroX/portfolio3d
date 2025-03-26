"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Effet pour initialiser le thème
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Par défaut, utiliser le thème sombre
      applyTheme("dark");
    }
  }, []);

  // Fonction pour appliquer le thème
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }

    localStorage.setItem("theme", newTheme);
  };

  // Gestionnaire de changement de thème
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex space-x-1 bg-blue-900/40 p-1 rounded-lg border border-blue-900/20 shadow-lg backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${theme === "light" ? "bg-blue-800/50 text-white" : "text-blue-300"}`}
        onClick={() => handleThemeChange("light")}
        title="Thème clair"
      >
        <Sun size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${theme === "dark" ? "bg-blue-800/50 text-white" : "text-blue-300"}`}
        onClick={() => handleThemeChange("dark")}
        title="Thème sombre"
      >
        <Moon size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${theme === "system" ? "bg-blue-800/50 text-white" : "text-blue-300"}`}
        onClick={() => handleThemeChange("system")}
        title="Thème système"
      >
        <Monitor size={16} />
      </Button>
    </div>
  );
}
