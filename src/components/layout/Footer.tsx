import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { DiyaLamp } from "../animations/DiyaLamp";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-primary via-primary to-primary/95">
      {/* Decorative temple-style top border */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
        <div className="flex justify-center -mt-4">
          <div className="flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-6 bg-secondary/80 rounded-t-full"
                style={{ 
                  height: i === 3 ? '32px' : i === 2 || i === 4 ? '24px' : '16px',
                  opacity: i === 3 ? 1 : i === 2 || i === 4 ? 0.9 : 0.7
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Kolam pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="kolam-footer" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="10" cy="10" r="1" fill="currentColor"/>
            <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="0.3"/>
            <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="0.3"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#kolam-footer)" className="text-secondary"/>
        </svg>
      </div>

      {/* Floating diyas at top */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-32 opacity-60">
        <DiyaLamp size="sm" />
        <DiyaLamp size="sm" />
        <DiyaLamp size="sm" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-8 lg:px-8">
        {/* Main content grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="relative">
                <span className="text-3xl animate-pulse-glow">🪔</span>
              </div>
              <Link to="/" className="font-serif text-2xl font-bold text-secondary gold-shimmer">
                Celebration Halls
              </Link>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Creating sacred moments and unforgettable celebrations in the 
              authentic Jaffna Hindu tradition. Your dream wedding, our devotion.
            </p>
            
            {/* Social links with traditional styling */}
            <div className="mt-6 flex justify-center md:justify-start gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "Youtube" }
              ].map(({ icon: Icon, label }) => (
                <a 
                  key={label}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center text-primary-foreground/60 hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-300 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-serif font-semibold text-secondary mb-5 flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent">✦</span> 
              Quick Links
              <span className="text-accent">✦</span>
            </h3>
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
                    className="text-primary-foreground/70 hover:text-secondary transition-all duration-300 inline-flex items-center gap-2 group hover:translate-x-1"
                  >
                    <span className="text-secondary/40 group-hover:text-secondary transition-colors text-xs">❯</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-serif font-semibold text-secondary mb-5 flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent">✦</span> 
              Contact Us
              <span className="text-accent">✦</span>
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-primary-foreground/70 text-left">
                  123 Temple Road,<br />
                  Nallur, Jaffna,<br />
                  Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <a href="tel:+919876543210" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-secondary" />
                </div>
                <a href="mailto:info@celebrationhalls.com" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                  info@celebrationhalls.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="text-center md:text-left">
            <h3 className="font-serif font-semibold text-secondary mb-5 flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent">✦</span> 
              Operating Hours
              <span className="text-accent">✦</span>
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-primary-foreground">Office Hours</p>
                  <p className="text-primary-foreground/70">Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p className="text-primary-foreground/70">Sunday: 11:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              {/* Auspicious timings card */}
              <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
                <p className="font-medium text-secondary flex items-center gap-2 justify-center md:justify-start">
                  <span>🕉️</span> Auspicious Timings
                </p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  We help you choose muhurtham dates for your ceremonies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/30 to-secondary/50" />
          <div className="flex items-center gap-2 text-secondary/60">
            <span>❋</span>
            <span className="text-lg">🪷</span>
            <span>❋</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-secondary/30 to-secondary/50" />
        </div>

        {/* Bottom section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50 text-center md:text-left">
            &copy; {new Date().getFullYear()} Celebration Halls. All rights reserved.
          </p>
          
          {/* Tagline with traditional styling */}
          <div className="flex items-center gap-3">
            <span className="text-secondary/60 text-sm">✦</span>
            <p className="text-xs text-primary-foreground/60 font-serif italic">
              "Where Sacred Traditions Meet Joyful Celebrations"
            </p>
            <span className="text-secondary/60 text-sm">✦</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-secondary animate-pulse-glow">🪔</span>
            <span className="text-xs text-primary-foreground/50">Blessed Beginnings</span>
            <span className="text-secondary animate-pulse-glow">🪔</span>
          </div>
        </div>
      </div>

      {/* Bottom temple-style border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
    </footer>
  );
}
