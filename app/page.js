"use client";

import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeatureConsultation from "@/components/sections/FeatureConsultation";
import FeaturePrescription from "@/components/sections/FeaturePrescription";
import FeatureDelivery from "@/components/sections/FeatureDelivery";
import StatsSection from "@/components/sections/StatsSection";
import FeatureVolunteer from "@/components/sections/FeatureVolunteer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import MobileAppSection from "@/components/sections/MobileAppSection";
import FAQSection from "@/components/sections/FAQSection";
import DonationsSection from "@/components/sections/DonationsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <FeatureConsultation />
      <FeaturePrescription />
      <FeatureDelivery />
      <StatsSection />
      <DonationsSection />
      <FeatureVolunteer />
      <TestimonialsSection />
      <CTASection />
      <MobileAppSection />
      <FAQSection />
    </>
  );
}
