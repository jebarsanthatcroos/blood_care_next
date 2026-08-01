'use client';

import { motion } from 'framer-motion';
import { CLAY, SHADOW } from '../../../lib/clay';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export function ClayCard({ 
  children, 
  className = '', 
  padding = 'p-6' 
}: ClayCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl ${padding} ${className}`}
      style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
    >
      {children}
    </motion.div>
  );
}