'use client';

import { motion } from 'framer-motion';
import { MdBloodtype } from 'react-icons/md';
import { ClayCard } from '../clay/ClayCard';
import { CLAY, SHADOW } from '@/lib/clay';

const ACCENTS = {
  red: CLAY.red,
  orange: '#f77f08',
  pink: '#df3704',
  purple: CLAY.purple,
  green: CLAY.teal,
  blue: '#7FA8E8',
};

const reasons = [
  {
    icon: <MdBloodtype className="w-8 h-8" />,
    title: 'reason1Title',
    description: 'reason1Description',
    accent: ACCENTS.red,
  },
  // ... other reasons
];

interface ReasonsSectionProps {
  t: (key: string) => string;
}

export function ReasonsSection({ t }: ReasonsSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-16"
    >
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
        {t('whyDonateBlood')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((reason, index) => (
          <ClayCard key={index}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ 
                background: CLAY.recessed, 
                boxShadow: SHADOW.pressedSm, 
                color: reason.accent 
              }}
            >
              {reason.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: CLAY.text }}>
              {t(reason.title)}
            </h3>
            <p className="text-sm" style={{ color: CLAY.textMuted }}>
              {t(reason.description)}
            </p>
          </ClayCard>
        ))}
      </div>
    </motion.div>
  );
}