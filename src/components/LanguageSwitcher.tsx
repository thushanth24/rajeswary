import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "compact";
}

export function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm p-0.5",
        className
      )}
    >
      <button
        onClick={() => setLanguage("en")}
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
        onClick={() => setLanguage("ta")}
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
