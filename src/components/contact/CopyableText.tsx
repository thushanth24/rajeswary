import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

interface CopyableTextProps {
  text: string;
  displayText?: string;
  className?: string;
}

export const CopyableText = ({ text, displayText, className = "" }: CopyableTextProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${className}`}
    >
      <span>{displayText || text}</span>
      <span className="relative w-4 h-4">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 text-green-500"
            >
              <Check className="w-4 h-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      
      {/* Tooltip */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
