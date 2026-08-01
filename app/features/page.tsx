'use client';

export const dynamic = 'force-static';

import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';
import { GiHeartOrgan } from 'react-icons/gi';
import { CLAY, SHADOW } from '../../lib/clay';
import { useLanguage } from '../../lib/language';
import { ClayCTA } from './clay/ClayCTA';
import { StatsSection } from './sections/StatsSection';
import { ReasonsSection } from './sections/ReasonsSection';
import { ProcessSection } from './sections/ProcessSection';
import { MythsSection } from './sections/MythsSection';
import { EligibilitySection } from './sections/EligibilitySection';

export default function WhyDonatePage() {
  const { t } = useLanguage();
  
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-20 px-4 sm:px-6" style={{ background: CLAY.bg }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: CLAY.surface, boxShadow: SHADOW.pressedSm }}
          >
            <FaHeartbeat className="text-xs" style={{ color: CLAY.red }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CLAY.textMuted }}>
              {t('whyDonateBlood')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4" style={{ color: CLAY.text }}>
            {t('yourBloodCanSave')} <span style={{ color: CLAY.red }}>{t('saveLives')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: CLAY.textMuted }}>
            {t('featureDescription')}
          </p>
        </motion.div>

        {/* All Sections */}
        <StatsSection t={t} />
        <ReasonsSection t={t} />
        <ProcessSection t={t} />
        <MythsSection t={t} />
        <EligibilitySection t={t} />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-12 text-center overflow-hidden"
          style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
        >
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm }}
          >
            <GiHeartOrgan className="text-4xl" style={{ color: CLAY.red }} />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: CLAY.text }}>
            {t('readyDifference')}
          </h2>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: CLAY.textMuted }}>
            {t('registrationDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ClayCTA href="/donate" label={t('registerToDonate')} variant="primary" />
            <ClayCTA href="/contact" label={t('contactUsFeature')} variant="secondary" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}