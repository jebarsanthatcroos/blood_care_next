'use client';

import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import { CLAY ,SHADOW } from '../../../lib/clay';
import { useLanguage } from '../../../lib/language';

export const ContactHeader = () => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
        style={{ background: CLAY.surface, boxShadow: SHADOW.pressedSm }}
      >
        <FaEnvelope className="text-xs" style={{ color: CLAY.red }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CLAY.textMuted }}>
          {t('getInTouch')}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: CLAY.text }}>
        {t('contactUs')}
      </h1>
      <p className="max-w-xl mx-auto" style={{ color: CLAY.textMuted }}>
        {t('contactDescription')}
      </p>
    </motion.div>
  );
};