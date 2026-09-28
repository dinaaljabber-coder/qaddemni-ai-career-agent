"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocale } from "@/lib/use-locale";

type Theme = "light" | "dark" | "system";
const Context = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: "system", setTheme: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    const stored = localStorage.getItem("qaddemni-theme") as Theme | null;
    const selected = stored && ["light", "dark", "system"].includes(stored) ? stored : "system";
    setTheme(selected);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.dataset.theme = selected === "system" ? (media.matches ? "dark" : "light") : selected;
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  const change = (next: Theme) => {
    setTheme(next); localStorage.setItem("qaddemni-theme", next);
    document.documentElement.dataset.theme = next === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : next;
  };
  return <Context.Provider value={{ theme, setTheme: change }}>{children}</Context.Provider>;
}
export function ThemeSelect() {
  const { theme, setTheme } = useContext(Context);
  const { t } = useLocale();
  return <label className="theme-select-label"><span className="sr-only">{t("Color theme")}</span><select className="theme-select" value={theme} onChange={e => setTheme(e.target.value as Theme)} aria-label={t("Color theme")}><option value="light">☀ {t("Light")}</option><option value="dark">☾ {t("Dark")}</option><option value="system">◐ {t("System")}</option></select></label>;
}
