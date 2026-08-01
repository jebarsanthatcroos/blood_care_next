'use client';

import { motion } from 'framer-motion';
import {
  FaClock,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
} from 'react-icons/fa';
import { SectionHeading } from '../ui/SectionHeading';

const features = [
  {
    icon: FaClock,
    title: 'Fast Matching',
    description: 'Requests are matched with nearby compatible donors within minutes, not days.',
  },
  {
    icon: FaShieldAlt,
    title: 'Verified & Safe',
    description: 'Every donor and request is screened, so hospitals and patients can trust every match.',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Local Network',
    description: 'We connect you with donors and drives in your own city, cutting down response time.',
  },
  {
    icon: FaHeartbeat,
    title: 'Track Your Impact',
    description: 'See how many lives your donations have touched, right from your donor profile.',
  },
];

interface FeaturesSectionProps {
  t: (key: string) => string;
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
      <SectionHeading
        title={t('whyChoose')}
        description={t('whyChooseDescription')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white/3 border border-white/10 rounded-xl p-6"
          >
            <div className="w-11 h-11 rounded-lg bg-[#FF3C6E]/10 flex items-center justify-center mb-4">
              <feature.icon className="text-[#FF3C6E] text-lg" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}