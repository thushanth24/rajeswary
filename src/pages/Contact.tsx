import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Sparkles, HelpCircle, ExternalLink } from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiwaRow } from "@/components/animations/DiyaLamp";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { supabase } from "@/integrations/supabase/client";
import { FAQSection } from "@/components/contact/FAQSection";
import { CopyableText } from "@/components/contact/CopyableText";
import { FloatingLabelInput } from "@/components/contact/FloatingLabelInput";
import { FloatingLabelTextarea } from "@/components/contact/FloatingLabelTextarea";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate form progress
  const formProgress = useMemo(() => {
    let filled = 0;
    if (formData.name.trim()) filled++;
    if (formData.email.trim()) filled++;
    if (formData.phone.trim()) filled++;
    if (formData.message.trim()) filled++;
    return (filled / 4) * 100;
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length > 200) {
      newErrors.name = "Name must be less than 200 characters";
    }

    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    } else if (trimmedEmail.length > 255) {
      newErrors.email = "Email must be less than 255 characters";
    }

    const trimmedPhone = formData.phone.trim();
    const phoneRegex = /^[\d\s\-+()]{10,20}$/;
    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.phone = "Please enter a valid phone number (10-20 digits)";
    }

    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      newErrors.message = "Message is required";
    } else if (trimmedMessage.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      };

      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert(trimmedData);

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save message");
      }

      supabase.functions.invoke('send-contact-notification', {
        body: trimmedData,
      }).then(({ error }) => {
        if (error) {
          console.error("Email notification error:", error);
        }
      });
      
      setIsSuccess(true);
      
      toast({
        title: "🪔 Message Sent!",
        description: "We'll get back to you within 24 hours. Nandri!",
      });
      
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "தொலைபேசி (Phone)",
      content: (
        <div className="space-y-1">
          <CopyableText text="+919876543210" displayText="+91 98765 43210" />
          <br />
          <CopyableText text="+919876543211" displayText="+91 98765 43211" />
        </div>
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
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          Chat with us on WhatsApp
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ),
    },
    {
      icon: Mail,
      title: "மின்னஞ்சல் (Email)",
      content: (
        <div className="space-y-1">
          <CopyableText text="info@celebrationhalls.com" />
          <br />
          <CopyableText text="bookings@celebrationhalls.com" />
        </div>
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
      {/* Hero Section with Animated Gradient */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-card to-primary/10" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
            <motion.span 
              className="text-secondary text-3xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🪔
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          <motion.span 
            className="text-secondary font-medium tracking-wider uppercase text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✦ {t("contact.subtitle")} ✦
          </motion.span>
          
          <motion.h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("contact.title")}
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t("contact.description")}
          </motion.p>
          
          <motion.div 
            className="divider-ornate mt-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="relative py-24 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <motion.div 
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-secondary text-2xl">🪷</span>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Contact Information
                </h2>
              </motion.div>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden">
                      {/* Glassmorphism effect */}
                      <div className="absolute inset-0 bg-card/50 backdrop-blur-xl" />
                      
                      {/* Animated gradient border on hover */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary via-primary to-secondary rounded-xl opacity-0 group-hover:opacity-50 blur-sm transition-all duration-500 animate-gradient-x" />
                      
                      <CardContent className="relative p-5 flex items-start gap-4 bg-card/30 rounded-xl border border-border/50">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <item.icon className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="font-serif font-semibold text-foreground mb-1">{item.title}</h3>
                          {item.content}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Social Links */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-serif font-semibold text-foreground mb-4">Follow Us</h3>
                <SocialLinks />
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="text-secondary text-2xl">✦</span>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Send us a Message
                </h2>
              </div>
              
              <Card className="relative overflow-hidden">
                {/* Glassmorphism */}
                <div className="absolute inset-0 bg-card/50 backdrop-blur-xl" />
                
                <CardContent className="relative p-8 bg-card/30 border border-border/50">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Form Progress</span>
                      <span className="text-sm text-secondary font-medium">{Math.round(formProgress)}%</span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${formProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center py-12"
                      >
                        {/* Success Animation */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <motion.div
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <Sparkles className="w-12 h-12 text-white" />
                          </motion.div>
                        </motion.div>
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-muted-foreground">
                          We'll get back to you within 24 hours.
                        </p>
                        
                        {/* Confetti-like particles */}
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: i % 2 === 0 ? "hsl(var(--secondary))" : "hsl(var(--primary))",
                              left: "50%",
                              top: "40%",
                            }}
                            initial={{ scale: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: (Math.random() - 0.5) * 200,
                              y: (Math.random() - 0.5) * 200,
                              opacity: [1, 1, 0],
                            }}
                            transition={{
                              duration: 1,
                              delay: i * 0.05,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <FloatingLabelInput
                          label="பெயர் (Full Name) *"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          error={errors.name}
                        />
                        
                        <FloatingLabelInput
                          label="மின்னஞ்சல் (Email) *"
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          error={errors.email}
                        />
                        
                        <FloatingLabelInput
                          label="தொலைபேசி (Phone) *"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: "" });
                          }}
                          error={errors.phone}
                        />
                        
                        <FloatingLabelTextarea
                          label="செய்தி (Message) *"
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (errors.message) setErrors({ ...errors, message: "" });
                          }}
                          error={errors.message}
                          maxLength={2000}
                          rows={5}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full gold-shimmer group text-lg py-6" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <motion.div
                              className="flex items-center gap-2"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </motion.div>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-card overflow-hidden">
        <div className="absolute inset-0 lotus-bg opacity-20" />
        <RangoliPattern position="corners" size="sm" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <HelpCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            </motion.div>
            <motion.h2 
              className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Find answers to common questions about our services and booking process
            </motion.p>
          </div>
          
          <FAQSection />
        </div>
      </section>

      {/* Map Section */}
      <section className="relative py-24 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <DiwaRow count={3} className="mb-6" />
            <motion.h2 
              className="font-serif text-3xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Find <span className="text-gradient-gold">Us</span>
            </motion.h2>
          </div>
          
          <motion.div 
            className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none z-10" />
            
            <div className="aspect-[21/9]">
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
            
            {/* Directions Button */}
            <div className="absolute bottom-6 right-6 z-20">
              <Button
                asChild
                className="gold-shimmer shadow-lg"
              >
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=9.6615,80.0290"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
