import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getHallBySlug } from "@/data/halls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const HallDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const hall = slug ? getHallBySlug(slug) : undefined;

  if (!hall) {
    return <Navigate to="/halls" replace />;
  }

  const facilities = [
    { name: "Air Conditioning", available: hall.facilities.ac, icon: Snowflake },
    { name: "Parking", available: hall.facilities.parking, icon: Car },
    { name: "Dining Area", available: hall.facilities.dining, icon: UtensilsCrossed },
    { name: "Stage", available: hall.facilities.stage, icon: User },
    { name: "Power Backup", available: hall.facilities.powerBackup, icon: Zap },
    { name: "Bride Room", available: hall.facilities.brideRoom, icon: User },
    { name: "Groom Room", available: hall.facilities.groomRoom, icon: User },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src={hall.image}
            alt={hall.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 pb-12">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {hall.eventTypes.map((type) => (
                <Badge key={type} className="bg-primary/90 text-primary-foreground">
                  {type}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-card mb-4">
              {hall.name}
            </h1>
            <div className="flex items-center gap-4 text-card/90">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
              </div>
              <span className="text-primary font-semibold">
                {hall.priceRange}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {hall.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Key Features
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {hall.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border"
                    >
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Facilities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {facilities.map((facility) => (
                    <div
                      key={facility.name}
                      className={`flex items-center gap-3 p-4 rounded-lg border ${
                        facility.available
                          ? "bg-card border-border"
                          : "bg-muted/20 border-border/50 opacity-50"
                      }`}
                    >
                      <facility.icon className={`h-5 w-5 ${facility.available ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={facility.available ? "text-foreground" : "text-muted-foreground"}>
                        {facility.name}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-foreground">
                      {hall.facilities.washrooms} Washrooms
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Preview */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Menu Options
                </h2>
                <p className="text-muted-foreground mb-4">
                  We offer a variety of menu packages including breakfast, lunch, and 
                  dinner options with both vegetarian and non-vegetarian choices.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/menus">View Full Menu</Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  Book This Hall
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Secure your date and start planning your perfect event at {hall.name}.
                </p>
                <Button asChild className="w-full mb-3">
                  <Link to={`/booking?hall=${hall.id}`}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Now
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="tel:+919876543210">
                    <Phone className="mr-2 h-5 w-5" />
                    Call to Inquire
                  </a>
                </Button>
              </div>

              {/* Location */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  Location
                </h3>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p>123 Wedding Avenue</p>
                    <p>Celebration District</p>
                    <p>Mumbai - 400001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HallDetailPage;
