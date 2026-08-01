'use client';

import { motion } from 'framer-motion';
import { CLAY, SHADOW, usePressable } from '../../../lib/clay';

export const ClaySocialIcon = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) => {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className="w-10 h-10 rounded-2xl flex items-center justify-center"
      style={{
        background: CLAY.surface,
        color: CLAY.textMuted,
        boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        transition: 'box-shadow 150ms ease, color 150ms ease',
      }}
      aria-label={label}
      {...pressHandlers}
    >
      <Icon className="w-4 h-4" />
    </motion.a>
  );
};