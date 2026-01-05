import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingLabelTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  maxLength?: number;
}

export const FloatingLabelTextarea = forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
  ({ label, error, maxLength, className, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && String(value).length > 0;
    const isFloating = isFocused || hasValue;
    const charCount = String(value || "").length;

    return (
      <div className="relative">
        <div className="relative">
          {/* Glow effect on focus */}
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-lg opacity-0 blur-sm"
            animate={{ opacity: isFocused ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <textarea
            ref={ref}
            {...props}
            value={value}
            maxLength={maxLength}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "relative w-full px-4 pt-6 pb-2 bg-card/50 backdrop-blur-sm border rounded-lg",
              "text-foreground placeholder-transparent resize-none",
              "transition-all duration-300",
              "focus:outline-none focus:ring-0",
              isFocused ? "border-primary" : "border-border/50",
              error ? "border-destructive" : "",
              className
            )}
            placeholder={label}
          />
          
          {/* Floating label */}
          <motion.label
            className={cn(
              "absolute left-4 pointer-events-none font-serif",
              "transition-colors duration-300",
              isFloating ? "text-primary text-xs" : "text-muted-foreground text-base",
              error ? "text-destructive" : ""
            )}
            animate={{
              top: isFloating ? 8 : 16,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {label}
          </motion.label>
        </div>
        
        <div className="flex justify-between mt-1">
          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive"
            >
              {error}
            </motion.p>
          ) : (
            <span />
          )}
          
          {maxLength && (
            <span className={cn(
              "text-xs",
              charCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground"
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

FloatingLabelTextarea.displayName = "FloatingLabelTextarea";
