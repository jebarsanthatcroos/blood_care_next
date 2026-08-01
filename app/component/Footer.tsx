/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { CLAY, SHADOW, usePressable } from '../../lib/clay';
import { useLanguage } from '../../lib/language';

interface NavLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color: string;
}

const navLinks: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Why Donate', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Find a Drive', href: '/donate' },
];

const quickLinks: NavLink[] = [
  { label: 'Book a Donation', href: '#features' },
  { label: 'Blood Type Guide', href: '#features' },
  { label: 'Eligibility Check', href: '#features' },
  { label: 'Emergency Requests', href: '#features' },
  { label: 'Donor Certificates', href: '#features' },
];

const socialLinks: SocialLink[] = [
  { icon: <FaGithub />, href: 'https://github.com/jebarsanthatcroos', label: 'GitHub', color: CLAY.text },
  { icon: <FaLinkedin />, href: 'https://linkedin.com/in/jebarsanthatcroos', label: 'LinkedIn', color: CLAY.purple },
  { icon: <FaEnvelope />, href: 'mailto:jebarsanthatcroos@gmail.com', label: 'Email', color: CLAY.teal },
];

function EcgDivider() {
  return (
    <div className="relative h-10 w-full overflow-hidden mb-8">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full">
        <line x1="0" y1="20" x2="1440" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <motion.path
          d="M0,20 L300,20 L340,20 L360,4 L380,36 L400,2 L420,36 L440,20 L600,20 L640,20 L660,4 L680,36 L700,2 L720,36 L740,20 L900,20 L940,20 L960,4 L980,36 L1000,2 L1020,36 L1040,20 L1200,20 L1240,20 L1260,4 L1280,36 L1300,2 L1320,36 L1340,20 L1440,20"
          fill="none"
          stroke="url(#ecgGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={CLAY.red} stopOpacity="0" />
            <stop offset="30%" stopColor={CLAY.red} stopOpacity="0.8" />
            <stop offset="60%" stopColor={CLAY.teal} stopOpacity="0.8" />
            <stop offset="100%" stopColor={CLAY.purple} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function FooterLink({ label, href }: NavLink) {
  const { t } = useLanguage();
  const translatedLabel = {
    'Overview': t('overview'),
    'Why Donate': t('whyDonate'),
    'How It Works': t('howItWorks'),
    'Find a Drive': t('findDrive'),
    'Book a Donation': t('bookDonation'),
    'Blood Type Guide': t('bloodTypeGuide'),
    'Eligibility Check': t('eligibilityCheck'),
    'Emergency Requests': t('emergencyRequests'),
    'Donor Certificates': t('donorCertificates'),
  }[label] || label;
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
      <Link
        href={href}
        className="group flex items-center gap-2 text-sm transition-colors duration-200"
        style={{ color: CLAY.textMuted }}
      >
        <motion.span
          className="w-0 group-hover:w-3 h-px transition-all duration-300 block"
          style={{ background: `linear-gradient(90deg, ${CLAY.red}, ${CLAY.purple})` }}
        />
        <span className="group-hover:text-white transition-colors" style={{ color: 'inherit' }}>{translatedLabel}</span>
      </Link>
    </motion.div>
  );
}

function SocialButton({ icon, href, label, color }: SocialLink) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const { isPressed, pressHandlers } = usePressable();

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.4);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        x: sx,
        y: sy,
        background: CLAY.surface,
        boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        color: CLAY.textMuted,
        transition: 'box-shadow 150ms ease, color 150ms ease',
      }}
      onMouseMove={(e) => {
        handleMove(e);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        pressHandlers.onMouseLeave();
      }}
      onMouseDown={pressHandlers.onMouseDown}
      onMouseUp={pressHandlers.onMouseUp}
      onTouchStart={pressHandlers.onTouchStart}
      onTouchEnd={pressHandlers.onTouchEnd}
      whileHover={{ scale: 1.08, color }}
      whileTap={{ scale: 0.94 }}
      className="relative w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden"
    >
      <span className="relative z-10 text-base">{icon}</span>
    </motion.a>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { isPressed, pressHandlers } = usePressable();

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: isPressed ? 0.92 : 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-2xl flex items-center justify-center text-white"
          style={{
            background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
            boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
            transition: 'box-shadow 150ms ease',
          }}
          aria-label="Scroll to top"
          {...pressHandlers}
        >
          <FaArrowUp className="text-sm" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function HeartbeatLogo() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="relative w-9 h-9 shrink-0 rounded-2xl" style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm }}>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaHeartbeat className="text-sm" style={{ color: CLAY.red }} />
        </motion.div>
      </div>

      <div>
        <div className="font-black text-sm leading-tight" style={{ color: CLAY.text }}>BloodCare</div>
        <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: CLAY.textMuted }}>Blood Donation Platform</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <>
      <ScrollToTop />

      <footer
        ref={ref}
        className="relative overflow-hidden"
        style={{ background: CLAY.bg }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

          <EcgDivider />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14"
          >

            {/* Col 1 — Brand */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <HeartbeatLogo />
              <p className="text-xs leading-relaxed mb-6 max-w-xs" style={{ color: CLAY.textMuted }}>
                  {t('connectingDonors')}
              </p>
              <div className="flex gap-2">
                {socialLinks.map((s, i) => (
                  <SocialButton key={i} {...s} />
                ))}
              </div>
            </motion.div>

            {/* Col 2 — Platform */}
            <motion.div variants={itemVariants}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: CLAY.red }}>{t('platform')}</h4>
              <div className="space-y-3">
                {navLinks.map((l, i) => (
                  <FooterLink key={i} {...l} />
                ))}
              </div>
            </motion.div>

            {/* Col 3 — Services */}
            <motion.div variants={itemVariants}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: CLAY.teal }}>{t('services')}</h4>
              <div className="space-y-3">
                {quickLinks.map((l, i) => (
                  <FooterLink key={i} {...l} />
                ))}
              </div>
            </motion.div>

            {/* Col 4 — Trust / Info card */}
            <motion.div variants={itemVariants}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: CLAY.purple }}>{t('getInvolved')}</h4>

              <div
                className="relative p-5 rounded-2xl overflow-hidden"
                style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm }}
                  >
                    <FaHeartbeat style={{ color: CLAY.red }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-snug" style={{ color: CLAY.text }}>{t('becomeRegularDonor')}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: CLAY.textMuted }}>{t('everyThreeMonths')}</p>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed" style={{ color: CLAY.textMuted }}>
                  {t('registerToday')}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: CLAY.teal }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: CLAY.teal }} />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: CLAY.textMuted }}>{t('donationsOpen')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative pt-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs" style={{ color: CLAY.textMuted }}>
                  © {currentYear}{' '}
                  <span className="font-semibold" style={{ color: CLAY.text }}>BloodCare</span>
                  {' '}· {t('allRightsReserved')}
                </p>
                <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: CLAY.textMuted }}>
                  {t('everyDropCounts')}
                </p>
              </div>

              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: CLAY.surface, boxShadow: SHADOW.pressedSm }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: CLAY.red }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: CLAY.textMuted }}>
                  {t('bloodcareSystem')}
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: CLAY.teal }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </footer>
    </>
  );
}