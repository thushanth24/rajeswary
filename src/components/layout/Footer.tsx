import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-accent to-secondary" />
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🪔</span>
              <Link to="/" className="font-serif text-2xl font-bold text-secondary">
                Celebration Halls
              </Link>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Creating sacred moments and unforgettable celebrations in the 
              authentic Jaffna Hindu tradition. Your dream wedding, our devotion.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            {/* Decorative divider */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-secondary">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-secondary/50 to-transparent" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-secondary mb-4 flex items-center gap-2">
              <span>❈</span> Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
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
                    className="text-primary-foreground/80 hover:text-secondary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="text-secondary/50 group-hover:text-secondary transition-colors">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-semibold text-secondary mb-4 flex items-center gap-2">
              <span>❈</span> Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  123 Temple Road,<br />
                  Nallur, Jaffna,<br />
                  Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a href="tel:+919876543210" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a href="mailto:info@celebrationhalls.com" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  info@celebrationhalls.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif font-semibold text-secondary mb-4 flex items-center gap-2">
              <span>❈</span> Operating Hours
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground">Office Hours</p>
                  <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p>Sunday: 11:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="mt-4">
                <p className="font-medium text-primary-foreground">Auspicious Timings</p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  We help you choose muhurtham dates for your ceremonies
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60 text-center">
              &copy; {new Date().getFullYear()} Celebration Halls. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-secondary text-lg">
              <span>🪷</span>
              <span className="text-xs text-primary-foreground/60">Blessed Beginnings</span>
              <span>🪷</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
