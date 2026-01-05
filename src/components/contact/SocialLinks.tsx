import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "#E4405F" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "#FF0000" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "#1DA1F2" },
];

export const SocialLinks = () => {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Hover background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: social.color }}
          />
          
          <social.icon className="relative z-10 w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
          
          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {social.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
};
