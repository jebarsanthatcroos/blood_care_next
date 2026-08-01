'use client';
import { motion } from 'framer-motion';
import { CLAY, SHADOW } from '../../../lib/clay';
import { useLanguage } from '../../../lib/language';

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  details: string | string[];
  link?: string;
}

export const ContactInfoCard = ({ icon, title, details, link }: ContactInfoCardProps) => {
  const { t } = useLanguage();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative rounded-3xl p-6"
      style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.red }}
      >
        {icon}
      </div>
      <h3 className="text-sm font-semibold mb-2" style={{ color: CLAY.text }}>{title}</h3>
      {Array.isArray(details) ? (
        <div className="space-y-1">
          {details.map((detail, idx) => (
            <p key={idx} className="text-sm" style={{ color: CLAY.textMuted }}>
              {detail}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: CLAY.textMuted }}>{details}</p>
      )}
      {link && (
        <a
          href={link}
          className="mt-3 inline-block text-xs transition-colors"
          style={{ color: CLAY.red }}
        >
          {t('contactNow')}
        </a>
      )}
    </motion.div>
  );
};