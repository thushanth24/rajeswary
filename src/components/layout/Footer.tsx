import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="font-serif text-2xl font-bold text-primary-foreground">
              Celebration Halls
            </Link>
            <p className="mt-4 text-sm text-secondary-foreground/80">
              Creating unforgettable moments for weddings, receptions, and special celebrations. 
              Your dream event, our passion.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/halls" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Our Halls
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/menus" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Menu Options
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Book a Venue
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/80">
                  123 Wedding Avenue,<br />
                  Celebration District,<br />
                  Mumbai - 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+919876543210" className="text-secondary-foreground/80 hover:text-primary">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@celebrationhalls.com" className="text-secondary-foreground/80 hover:text-primary">
                  info@celebrationhalls.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Operating Hours</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-secondary-foreground">Office Hours</p>
                  <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p>Sunday: 11:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="mt-4">
                <p className="font-medium text-secondary-foreground">Event Timings</p>
                <p>Morning: 8:00 AM - 4:00 PM</p>
                <p>Evening: 5:00 PM - 12:00 AM</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/20 text-center text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Celebration Halls. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
