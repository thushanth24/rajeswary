import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedHalls } from "@/components/home/FeaturedHalls";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* SEO: Hidden name variations for search engines */}
      <div className="sr-only" aria-hidden="true">
        <h2>Raajeshwariy Groups Wedding Halls — Also known as Rajeswary, Raajeswary, Raajeshwary, Rajeshwari, Rajeshwariy Wedding Hall Jaffna. ராஜேஸ்வரி திருமண மண்டபம் யாழ்ப்பாணம். Best wedding halls, marriage halls, mandapams and reception venues in Jaffna, Sri Lanka. Chelva Mahal Kokuvil, Chelva Palace, Karpaka Raajeshwariy Urumpirai, Raajeshwariy Kondavil, Raajeshwariy Tellipalai.</h2>
      </div>

      <HeroSection />
      <FeaturedHalls />
      <ServicesPreview />
      <TestimonialsSection />
      <CTASection
        secondaryButtonText={t("cta.contact")}
        secondaryButtonLink="/contact"
        secondaryButtonIcon={Mail}
      />
    </Layout>
  );
};

export default Index;
