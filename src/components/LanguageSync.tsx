import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { parseLangPath } from "@/seo/seo";

/**
 * Keeps the active language in sync with the URL: any path under /ta renders
 * in Tamil, everything else in English. This makes each language a real,
 * crawlable URL rather than a client-only toggle.
 */
export function LanguageSync() {
  const { pathname } = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const { lang } = parseLangPath(pathname || "/");
    if (lang !== language) {
      setLanguage(lang);
    }
  }, [pathname, language, setLanguage]);

  return null;
}
