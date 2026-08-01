'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaArrowRight } from 'react-icons/fa';

interface CTASectionProps {
  t: (key: string) => string;
}

export function CTASection({ t }: CTASectionProps) {
  return (
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
  );
}