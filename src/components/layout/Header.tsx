import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Halls", href: "/halls" },
  { name: "Bungalows", href: "/bungalows" },
  { name: "Services", href: "/services" },
  { name: "Menus", href: "/menus" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-sm border-b-2 border-primary/20 temple-border">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Traditional Om symbol */}
            <span className="text-2xl text-secondary animate-glow-pulse">🪔</span>
            <div>
              <span className="font-serif text-2xl font-bold text-primary tracking-wide">
                Celebration Halls
              </span>
              <span className="hidden sm:block text-xs text-secondary font-medium tracking-widest uppercase">
                ✦ Traditional Wedding Venues ✦
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative text-sm font-medium transition-all duration-300 hover:text-primary py-2",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-foreground/80"
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary animate-border-dance" 
                        style={{ backgroundSize: "200% 100%" }} />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              +91 98765 43210
            </a>
            <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/5">
              <Link to="/auth">
                <Shield className="h-4 w-4 mr-1" />
                Staff
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-traditional transition-all duration-300 hover:shadow-gold-glow">
              <Link to="/booking">
                <span className="mr-2">🪷</span>
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-4 animate-fade-in bg-card border-t border-primary/20">
            <div className="flex flex-col gap-3 px-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-lg animate-fade-in-up",
                    location.pathname === item.href
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-foreground hover:bg-primary/5"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2 text-secondary">✦</span>
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-2 mt-4">
                <Button asChild variant="outline" size="sm" className="flex-1 border-primary/30 text-primary">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Shield className="h-4 w-4 mr-1" />
                    Staff Login
                  </Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                  <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mr-2">🪷</span>
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
