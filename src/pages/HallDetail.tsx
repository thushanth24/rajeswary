import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useHall } from "@/hooks/useHalls";
import { useHallDetails } from "@/hooks/useHallDetails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Snowflake,
  Car,
  UtensilsCrossed,
  Zap,
  User,
  Check,
  MapPin,
  Calendar,
  Phone,
} from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiwaRow } from "@/components/animations/DiyaLamp";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { HallAvailabilityIndicator } from "@/components/ui/HallAvailabilityIndicator";
import { HallImageGallery } from "@/components/hall/HallImageGallery";
import { HallReviews } from "@/components/hall/HallReviews";
import { HallFloorPlan } from "@/components/hall/HallFloorPlan";
import { HallEventPhotos } from "@/components/hall/HallEventPhotos";

const HallDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { hall, loading, error } = useHall(slug);
  const { details, loading: detailsLoading } = useHallDetails(hall?.id);

  if (loading) {
    return (
      <Layout>
        <section className="relative h-[65vh] flex items-end overflow-hidden bg-muted">
          <div className="container mx-auto px-4 lg:px-8 pb-16">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-64" />
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !hall) {
    return <Navigate to="/halls" replace />;
  }

  const facilities = [
    { name: "குளிரூட்டி (AC)", available: hall.facilities.ac, icon: Snowflake },
    { name: "வாகன நிறுத்தம்", available: hall.facilities.parking, icon: Car },
    { name: "உணவு அரங்கு", available: hall.facilities.dining, icon: UtensilsCrossed },
    { name: "மேடை", available: hall.facilities.stage, icon: User },
    { name: "மின் காப்பு", available: hall.facilities.powerBackup, icon: Zap },
    { name: "மணப்பெண் அறை", available: hall.facilities.brideRoom, icon: User },
    { name: "மணமகன் அறை", available: hall.facilities.groomRoom, icon: User },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hall.image}
            alt={hall.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        </div>
        
        <FloatingElements type="diyas" density="low" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 pb-16">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="flex flex-wrap gap-2 mb-4">
              {hall.eventTypes.map((type) => (
                <Badge key={type} className="bg-secondary/90 text-secondary-foreground border-secondary">
                  {type}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-4">
              {hall.name}
            </h1>
            <div className="flex items-center gap-6 text-card/90">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
              </div>
              <span className="text-secondary font-semibold text-lg gold-shimmer inline-block">
                {hall.priceRange}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-secondary text-xl">🪷</span>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Overview
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {hall.description}
                </p>
              </div>

              {/* Image Gallery */}
              <HallImageGallery 
                images={details.images.map(img => ({
                  id: img.id,
                  image_url: img.image_url,
                  caption: img.caption || undefined,
                }))}
                hallName={hall.name}
                mainImage={hall.image}
              />

              {/* Features */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-secondary text-xl">✦</span>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Key Features
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {hall.features.map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-4 card-traditional animate-fade-in-up"
                      style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-secondary text-xl">🪔</span>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Facilities
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {facilities.map((facility, index) => (
                    <div
                      key={facility.name}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                        facility.available
                          ? "card-traditional"
                          : "bg-muted/20 border-border/50 opacity-50"
                      }`}
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        facility.available 
                          ? "bg-gradient-to-br from-secondary/30 to-primary/20" 
                          : "bg-muted"
                      }`}>
                        <facility.icon className={`h-5 w-5 ${facility.available ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <span className={facility.available ? "text-foreground" : "text-muted-foreground"}>
                        {facility.name}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-4 card-traditional">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground">
                      {hall.facilities.washrooms} கழிவறைகள்
                    </span>
                  </div>
                </div>
              </div>

              {/* Floor Plan */}
              {details.floorPlanUrl && (
                <HallFloorPlan 
                  floorPlanUrl={details.floorPlanUrl} 
                  hallName={hall.name} 
                />
              )}

              {/* Customer Reviews */}
              <HallReviews 
                reviews={details.reviews.map(r => ({
                  id: r.id,
                  customer_name: r.customer_name,
                  event_type: r.event_type || undefined,
                  event_date: r.event_date || undefined,
                  rating: r.rating,
                  review_text: r.review_text,
                }))}
              />

              {/* Previous Events Gallery */}
              <HallEventPhotos 
                photos={details.eventPhotos.map(p => ({
                  id: p.id,
                  image_url: p.image_url,
                  event_type: p.event_type || undefined,
                  event_date: p.event_date || undefined,
                  caption: p.caption || undefined,
                }))}
                hallName={hall.name}
              />

              {/* Menu Preview */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-secondary text-xl">🍽️</span>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Virundhu Options
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  We offer authentic Jaffna cuisine including traditional banana leaf feast, 
                  breakfast, lunch, and dinner options with both vegetarian and non-vegetarian choices.
                </p>
                <Button variant="outline" asChild className="border-primary/50 hover:bg-primary/10">
                  <Link to="/menus">View Full Menu</Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="card-traditional p-6 sticky top-24 animate-fade-in-up">
                <DiwaRow count={3} className="mb-4" />
                
                <h3 className="font-serif text-xl font-bold text-foreground mb-4 text-center">
                  Book This <span className="text-gradient-gold">Mandapam</span>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 text-center">
                  Secure your auspicious muhurtham date at {hall.name}.
                </p>
                
                {/* Availability Calendar */}
                <HallAvailabilityIndicator hallSlug={hall.slug} />
                
                <div className="mt-4 space-y-3">
                  <Button asChild className="w-full gold-shimmer group">
                    <Link to={`/booking?hall=${hall.slug}`}>
                      <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      Book Now
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-primary/50 hover:bg-primary/10">
                    <a href="tel:+919876543210">
                      <Phone className="mr-2 h-5 w-5" />
                      Call to Inquire
                    </a>
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">📍</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Location
                  </h3>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p>123 Temple Street</p>
                    <p>Nallur, Jaffna</p>
                    <p>Sri Lanka - 40000</p>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">📋</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Quick Facts
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Capacity</span>
                    <span className="font-medium text-foreground">{hall.capacity.min} - {hall.capacity.max}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Price Range</span>
                    <span className="font-medium text-secondary">{hall.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Air Conditioned</span>
                    <span className={`font-medium ${hall.facilities.ac ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hall.facilities.ac ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">Parking</span>
                    <span className={`font-medium ${hall.facilities.parking ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hall.facilities.parking ? 'Available' : 'Limited'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground text-sm">Washrooms</span>
                    <span className="font-medium text-foreground">{hall.facilities.washrooms}</span>
                  </div>
                </div>
              </div>

              {/* Event Types */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">🎉</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Ideal For
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hall.eventTypes.map((type) => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className="bg-primary/5 border-primary/30 text-foreground hover:bg-primary/10 transition-colors"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Hours */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">🕐</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground">By Appointment</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Site visits available upon request
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>
    </Layout>
  );
};

export default HallDetailPage;
