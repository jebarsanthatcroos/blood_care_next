'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({ 
  title, 
  description, 
  className = '', 
  children 
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center mb-12 ${className}`}
    >
      {children}
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">{title}</h2>
      {description && (
        <p className="text-gray-400 max-w-xl mx-auto">{description}</p>
      )}
    </motion.div>
  );
}