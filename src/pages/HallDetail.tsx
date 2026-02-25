import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useHall, hallContactNumbers, hallAddresses } from "@/hooks/useHalls";
import { useHallDetails } from "@/hooks/useHallDetails";
import { useLanguage } from "@/contexts/LanguageContext";
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
  ArrowUpDown,
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
import { HallSectionsGallery } from "@/components/hall/HallSectionsGallery";

const HallDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { hall, loading, error } = useHall(slug);
  const { details, loading: detailsLoading } = useHallDetails(hall?.id);
  const { t } = useLanguage();

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

  const hallContact = hallContactNumbers[hall.slug];
  const primaryNumber = hallContact?.primary || "+94 21 222 3456";
  const landlineNumber = hallContact?.landline;
  const toTelHref = (value: string) => value.replace(/\s+/g, "");
  const hasLift = !["chelva-mahal", "raajeshwariy-tellipalai"].includes(hall.slug);

  const facilities = [
    { name: t("hallDetail.facility.ac"), available: hall.facilities.ac, icon: Snowflake },
    { name: t("hallDetail.facility.parking"), available: hall.facilities.parking, icon: Car },
    { name: t("hallDetail.facility.dining"), available: hall.facilities.dining, icon: UtensilsCrossed },
    { name: t("hallDetail.facility.stage"), available: hall.facilities.stage, icon: User },
    { name: t("hallDetail.facility.lift"), available: hasLift, icon: ArrowUpDown },
    { name: t("hallDetail.facility.powerBackup"), available: hall.facilities.powerBackup, icon: Zap },
    { name: t("hallDetail.facility.brideRoom"), available: hall.facilities.brideRoom, icon: User },
    { name: t("hallDetail.facility.groomRoom"), available: hall.facilities.groomRoom, icon: User },
  ];

  const hallAddress = hallAddresses[hall.slug];
  const venueSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": hall.name,
    "alternateName": hall.name.replace("Raajeshwariy", "Rajeswary"),
    "description": hall.description,
    "url": `https://raajeshwariygroups.com/halls/${hall.slug}`,
    "image": hall.image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hallAddress?.street || "",
      "addressLocality": hallAddress?.area || "Jaffna",
      "addressRegion": "Northern Province",
      "addressCountry": "LK"
    },
    "maximumAttendeeCapacity": hall.capacity.max,
    "amenityFeature": facilities.filter(f => f.available).map(f => ({
      "@type": "LocationFeatureSpecification",
      "name": f.name
    })),
    "telephone": primaryNumber
  };

  return (
    <Layout>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(venueSchema)}</script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hall.image}
            alt={hall.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        </div>
        
        <FloatingElements type="diyas" density="low" />
        
        <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12 md:pb-16">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {hall.eventTypes.map((type) => (
                <Badge key={type} className="bg-secondary/90 text-secondary-foreground border-secondary text-xs sm:text-sm">
                  {type}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-card mb-2 sm:mb-4">
              {hall.name}
            </h1>
            <div className="flex items-center gap-2 text-card/90 text-sm sm:text-base">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-8 sm:py-12 md:py-20 bg-background overflow-x-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-8 max-w-full overflow-x-hidden">
          {/* Mobile: Booking card first, then content */}
          <div className="lg:hidden mb-6">
            {/* Mobile Booking Card */}
            <div className="card-traditional p-4 sm:p-6 animate-fade-in-up">
              <DiwaRow count={3} className="mb-3 sm:mb-4" />
              
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4 text-center">
                {t("hallDetail.bookThis")} <span className="text-gradient-gold">{t("hallDetail.bookThis.highlight")}</span>
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 text-center">
                {hall.name} {t("hallDetail.bookThis.desc")}
              </p>
              
              <HallAvailabilityIndicator hallSlug={hall.slug} />
              
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <Button asChild className="w-full group text-sm sm:text-base bg-gradient-to-r from-secondary via-accent to-secondary text-secondary-foreground shadow-md shadow-secondary/30 border border-secondary/40 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-secondary/60">
                  <Link to={`/booking?hall=${hall.slug}`}>
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
                    {t("hallDetail.bookNow")}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full border-primary/50 hover:bg-primary/10 text-sm sm:text-base">
                  <a href={`tel:${toTelHref(primaryNumber)}`}>
                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t("hallDetail.callInquire")}
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 md:gap-12 lg:grid-cols-3 w-full max-w-full">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-12 min-w-0 w-full overflow-x-hidden">
              {/* Overview */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-secondary text-lg sm:text-xl">🪷</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    {t("hallDetail.overview")}
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                  {hall.description}
                </p>
              </div>

              {/* Hall Sections */}
              <HallSectionsGallery 
                hallId={hall.id}
                hallSlug={hall.slug}
                hallName={hall.name}
              />

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

              {/* Facilities */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-secondary text-lg sm:text-xl">🪔</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    {t("hallDetail.facilities")}
                  </h2>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                  {facilities.map((facility, index) => (
                    <div
                      key={facility.name}
                      className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-lg border transition-all ${
                        facility.available
                          ? "card-traditional"
                          : "bg-muted/20 border-border/50 opacity-50"
                      }`}
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                        facility.available 
                          ? "bg-gradient-to-br from-secondary/30 to-primary/20" 
                          : "bg-muted"
                      }`}>
                        <facility.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${facility.available ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-xs sm:text-sm md:text-base ${facility.available ? "text-foreground" : "text-muted-foreground"}`}>
                        {facility.name}
                      </span>
                    </div>
                  ))}
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
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-secondary text-lg sm:text-xl">🍽️</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    {t("hallDetail.virundhu")}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  {t("hallDetail.virundhu.desc")}
                </p>
                <Button variant="outline" asChild className="border-primary/50 hover:bg-primary/10 text-sm sm:text-base">
                  <Link to="/menus">{t("hallDetail.viewMenu")}</Link>
                </Button>
              </div>
            </div>

            {/* Sidebar - Hidden on mobile (shown above) */}
            <div className="hidden lg:block space-y-6">
              {/* Booking Card */}
              <div className="card-traditional p-6 sticky top-24 animate-fade-in-up">
                <DiwaRow count={3} className="mb-4" />
                
                <h3 className="font-serif text-xl font-bold text-foreground mb-4 text-center">
                  {t("hallDetail.bookThis")} <span className="text-gradient-gold">{t("hallDetail.bookThis.highlight")}</span>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 text-center">
                  {hall.name} {t("hallDetail.bookThis.desc")}
                </p>
                
                {/* Availability Calendar */}
                <HallAvailabilityIndicator hallSlug={hall.slug} />
                
                <div className="mt-4 space-y-3">
                  <Button asChild className="w-full group bg-gradient-to-r from-secondary via-accent to-secondary text-secondary-foreground shadow-md shadow-secondary/30 border border-secondary/40 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-secondary/60">
                    <Link to={`/booking?hall=${hall.slug}`}>
                      <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      {t("hallDetail.bookNow")}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-primary/50 hover:bg-primary/10">
                    <a href={`tel:${toTelHref(primaryNumber)}`}>
                      <Phone className="mr-2 h-5 w-5" />
                      {t("hallDetail.callInquire")}
                    </a>
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">📍</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {t("hallDetail.location")}
                  </h3>
                </div>
                <div className="grid gap-4 text-muted-foreground">
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 p-4">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                      <p className="mt-2 text-foreground">{hallAddresses[hall.slug]?.street || '123 Temple Street'}</p>
                      <p>
                        {[hallAddresses[hall.slug]?.area || 'Nallur', hallAddresses[hall.slug]?.city || 'Jaffna']
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p>Sri Lanka</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                    <div className="mt-3 space-y-2 text-foreground">
                      <div className="grid grid-cols-[20px_1fr] items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <a href={`tel:${toTelHref(primaryNumber)}`} className="hover:underline">
                          {primaryNumber}
                        </a>
                      </div>
                      {landlineNumber && (
                        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <a href={`tel:${toTelHref(landlineNumber)}`} className="hover:underline">
                            {landlineNumber}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">📋</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {t("hallDetail.quickFacts")}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">{t("hallDetail.capacity")}</span>
                    <span className="font-medium text-foreground">{hall.capacity.min} - {hall.capacity.max}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">{t("hallDetail.airConditioned")}</span>
                    <span className={`font-medium ${hall.facilities.ac ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hall.facilities.ac ? t("hallDetail.yes") : t("hallDetail.no")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">{t("hallDetail.parking")}</span>
                    <span className={`font-medium ${hall.facilities.parking ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hall.facilities.parking ? t("hallDetail.parking.available") : t("hallDetail.parking.limited")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Types */}
              <div className="card-traditional p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-secondary">🎉</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {t("hallDetail.idealFor")}
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
                    {t("hallDetail.officeHours")}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("hallDetail.daily")}</span>
                    <span className="text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    {t("hallDetail.siteVisits")}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: Additional Info Cards */}
            <div className="lg:hidden space-y-4 sm:space-y-6">
              {/* Location */}
              <div className="card-traditional p-4 sm:p-6 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-secondary">📍</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                    {t("hallDetail.location")}
                  </h3>
                </div>
                <div className="grid gap-3 text-muted-foreground text-sm sm:text-base">
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                      <p className="mt-2 text-foreground">{hallAddresses[hall.slug]?.street || '123 Temple Street'}</p>
                      <p>
                        {[hallAddresses[hall.slug]?.area || 'Nallur', hallAddresses[hall.slug]?.city || 'Jaffna']
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p>Sri Lanka</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                    <div className="mt-3 space-y-2 text-foreground">
                      <div className="grid grid-cols-[18px_1fr] items-center gap-2">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <a href={`tel:${toTelHref(primaryNumber)}`} className="hover:underline">{primaryNumber}</a>
                      </div>
                      {landlineNumber && (
                        <div className="grid grid-cols-[18px_1fr] items-center gap-2">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          <a href={`tel:${toTelHref(landlineNumber)}`} className="hover:underline">{landlineNumber}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="card-traditional p-4 sm:p-6 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-secondary">📋</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                    {t("hallDetail.quickFacts")}
                  </h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-xs sm:text-sm">{t("hallDetail.capacity")}</span>
                    <span className="font-medium text-foreground text-sm sm:text-base">{hall.capacity.min} - {hall.capacity.max}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-xs sm:text-sm">{t("hallDetail.airConditioned")}</span>
                    <span className={`font-medium text-sm sm:text-base ${hall.facilities.ac ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hall.facilities.ac ? t("hallDetail.yes") : t("hallDetail.no")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-xs sm:text-sm">{t("hallDetail.parking")}</span>
                    <span className={`font-medium text-sm sm:text-base ${hall.facilities.parking ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {hall.facilities.parking ? t("hallDetail.parking.available") : t("hallDetail.parking.limited")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Types */}
              <div className="card-traditional p-4 sm:p-6 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-secondary">🎉</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                    {t("hallDetail.idealFor")}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {hall.eventTypes.map((type) => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className="bg-primary/5 border-primary/30 text-foreground hover:bg-primary/10 transition-colors text-xs sm:text-sm"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Hours */}
              <div className="card-traditional p-4 sm:p-6 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-secondary">🕐</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                    {t("hallDetail.officeHours")}
                  </h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("hallDetail.daily")}</span>
                    <span className="text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50">
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    {t("hallDetail.siteVisits")}
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
