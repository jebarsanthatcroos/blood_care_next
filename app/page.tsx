'use client';

export const dynamic = 'force-static';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaTint,
  FaHeartbeat,
  FaUsers,
  FaHospital,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaCheckCircle,
} from 'react-icons/fa';
import { useLanguage } from './lib/language';

const stats = [
  { icon: FaTint, label: 'Lives Saved', value: '2,400+' },
  { icon: FaUsers, label: 'Registered Donors', value: '5,800+' },
  { icon: FaHospital, label: 'Partner Hospitals', value: '32' },
  { icon: FaMapMarkerAlt, label: 'Cities Covered', value: '18' },
];

const features = [
  {
    icon: FaClock,
    title: 'Fast Matching',
    description: 'Requests are matched with nearby compatible donors within minutes, not days.',
  },
  {
    icon: FaShieldAlt,
    title: 'Verified & Safe',
    description: 'Every donor and request is screened, so hospitals and patients can trust every match.',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Local Network',
    description: 'We connect you with donors and drives in your own city, cutting down response time.',
  },
  {
    icon: FaHeartbeat,
    title: 'Track Your Impact',
    description: 'See how many lives your donations have touched, right from your donor profile.',
  },
];

const steps = [
  { number: '01', title: 'Register', description: 'Sign up with your blood type and location in under a minute.' },
  { number: '02', title: 'Get Matched', description: 'We alert you when someone nearby needs your blood type.' },
  { number: '03', title: 'Donate', description: 'Visit a partner hospital or clinic at a time that suits you.' },
  { number: '04', title: 'Save a Life', description: 'Your donation reaches a patient, often within hours.' },
];

const testimonials = [
  {
    quote: 'I got a match request within an hour of registering. Knowing I helped someone in an emergency means everything.',
    name: 'Nadeesha P.',
    role: 'Regular Donor',
  },
  {
    quote: 'As a hospital coordinator, this platform cut our search time for rare blood types dramatically.',
    name: 'Dr. Ruwan F.',
    role: 'Partner Hospital',
  },
  {
    quote: 'Simple sign-up, clear communication, and I always know when and where I am needed.',
    name: 'Ishara W.',
    role: 'Donor since 2023',
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <main className="relative min-h-screen bg-[#03060F] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #E11D2E15 0%, transparent 65%)' }}
      />

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-40 pb-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF3C6E]/10 border border-[#FF3C6E]/20 text-[#FF3C6E] text-sm font-medium mb-6"
        >
          <FaHeartbeat className="text-xs" />
          {t('everyDonationMatters')}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6"
        >
          {t('giveBlood')}
          <br />
          <span className="bg-linear-to-r from-[#E11D2E] via-[#FF3C6E] to-[#7B2FFF] bg-clip-text text-transparent">
            {t('giveLife')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
        >
          {t('heroDescription')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/donate">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-linear-to-r from-[#E11D2E] to-[#7B2FFF] text-white font-bold shadow-lg hover:shadow-[#E11D2E]/40 transition-all"
            >
              {t('donateNow')}
              <FaArrowRight className="text-sm" />
            </motion.button>
          </Link>
          <Link href="/features">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-all"
            >
              {t('whyDonate')}
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/3 border border-white/10 rounded-xl p-6 text-center"
            >
              <stat.icon className="text-[#FF3C6E] text-2xl mx-auto mb-3" />
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">{t('whyChoose')}</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('whyChooseDescription')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/3 border border-white/10 rounded-xl p-6"
            >
              <div className="w-11 h-11 rounded-lg bg-[#FF3C6E]/10 flex items-center justify-center mb-4">
                <feature.icon className="text-[#FF3C6E] text-lg" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-black text-white text-center mb-12"
        >
          {t('howItWorksTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-white/3 border border-white/10 rounded-xl p-6"
            >
              <span className="text-[#FF3C6E]/30 text-4xl font-black">{step.number}</span>
              <h3 className="text-white font-bold text-lg mt-2 mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              {i < steps.length - 1 && (
                <FaArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 text-gray-600 text-sm" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-black text-white text-center mb-12"
        >
          {t('communityStories')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/3 border border-white/10 rounded-xl p-6"
            >
              <FaQuoteLeft className="text-[#FF3C6E]/40 text-xl mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-[#00C5A8] text-xs" />
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-white/3 border border-white/10 rounded-2xl p-10 sm:p-14"
        >
          <FaHeartbeat className="text-[#FF3C6E] text-3xl mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {t('nearbyNeedsHelp')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            {t('registrationDescription')}
          </p>
          <Link href="/donate">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-linear-to-r from-[#E11D2E] to-[#7B2FFF] text-white font-bold shadow-lg hover:shadow-[#E11D2E]/40 transition-all"
            >
              {t('becomeDonor')}
              <FaArrowRight className="text-sm" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}