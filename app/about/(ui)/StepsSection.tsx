'use client';

import { SectionTitle } from './SectionTitle';
import { StepCard } from './StepCard';

const steps = [
  {
    number: '01',
    title: 'Register',
    description: 'Sign up as a donor with your blood type, city, and contact details.',
  },
  {
    number: '02',
    title: 'Get Matched',
    description: 'When someone nearby needs your blood type, we reach out to you directly.',
  },
  {
    number: '03',
    title: 'Donate',
    description: 'Visit the partner hospital or clinic at a time that works for you.',
  },
  {
    number: '04',
    title: 'Save a Life',
    description: 'Your donation reaches a patient in need, often within hours.',
  },
];

export const StepsSection = () => (
  <div className="mb-20">
    <SectionTitle>How It Works</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, i) => (
        <StepCard
          key={step.number}
          number={step.number}
          title={step.title}
          description={step.description}
          delay={i * 0.1}
        />
      ))}
    </div>
  </div>
);