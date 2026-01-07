import { lazy, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { MotionProvider } from "@/lib/motion";

// Lazy load below-the-fold sections
const FeaturedHalls = lazy(() => import("@/components/home/FeaturedHalls").then(m => ({ default: m.FeaturedHalls })));
const ServicesPreview = lazy(() => import("@/components/home/ServicesPreview").then(m => ({ default: m.ServicesPreview })));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const CTASection = lazy(() => import("@/components/home/CTASection").then(m => ({ default: m.CTASection })));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MotionProvider>
        <Suspense fallback={<SectionFallback />}>
          <FeaturedHalls />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ServicesPreview />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTASection />
        </Suspense>
      </MotionProvider>
    </Layout>
  );
};

export default Index;
