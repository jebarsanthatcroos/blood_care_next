'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { ClayCard } from '../clay/ClayCard';
import { CLAY, SHADOW } from '@/lib/clay';

const eligibility = [
  { label: 'age', details: 'ageDetails' },
  { label: 'weight', details: 'weightDetails' },
  { label: 'health', details: 'healthDetails' },
  { label: 'lastDonation', details: 'lastDonationDetails' },
  { label: 'hemoglobin', details: 'hemoglobinDetails' },
  { label: 'pregnancy', details: 'pregnancyDetails' },
];

interface EligibilitySectionProps {
  t: (key: string) => string;
}

export function EligibilitySection({ t }: EligibilitySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mb-16"
    >
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
        {t('whoCanDonate')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {eligibility.map((item, index) => (
          <ClayCard key={index} className="text-center" padding="p-4">
            <div
              className="w-9 h-9 mx-auto mb-2 rounded-xl flex items-center justify-center"
              style={{ 
                background: CLAY.recessed, 
                boxShadow: SHADOW.pressedSm, 
                color: CLAY.teal 
              }}
            >
              <FaCheckCircle className="text-sm" />
            </div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: CLAY.text }}>
              {t(item.label)}
            </h3>
            <p className="text-xs" style={{ color: CLAY.textMuted }}>
              {t(item.details)}
            </p>
          </ClayCard>
        ))}
      </div>
    </motion.div>
  );
}