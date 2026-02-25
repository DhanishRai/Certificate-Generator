import { useEffect, useState } from "react";
import AnimatedButton from "./AnimatedButton";

const THEME_STORAGE_KEY = "theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <AnimatedButton
      type="button"
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </AnimatedButton>
  );
};

export default ThemeToggle;
