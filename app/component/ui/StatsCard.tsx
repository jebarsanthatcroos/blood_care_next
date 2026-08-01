'use client';

import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface StatsCardProps {
  icon: IconType;
  value: string;
  label: string;
  index: number;
}

export function StatsCard({ icon: Icon, value, label, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white/3 border border-white/10 rounded-xl p-6 text-center"
    >
      <Icon className="text-[#FF3C6E] text-2xl mx-auto mb-3" />
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </motion.div>
  );
}