import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { switchLangPath } from "@/seo/seo";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "compact";
}

export function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const go = (lang: "en" | "ta") => {
    setLanguage(lang);
    const target = switchLangPath(lang, location.pathname) + location.search;
    if (target !== location.pathname + location.search) {
      navigate(target);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm p-0.5",
        className
      )}
    >
      <button
        onClick={() => go("en")}
        className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200",
          language === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Switch to English"
      >
        {variant === "compact" ? "EN" : "English"}
      </button>
      <button
        onClick={() => go("ta")}
        className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200",
          language === "ta"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Switch to Tamil"
      >
        {variant === "compact" ? "த" : "தமிழ்"}
      </button>
    </div>
  );
}
