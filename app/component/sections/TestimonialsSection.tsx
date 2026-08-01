'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import { SectionHeading } from '../ui/SectionHeading';

const testimonials = [
  {
    quote: 'I got a match request within an hour of registering. Knowing I helped someone in an emergency means everything.',
    name: 'Nadeesha P.',
    role: 'Regular Donor',
  },
  {
    quote: 'As a hospital coordinator, this platform cut our search time for rare blood types dramatically.',
    name: 'Dr. Ruwan F.',
    role: 'Partner Hospital',
  },
  {
    quote: 'Simple sign-up, clear communication, and I always know when and where I am needed.',
    name: 'Ishara W.',
    role: 'Donor since 2023',
  },
];

interface TestimonialsSectionProps {
  t: (key: string) => string;
}

export function TestimonialsSection({ t }: TestimonialsSectionProps) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
      <SectionHeading title={t('communityStories')} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/3 border border-white/10 rounded-xl p-6"
          >
            <FaQuoteLeft className="text-[#FF3C6E]/40 text-xl mb-4" />
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{testimonial.quote}</p>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-[#00C5A8] text-xs" />
              <div>
                <p className="text-white text-sm font-medium">{testimonial.name}</p>
                <p className="text-gray-500 text-xs">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}