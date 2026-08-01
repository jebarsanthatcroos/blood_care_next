'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaHeartbeat, FaClock, FaUsers } from 'react-icons/fa';
import { ClayCard } from '../clay/ClayCard';
import { CLAY, SHADOW } from '@/lib/clay';

const myths = [
  {
    myth: 'myth1',
    fact: 'fact1',
    icon: <FaShieldAlt />
  },
  {
    myth: 'myth2',
    fact: 'fact2',
    icon: <FaHeartbeat />
  },
  {
    myth: 'myth3',
    fact: 'fact3',
    icon: <FaClock />
  },
  {
    myth: 'myth4',
    fact: 'fact4',
    icon: <FaUsers />
  },
];

interface MythsSectionProps {
  t: (key: string) => string;
}

export function MythsSection({ t }: MythsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-16"
    >
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
        {t('mythsFacts')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myths.map((item, index) => (
          <ClayCard key={index}>
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: CLAY.recessed, 
                  boxShadow: SHADOW.pressedSm, 
                  color: CLAY.red 
                }}
              >
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: CLAY.red }}>✕ {t('mythLabel')}:</span>
                  <span style={{ color: CLAY.text }}>{t(item.myth)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: CLAY.teal }}>✓ {t('factLabel')}:</span>
                  <span className="text-sm" style={{ color: CLAY.textMuted }}>{t(item.fact)}</span>
                </div>
              </div>
            </div>
          </ClayCard>
        ))}
      </div>
    </motion.div>
  );
}