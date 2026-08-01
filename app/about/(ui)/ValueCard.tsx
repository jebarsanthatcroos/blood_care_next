'use client';

import { motion } from 'framer-motion';

export const ValueCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -2 }}
    className="bg-white/3 border border-white/10 rounded-xl p-6"
  >
    <div className="w-11 h-11 rounded-lg bg-[#FF3C6E]/10 flex items-center justify-center mb-4">
      <Icon className="text-[#FF3C6E] text-lg" />
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);