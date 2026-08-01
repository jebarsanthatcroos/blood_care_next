'use client';

import { motion } from 'framer-motion';
import { ClayCard } from '../clay/ClayCard';
import { CLAY } from '@/lib/clay';

const stats = [
  { number: '1 in 3', label: 'stat1' },
  { number: '4.5M', label: 'stat2' },
  { number: '38%', label: 'stat3' },
  { number: '3-5', label: 'stat4' },
];

interface StatsSectionProps {
  t: (key: string) => string;
}

export function StatsSection({ t }: StatsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, index) => (
        <ClayCard key={index} className="text-center">
          <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: CLAY.text }}>
            {stat.number}
          </div>
          <p className="text-sm" style={{ color: CLAY.textMuted }}>{t(stat.label)}</p>
        </ClayCard>
      ))}
    </motion.div>
  );
}