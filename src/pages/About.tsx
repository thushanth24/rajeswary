import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Heart, Award, Users, Star, Check } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="About us"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-card mb-4">
            About Celebration Halls
          </h1>
          <p className="text-card/90 max-w-2xl mx-auto text-lg">
            For over 15 years, we've been creating unforgettable celebrations, 
            one wedding at a time.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Celebration Halls began with a simple vision: to create spaces where 
              love stories unfold and memories are made. What started as a single 
              venue has grown into a collection of five stunning halls, each designed 
              with meticulous attention to detail and a passion for excellence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Over the years, we've had the privilege of hosting thousands of weddings, 
              receptions, and special events. Each celebration has taught us something 
              new, making us better at what we do – creating magical moments for 
              couples and their families.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What sets us apart is our commitment to making your special day 
              truly exceptional.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6">
              <Award className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Excellence</h3>
              <p className="text-sm text-muted-foreground">
                Award-winning venues with world-class amenities
              </p>
            </div>
            <div className="text-center p-6">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Dedicated Team</h3>
              <p className="text-sm text-muted-foreground">
                Experienced professionals ensuring seamless events
              </p>
            </div>
            <div className="text-center p-6">
              <Star className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Premium Services</h3>
              <p className="text-sm text-muted-foreground">
                Complete event solutions under one roof
              </p>
            </div>
            <div className="text-center p-6">
              <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Personal Touch</h3>
              <p className="text-sm text-muted-foreground">
                Customized experiences for every couple
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-foreground mb-2">15+</p>
              <p className="text-primary-foreground/80">Years of Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-foreground mb-2">5</p>
              <p className="text-primary-foreground/80">Stunning Venues</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-foreground mb-2">500+</p>
              <p className="text-primary-foreground/80">Weddings Hosted</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-foreground mb-2">100%</p>
              <p className="text-primary-foreground/80">Happy Couples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
              Our Promise
            </h2>
            <div className="space-y-4">
              {[
                "Impeccable service from inquiry to event day",
                "Flexible packages tailored to your needs",
                "Transparent pricing with no hidden costs",
                "Premium vendors and quality assurance",
                "Dedicated event coordinator for your celebration",
                "Backup systems for uninterrupted events",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 bg-card rounded-lg">
                  <Check className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Let's Create Your Perfect Day
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We'd love to be part of your celebration. Book a visit to see our 
            venues or start planning your event today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
