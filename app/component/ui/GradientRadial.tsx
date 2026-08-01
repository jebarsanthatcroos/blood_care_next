'use client';

export function GradientRadial() {
  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse, #E11D2E15 0%, transparent 65%)' }}
    />
  );
}