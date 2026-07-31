'use client';

export const dynamic = 'force-static';

import { motion } from 'framer-motion';
import {
  FaHeartbeat,
  FaHandsHelping,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaAmbulance,
  FaPills,
  FaBaby,
  FaUtensils,
  FaTint,
  FaCheckCircle
} from 'react-icons/fa';
import { GiHeartOrgan } from 'react-icons/gi';
import { MdBloodtype } from 'react-icons/md';
import { CLAY, SHADOW, usePressable } from '../lib/clay';
import { useLanguage } from '../lib/language';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};


const ACCENTS = {
  red: CLAY.red,
  orange: '#f77f08',
  pink: '#df3704',
  purple: CLAY.purple,
  green: CLAY.teal,
  blue: '#7FA8E8',
};

const stats = [
  { number: '1 in 3', label: 'stat1' },
  { number: '4.5M', label: 'stat2' },
  { number: '38%', label: 'stat3' },
  { number: '3-5', label: 'stat4' },
];

const reasons = [
  {
    icon: <MdBloodtype className="w-8 h-8" />,
    title: 'reason1Title', description: 'reason1Description',
    accent: ACCENTS.red,
  },
  {
    icon: <FaAmbulance className="w-8 h-8" />,
    title: 'reason2Title', description: 'reason2Description',
    accent: ACCENTS.orange,
  },
  {
    icon: <FaBaby className="w-8 h-8" />,
    title: 'reason3Title', description: 'reason3Description',
    accent: ACCENTS.pink,
  },
  {
    icon: <FaPills className="w-8 h-8" />,
    title: 'reason4Title', description: 'reason4Description',
    accent: ACCENTS.purple,
  },
  {
    icon: <FaHeartbeat className="w-8 h-8" />,
    title: 'reason5Title', description: 'reason5Description',
    accent: ACCENTS.green,
  },
  {
    icon: <FaUsers className="w-8 h-8" />,
    title: 'reason6Title', description: 'reason6Description',
    accent: ACCENTS.blue,
  },
];

const processSteps = [
  {
    step: '1',
    title: 'process1Title', description: 'process1Description',
    icon: <FaHandsHelping className="w-6 h-6" />
  },
  {
    step: '2',
    title: 'process2Title', description: 'process2Description',
    icon: <FaShieldAlt className="w-6 h-6" />
  },
  {
    step: '3',
    title: 'process3Title', description: 'process3Description',
    icon: <FaTint className="w-6 h-6" />
  },
  {
    step: '4',
    title: 'process4Title', description: 'process4Description',
    icon: <FaUtensils className="w-6 h-6" />
  },
];

const myths = [
  {
    myth: 'myth1', fact: 'fact1',
    icon: <FaShieldAlt />
  },
  {
    myth: 'myth2', fact: 'fact2',
    icon: <FaHeartbeat />
  },
  {
    myth: 'myth3', fact: 'fact3',
    icon: <FaClock />
  },
  {
    myth: 'myth4', fact: 'fact4',
    icon: <FaUsers />
  },
];

const eligibility = [
  { label: 'age', details: 'ageDetails' },
  { label: 'weight', details: 'weightDetails' },
  { label: 'health', details: 'healthDetails' },
  { label: 'lastDonation', details: 'lastDonationDetails' },
  { label: 'hemoglobin', details: 'hemoglobinDetails' },
  { label: 'pregnancy', details: 'pregnancyDetails' },
];

/** Raised clay card wrapper — every section reuses this so depth stays
 *  consistent across the page. */
function ClayCard({
  children,
  className = '',
  padding = 'p-6',
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl ${padding} ${className}`}
      style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
    >
      {children}
    </motion.div>
  );
}

function ClayPrimaryCTA({ href, label }: { href: string; label: string }) {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.a
      href={href}
      className="px-8 py-3 rounded-2xl text-white font-semibold"
      style={{
        background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
        boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        transition: 'box-shadow 150ms ease',
      }}
      animate={{ scale: isPressed ? 0.96 : 1 }}
      {...pressHandlers}
    >
      {label}
    </motion.a>
  );
}

function ClaySecondaryCTA({ href, label }: { href: string; label: string }) {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.a
      href={href}
      className="px-8 py-3 rounded-2xl font-semibold"
      style={{
        background: CLAY.surface,
        color: CLAY.text,
        boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        transition: 'box-shadow 150ms ease',
      }}
      animate={{ scale: isPressed ? 0.96 : 1 }}
      {...pressHandlers}
    >
      {label}
    </motion.a>
  );
}

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

        {/* Stats Grid */}
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

        {/* Why Donate Section */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
            {t('whyDonateBlood')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <ClayCard key={index}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: reason.accent }}
                >
                  {reason.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: CLAY.text }}>{t(reason.title)}</h3>
                <p className="text-sm" style={{ color: CLAY.textMuted }}>{t(reason.description)}</p>
              </ClayCard>
            ))}
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
            {t('simpleDonationProcess')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <ClayCard key={index} className="text-center">
                <div
                  className="absolute -top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`, boxShadow: SHADOW.raisedSm }}
                >
                  {step.step}
                </div>
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.red }}
                >
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: CLAY.text }}>{t(step.title)}</h3>
                <p className="text-sm" style={{ color: CLAY.textMuted }}>{t(step.description)}</p>
              </ClayCard>
            ))}
          </div>
        </motion.div>

        {/* Myth vs Fact */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
            {t('mythsFacts')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myths.map((item, index) => (
              <ClayCard key={index}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center"
                    style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.red }}
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

        {/* Eligibility Section */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }} className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12" style={{ color: CLAY.text }}>
            {t('whoCanDonate')}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {eligibility.map((item, index) => (
              <ClayCard key={index} className="text-center" padding="p-4">
                <div
                  className="w-9 h-9 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.teal }}
                >
                  <FaCheckCircle className="text-sm" />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: CLAY.text }}>{t(item.label)}</h3>
                <p className="text-xs" style={{ color: CLAY.textMuted }}>{t(item.details)}</p>
              </ClayCard>
            ))}
          </div>
        </motion.div>

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
            <ClayPrimaryCTA href="/donate" label={t('registerToDonate')} />
            <ClaySecondaryCTA href="/contact" label={t('contactUsFeature')} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}