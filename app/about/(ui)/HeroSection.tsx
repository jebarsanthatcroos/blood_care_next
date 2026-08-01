'use client';

import { motion } from 'framer-motion';
import { FaTint } from 'react-icons/fa';
import { SectionBadge } from './SectionBadge';

export const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-16"
  >
    <SectionBadge>
      <FaTint className="text-xs" />
      About Us
    </SectionBadge>
    <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
      Every Drop Counts
    </h1>
    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
      We&apos;re a platform dedicated to bridging the gap between blood donors
      and the patients who need them most, one connection at a time.
    </p>
  </motion.div>
);