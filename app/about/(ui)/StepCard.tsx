'use client';

import { motion } from 'framer-motion';

export const StepCard = ({
  number,
  title,
  description,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="relative bg-white/3 border border-white/10 rounded-xl p-6"
  >
    <span className="text-[#FF3C6E]/30 text-4xl font-black">{number}</span>
    <h3 className="text-white font-bold text-lg mt-2 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);