"use client";

import { useEffect } from "react";
import { applyLocale, localeFromStorage, translate, type Locale } from "@/lib/i18n";

/** Applies catalog translations to exact visible strings in legacy/deep screens. */
export function LocaleDomBridge() {
  useEffect(() => {
    const textSources = new WeakMap<Text, { source: string; rendered: string }>();
    const attrSources = new WeakMap<Element, Map<string, { source: string; rendered: string }>>();
    let locale: Locale = localeFromStorage();
    let ready = false;
    const localize = () => {
      if (!ready) return;
      applyLocale(locale);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        const old = textSources.get(text);
        const current = text.data;
        const source = old && current === old.rendered ? old.source : current;
        const trimmed = source.trim();
        if (!trimmed) continue;
        const translated = translate(trimmed, locale);
        if (translated !== trimmed) {
          const leading = source.match(/^\s*/)?.[0] ?? "";
          const trailing = source.match(/\s*$/)?.[0] ?? "";
          const rendered = `${leading}${translated}${trailing}`;
          textSources.set(text, { source, rendered });
          if (current !== rendered) text.data = rendered;
        } else if (old && current === old.rendered && locale === "en") {
          textSources.set(text, { source, rendered: source });
          text.data = source;
        }
      }
      for (const element of document.body.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title]")) {
        let records = attrSources.get(element);
        if (!records) { records = new Map(); attrSources.set(element, records); }
        for (const name of ["placeholder", "aria-label", "title"]) {
          const current = element.getAttribute(name);
          if (current === null) continue;
          const old = records.get(name);
          const source = old && current === old.rendered ? old.source : current;
          const translated = translate(source, locale);
          if (translated !== source) {
            records.set(name, { source, rendered: translated });
            if (current !== translated) element.setAttribute(name, translated);
          } else if (old && current === old.rendered && locale === "en") {
            records.set(name, { source, rendered: source });
            element.setAttribute(name, source);
          }
        }
      }
    };
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => { scheduled = false; localize(); });
    });
    const sync = (event?: Event) => {
      const detail = (event as CustomEvent<string> | undefined)?.detail;
      locale = detail === "ar" || detail === "en" ? detail : localeFromStorage();
      localize();
    };
    const timer = window.setTimeout(() => {
      ready = true;
      observer.observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title"] });
      sync();
    }, 900);
    window.addEventListener("qaddemni-locale-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("qaddemni-locale-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return null;
}
