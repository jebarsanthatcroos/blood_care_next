'use client';
import { FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { CLAY, SHADOW } from '../../../lib/clay';
import { useLanguage } from '../../../lib/language';
import { ClaySocialIcon } from './ClaySocialIcon';

export const ContactSidebar = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  // Fix 1: Use NEXT_PUBLIC prefix for environment variables
  const mapEmbedUrl = process.env.NEXT_PUBLIC_MAP_EMBED_URL || 
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.674357682451!2d79.7248248!3d9.0933521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe0b278aebd407%3A0x4774656e4a90f7f2!2sDivisional%20Hospital%20Talaimannar!5e0!3m2!1sen!2slk!4v1690000000000!5m2!1sen!2slk";

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative rounded-3xl p-6 overflow-hidden" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: CLAY.text }}>{t('findUs')}</h3>
        <div className="relative w-full h-64 rounded-2xl overflow-hidden" style={{ boxShadow: SHADOW.pressedSm }}>
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Divisional Hospital, Talaimannar Location"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="relative rounded-3xl p-6" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: CLAY.text }}>{t('connectWithUs')}</h3>
        <div className="flex gap-3">
          {socialLinks.map((social, index) => (
            <ClaySocialIcon key={index} href={social.href} label={social.label} icon={social.icon} />
          ))}
        </div>
      </div>

      {/* Quick Response */}
      <div className="relative rounded-3xl p-6" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: CLAY.text }}>{t('quickResponse')}</h3>
        <p className="text-sm mb-4" style={{ color: CLAY.textMuted }}>
          {t('quickResponseDescription')}
        </p>
        <div className="flex items-center gap-2 text-xs" style={{ color: CLAY.textMuted }}>
          <FaClock style={{ color: CLAY.red }} />
          <span>{t('availableHours')}</span>
        </div>
      </div>
    </div>
  );
};