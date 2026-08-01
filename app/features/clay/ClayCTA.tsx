'use client';

import { motion } from 'framer-motion';
import { CLAY, SHADOW, usePressable } from '../../../lib/clay';

interface ClayCTAProps {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

export function ClayCTA({ href, label, variant = 'primary' }: ClayCTAProps) {
  const { isPressed, pressHandlers } = usePressable();
  
  const primaryStyles = {
    background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
    color: 'white',
    boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
  };
  
  const secondaryStyles = {
    background: CLAY.surface,
    color: CLAY.text,
    boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
  };

  return (
    <motion.a
      href={href}
      className="px-8 py-3 rounded-2xl font-semibold"
      style={variant === 'primary' ? primaryStyles : secondaryStyles}
      animate={{ scale: isPressed ? 0.96 : 1 }}
      {...pressHandlers}
    >
      {label}
    </motion.a>
  );
}