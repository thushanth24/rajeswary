import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our venues or services? We're here to help you 
            plan your perfect celebration.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <Card className="border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary">
                        +91 98765 43210
                      </a>
                      <br />
                      <a href="tel:+919876543211" className="text-muted-foreground hover:text-primary">
                        +91 98765 43211
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/919876543210" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        Chat with us on WhatsApp
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a href="mailto:info@celebrationhalls.com" className="text-muted-foreground hover:text-primary">
                        info@celebrationhalls.com
                      </a>
                      <br />
                      <a href="mailto:bookings@celebrationhalls.com" className="text-muted-foreground hover:text-primary">
                        bookings@celebrationhalls.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Wedding Avenue,<br />
                        Celebration District,<br />
                        Mumbai - 400001
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Operating Hours</h3>
                      <p className="text-muted-foreground">
                        Mon - Sat: 10:00 AM - 8:00 PM<br />
                        Sunday: 11:00 AM - 6:00 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                Send us a Message
              </h2>
              
              <Card className="border-border">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you?"
                        required
                        rows={5}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">
            Find Us
          </h2>
          <div className="aspect-[21/9] rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.755682099671!2d72.87765!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM0LjYiTiA3MsKwNTInMzkuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Celebration Halls Location"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
