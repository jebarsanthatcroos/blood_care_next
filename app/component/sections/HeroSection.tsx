'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaArrowRight } from 'react-icons/fa';

interface HeroSectionProps {
  t: (key: string) => string;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
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
  );
}