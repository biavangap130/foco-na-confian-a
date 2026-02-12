import HeroSection from "@/components/landing/HeroSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import TipsSection from "@/components/landing/TipsSection";
import ContentSection from "@/components/landing/ContentSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import GuaranteeSection from "@/components/landing/GuaranteeSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProblemsSection />
      <TipsSection />
      <ContentSection />
      <TestimonialsSection />
      <GuaranteeSection />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
