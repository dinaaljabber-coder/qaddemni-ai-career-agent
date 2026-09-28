"use client";

import { useEffect, useState } from "react";
import { applyLocale, localeFromStorage, translate, type Locale } from "@/lib/i18n";

/** Keep independently rendered route components in sync with the persisted workspace language. */
export function useLocale() {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    const sync = () => {
      const next = localeFromStorage();
      setLocale(next);
      applyLocale(next);
    };
    sync();
    window.addEventListener("qaddemni-locale-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("qaddemni-locale-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const setLanguage = (next: Locale) => {
    localStorage.setItem("qaddemni-locale", next);
    applyLocale(next);
    setLocale(next);
    window.dispatchEvent(new CustomEvent("qaddemni-locale-change", { detail: next }));
  };
  return { locale, t: (text: string) => translate(text, locale), setLanguage };
}
