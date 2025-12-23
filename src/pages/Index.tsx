import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedHalls } from "@/components/home/FeaturedHalls";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedHalls />
      <ServicesPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
