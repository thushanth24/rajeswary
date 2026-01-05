import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, className, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && String(value).length > 0;
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        <div className="relative">
          {/* Glow effect on focus */}
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-lg opacity-0 blur-sm"
            animate={{ opacity: isFocused ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <input
            ref={ref}
            {...props}
            value={value}
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
              "text-foreground placeholder-transparent",
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
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
