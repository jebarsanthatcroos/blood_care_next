'use client';

import { motion } from 'framer-motion';
import { FaHandHoldingHeart } from 'react-icons/fa';

export const CTASection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center bg-white/3 border border-white/10 rounded-2xl p-10 sm:p-14"
  >
    <FaHandHoldingHeart className="text-[#FF3C6E] text-3xl mx-auto mb-4" />
    <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
      Ready to Make a Difference?
    </h2>
    <p className="text-gray-400 max-w-xl mx-auto mb-6">
      Join our network of donors today. It takes a few minutes to register,
      and it could save someone&apos;s life tomorrow.
    </p>
    <a
      href="/Donate"
      className="inline-block px-8 py-3 bg-[#FF3C6E] hover:bg-[#E11D2E] rounded-lg text-white font-bold transition-colors"
    >
      Become a Donor
    </a>
  </motion.div>
);