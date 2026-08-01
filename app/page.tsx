'use client';

export const dynamic = 'force-static';

import { useLanguage } from '../lib/language';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection,
} from './component/sections';
import { BackgroundGrid, GradientRadial } from './component/ui';

export default function HomePage() {
  const { t } = useLanguage();
  
  return (
    <main className="relative min-h-screen bg-[#03060F] overflow-hidden">
      <BackgroundGrid />
      <GradientRadial />
      <HeroSection t={t} />
      <StatsSection />
      <FeaturesSection t={t} />
      <HowItWorksSection t={t} />
      <TestimonialsSection t={t} />
      <CTASection t={t} />
    </main>
  );
}