import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiwaRow } from "@/components/animations/DiyaLamp";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";

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
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "🪔 Message Sent!",
      description: "We'll get back to you within 24 hours. Nandri!",
    });
    
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "தொலைபேசி (Phone)",
      content: (
        <>
          <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
            +91 98765 43210
          </a>
          <br />
          <a href="tel:+919876543211" className="text-muted-foreground hover:text-primary transition-colors">
            +91 98765 43211
          </a>
        </>
      ),
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: (
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          Chat with us on WhatsApp
        </a>
      ),
    },
    {
      icon: Mail,
      title: "மின்னஞ்சல் (Email)",
      content: (
        <>
          <a href="mailto:info@celebrationhalls.com" className="text-muted-foreground hover:text-primary transition-colors">
            info@celebrationhalls.com
          </a>
          <br />
          <a href="mailto:bookings@celebrationhalls.com" className="text-muted-foreground hover:text-primary transition-colors">
            bookings@celebrationhalls.com
          </a>
        </>
      ),
    },
    {
      icon: MapPin,
      title: "முகவரி (Address)",
      content: (
        <p className="text-muted-foreground">
          123 Temple Street,<br />
          Nallur, Jaffna,<br />
          Sri Lanka - 40000
        </p>
      ),
    },
    {
      icon: Clock,
      title: "நேரம் (Hours)",
      content: (
        <p className="text-muted-foreground">
          Mon - Sat: 9:00 AM - 7:00 PM<br />
          Sunday: 10:00 AM - 5:00 PM<br />
          <span className="text-secondary text-sm">*Special hours for auspicious days</span>
        </p>
      ),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ தொடர்பு கொள்ளுங்கள் ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Have questions about our mandapams or seva? We're here to help you 
            plan your perfect sacred celebration.
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-secondary text-2xl">🪷</span>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Contact Information
                </h2>
              </div>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <Card 
                    key={item.title} 
                    className="card-traditional animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center shrink-0 gold-shimmer">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-foreground mb-1">{item.title}</h3>
                        {item.content}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-secondary text-2xl">✦</span>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Send us a Message
                </h2>
              </div>
              
              <Card className="card-traditional animate-fade-in-up">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="font-serif">பெயர் (Full Name)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="mt-1 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="font-serif">மின்னஞ்சல் (Email)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="mt-1 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="font-serif">தொலைபேசி (Phone)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        required
                        className="mt-1 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="font-serif">செய்தி (Message)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you with your celebration?"
                        required
                        rows={5}
                        className="mt-1 border-border/50 focus:border-primary"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full gold-shimmer" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "🪔 Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Map Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <RangoliPattern position="corners" size="sm" opacity={0.1} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <DiwaRow count={3} className="mb-6" />
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Find <span className="text-gradient-gold">Us</span>
            </h2>
          </div>
          
          <div className="aspect-[21/9] rounded-lg overflow-hidden border-2 border-secondary/30 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.8474!2d80.0290!3d9.6615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzknNDEuNCJOIDgwwrAwMSc0NC40IkU!5e0!3m2!1sen!2slk!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Celebration Halls Location - Jaffna"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
