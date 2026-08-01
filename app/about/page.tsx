'use client';

export const dynamic = 'force-static';

import { Background } from './(ui)/Background';
import { HeroSection } from './(ui)//HeroSection';
import { StatsSection } from './(ui)/StatsSection';
import { ValuesSection } from './(ui)/ValuesSection';
import { StepsSection } from './(ui)/StepsSection';
import { CTASection } from './(ui)//CTASection';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#03060F] overflow-hidden pt-28 pb-20 px-4 sm:px-6">
      <Background />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <HeroSection />
        <StatsSection />
        <ValuesSection />
        <StepsSection />
        <CTASection />
      </div>
    </main>
  );
}