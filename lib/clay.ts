"use client"

import { useState } from 'react';


export const CLAY = {
  bg: '#14171F',
  surface: '#1A1E29',
  recessed: '#12141C',
  red: '#ee0c2a',
  purple: '#3e0aeb',
  teal: '#08ecc6',
  text: '#E9E7F0',
  textMuted: '#8A8DA0',
} as const;

export const SHADOW = {
  raised: '8px 8px 18px rgba(4,5,9,0.65), -6px -6px 14px rgba(255,255,255,0.035)',
  raisedHover: '10px 10px 22px rgba(4,5,9,0.7), -7px -7px 16px rgba(255,255,255,0.05)',
  raisedSm: '5px 5px 11px rgba(4,5,9,0.6), -4px -4px 9px rgba(255,255,255,0.03)',
  flat: '2px 2px 5px rgba(4,5,9,0.4), -1px -1px 4px rgba(255,255,255,0.02)',
  pressed: 'inset 5px 5px 10px rgba(4,5,9,0.6), inset -4px -4px 8px rgba(255,255,255,0.02)',
  pressedSm: 'inset 3px 3px 7px rgba(4,5,9,0.55), inset -2px -2px 5px rgba(255,255,255,0.02)',
} as const;


export function usePressable() {
  const [isPressed, setIsPressed] = useState(false);
  return {
    isPressed,
    pressHandlers: {
      onMouseDown: () => setIsPressed(true),
      onMouseUp: () => setIsPressed(false),
      onMouseLeave: () => setIsPressed(false),
      onTouchStart: () => setIsPressed(true),
      onTouchEnd: () => setIsPressed(false),
    },
  };
}