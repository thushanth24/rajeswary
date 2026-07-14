import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Phone, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AREAS, HALLS, SITE, mapUrl } from "@/seo/seo";

const AreaLanding = () => {
  const { area: areaSlug } = useParams<{ area: string }>();
  const { language } = useLanguage();
  const ta = language === "ta";

  const area = areaSlug ? AREAS[areaSlug] : undefined;
  if (!area) {
    return <Navigate to="/halls" replace />;
  }

  const pick = (en: string, taVal?: string) => (ta && taVal ? taVal : en);
  const halls = area.hallSlugs.map((slug) => ({ slug, ...HALLS[slug] })).filter((h) => h.name);

  const canonicalBase = `/wedding-halls/${areaSlug}`;

  // FAQPage schema drives rich results for "wedding hall <area>" queries.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((f) => ({
      "@type": "Question",
      name: pick(f.q, f.qTa),
      acceptedAnswer: { "@type": "Answer", text: pick(f.a, f.aTa) },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pick(area.title, area.titleTa),
    itemListElement: halls.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/halls/${h.slug}`,
      name: h.name,
    })),
  };

  return (
    <Layout>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary mb-3">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                {pick("Jaffna District", "யாழ்ப்பாண மாவட்டம்")}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {pick(
                `Wedding Halls in ${area.name}`,
                `${area.nameTa} திருமண மண்டபங்கள்`
              )}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              {pick(area.intro, area.introTa)}
            </p>
          </div>
        </div>
      </section>

      {/* Venues in this area */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8">
            {pick(
              halls.length > 1 ? `Our venues near ${area.name}` : `Our venue in ${area.name}`,
              `${area.nameTa} பகுதியில் எங்கள் மண்டபங்கள்`
            )}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {halls.map((h) => (
              <div key={h.slug} className="card-traditional p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {pick(h.name, h.nameTa)}
                </h3>
                <div className="flex items-start gap-2 text-muted-foreground text-sm mb-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{h.street}, Jaffna</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href={`tel:${h.phone}`} className="hover:underline">
                    {h.phone}
                  </a>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link to={`/halls/${h.slug}`}>
                      {pick("View hall", "மண்டபத்தைப் பார்க்க")}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/booking?hall=${h.slug}`}>
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {pick("Check dates", "காலி நாட்கள்")}
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={mapUrl(h)} target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-1.5 h-4 w-4" />
                      {pick("Directions", "வழிகாட்டல்")}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
            {pick("Frequently asked questions", "அடிக்கடி கேட்கப்படும் கேள்விகள்")}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {area.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium">
                  {pick(f.q, f.qTa)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {pick(f.a, f.aTa)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {pick(
              `Planning a wedding in ${area.name}?`,
              `${area.nameTa} இல் திருமணம் திட்டமிடுகிறீர்களா?`
            )}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {pick(
              "Check real-time availability and reserve your date online, or call us to arrange a site visit.",
              "காலி நாட்களைப் பார்த்து இணையத்தில் முன்பதிவு செய்யுங்கள், அல்லது நேரில் பார்வையிட எங்களை அழையுங்கள்."
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/booking">{pick("Book now", "இப்போது முன்பதிவு")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">{pick("Contact us", "தொடர்பு கொள்க")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AreaLanding;
