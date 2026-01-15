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
