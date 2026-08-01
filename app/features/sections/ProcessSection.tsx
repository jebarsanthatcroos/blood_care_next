'use client';

import { motion } from 'framer-motion';

import { ClayCard } from '../clay/ClayCard';
import { CLAY, SHADOW } from '@/lib/clay';
import { FaHandsHelping } from 'react-icons/fa';

const processSteps = [
  {
    step: '1',
    title: 'process1Title',
    description: 'process1Description',
    icon: <FaHandsHelping className="w-6 h-6" />
  },
  // ... other steps
];

interface ProcessSectionProps {
  t: (key: string) => string;
}

export function ProcessSection({ t }: ProcessSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-16"
    >
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
        {t('simpleDonationProcess')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, index) => (
          <ClayCard key={index} className="text-center">
            <div
              className="absolute -top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ 
                background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`, 
                boxShadow: SHADOW.raisedSm 
              }}
            >
              {step.step}
            </div>
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ 
                background: CLAY.recessed, 
                boxShadow: SHADOW.pressedSm, 
                color: CLAY.red 
              }}
            >
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: CLAY.text }}>
              {t(step.title)}
            </h3>
            <p className="text-sm" style={{ color: CLAY.textMuted }}>
              {t(step.description)}
            </p>
          </ClayCard>
        ))}
      </div>
    </motion.div>
  );
}