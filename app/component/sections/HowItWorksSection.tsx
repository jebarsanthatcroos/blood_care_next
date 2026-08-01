'use client';

import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { SectionHeading } from '../ui/SectionHeading';

const steps = [
  { number: '01', title: 'Register', description: 'Sign up with your blood type and location in under a minute.' },
  { number: '02', title: 'Get Matched', description: 'We alert you when someone nearby needs your blood type.' },
  { number: '03', title: 'Donate', description: 'Visit a partner hospital or clinic at a time that suits you.' },
  { number: '04', title: 'Save a Life', description: 'Your donation reaches a patient, often within hours.' },
];

interface HowItWorksSectionProps {
  t: (key: string) => string;
}

export function HowItWorksSection({ t }: HowItWorksSectionProps) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
      <SectionHeading title={t('howItWorksTitle')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-white/3 border border-white/10 rounded-xl p-6"
          >
            <span className="text-[#FF3C6E]/30 text-4xl font-black">{step.number}</span>
            <h3 className="text-white font-bold text-lg mt-2 mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            {i < steps.length - 1 && (
              <FaArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 text-gray-600 text-sm" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}