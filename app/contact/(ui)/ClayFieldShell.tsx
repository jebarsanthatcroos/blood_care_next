'use client';

import { useState } from 'react';
import { CLAY, SHADOW } from '../../../lib/clay';

export const ClayFieldShell = ({
  children,
  hasError,
  disabled,
}: {
  children: React.ReactNode;
  hasError?: boolean;
  disabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="rounded-2xl transition-shadow duration-150"
      style={{
        background: CLAY.recessed,
        boxShadow: hasError
          ? `${SHADOW.pressedSm}, inset 0 0 0 1.5px ${CLAY.red}`
          : isFocused
          ? `${SHADOW.pressedSm}, inset 0 0 0 1.5px ${CLAY.teal}66`
          : SHADOW.pressedSm,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </div>
  );
};