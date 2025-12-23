import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="text-center md:text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full font-serif font-semibold text-primary mb-3 md:mb-5 flex items-center justify-between md:justify-start gap-2 cursor-pointer md:cursor-default"
      >
        <div className="flex items-center gap-2">
          <span className="text-secondary">❋</span>
          {title}
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-secondary transition-transform duration-300 md:hidden",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
      )}>
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-secondary/10 via-card to-secondary/5">
      {/* Decorative temple gopuram top border */}
      <div className="absolute top-0 left-0 right-0">
        <svg className="w-full h-8" viewBox="0 0 1200 32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="temple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="1"/>
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          {/* Temple arch pattern */}
          <path d="M0,32 L0,28 Q300,28 400,20 Q500,12 600,8 Q700,12 800,20 Q900,28 1200,28 L1200,32 Z" fill="url(#temple-gradient)" opacity="0.2"/>
          <rect x="0" y="0" width="1200" height="3" fill="url(#temple-gradient)"/>
        </svg>
      </div>

      {/* Kolam corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 opacity-20 hidden md:block">
        <svg viewBox="0 0 64 64" className="w-full h-full text-primary">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="32" r="4" fill="currentColor"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle 
              key={angle}
              cx={32 + 20 * Math.cos(angle * Math.PI / 180)} 
              cy={32 + 20 * Math.sin(angle * Math.PI / 180)} 
              r="3" 
              fill="currentColor"
            />
          ))}
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 opacity-20 hidden md:block">
        <svg viewBox="0 0 64 64" className="w-full h-full text-primary">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="32" r="4" fill="currentColor"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle 
              key={angle}
              cx={32 + 20 * Math.cos(angle * Math.PI / 180)} 
              cy={32 + 20 * Math.sin(angle * Math.PI / 180)} 
              r="3" 
              fill="currentColor"
            />
          ))}
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-16 pb-8 lg:px-8">
        {/* Main content grid */}
        <div className="grid gap-6 md:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand - Always visible */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="text-3xl">🪔</span>
              <Link to="/" className="font-serif text-2xl font-bold text-primary">
                Celebration Halls
              </Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creating sacred moments and unforgettable celebrations in the 
              authentic Jaffna Hindu tradition.
            </p>
            
            {/* Social links */}
            <div className="mt-6 flex justify-center md:justify-start gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "Youtube" }
              ].map(({ icon: Icon, label }) => (
                <a 
                  key={label}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Decorative element */}
            <div className="mt-5 flex items-center justify-center md:justify-start gap-2">
              <span className="text-secondary text-sm">✦</span>
              <div className="w-20 h-px bg-gradient-to-r from-secondary to-transparent" />
            </div>
          </div>

          {/* Quick Links - Collapsible on mobile */}
          <CollapsibleSection title="Quick Links">
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Our Halls", href: "/halls" },
                { name: "Services", href: "/services" },
                { name: "Menu Options", href: "/menus" },
                { name: "Book a Venue", href: "/booking" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="text-secondary/60 group-hover:text-secondary transition-colors">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Contact Info - Collapsible on mobile */}
          <CollapsibleSection title="Contact Us">
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-left">
                  123 Temple Road,<br />
                  Nallur, Jaffna,<br />
                  Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a href="mailto:info@celebrationhalls.com" className="text-muted-foreground hover:text-primary transition-colors">
                  info@celebrationhalls.com
                </a>
              </li>
            </ul>
          </CollapsibleSection>

          {/* Hours - Collapsible on mobile */}
          <CollapsibleSection title="Operating Hours">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="h-5 w-5 text-secondary shrink-0" />
                <span className="font-medium text-foreground">Office Hours</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start text-muted-foreground">
                <span className="w-5" />
                Mon - Sat: 10 AM - 8 PM
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start text-muted-foreground">
                <span className="w-5" />
                Sunday: 11 AM - 6 PM
              </li>
            </ul>
          </CollapsibleSection>
        </div>

        {/* Decorative lotus divider */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
          <div className="flex items-center gap-3 text-secondary">
            <span className="text-xs">✦</span>
            <span className="text-xl">🪷</span>
            <span className="text-xs">✦</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
        </div>

        {/* Bottom section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Celebration Halls. All rights reserved.
          </p>
          
          <p className="text-xs text-muted-foreground font-serif italic">
            "Where Sacred Traditions Meet Joyful Celebrations"
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>🪔</span>
            <span>Blessed Beginnings</span>
            <span>🪔</span>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="h-1 bg-gradient-to-r from-secondary/30 via-primary/50 to-secondary/30" />
    </footer>
  );
}
