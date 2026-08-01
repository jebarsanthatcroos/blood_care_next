'use client';

import { FaHeartbeat, FaShieldAlt, FaClock, FaHandHoldingHeart } from 'react-icons/fa';
import { SectionTitle } from './SectionTitle';
import { ValueCard } from './ValueCard';

const values = [
  {
    icon: FaHeartbeat,
    title: 'Our Mission',
    description:
      'Connect willing donors with patients in need, quickly and reliably, so that no one waits too long for the blood that could save their life.',
  },
  {
    icon: FaShieldAlt,
    title: 'Safety First',
    description:
      'Every donation follows strict screening and handling protocols set by our partner hospitals and health authorities.',
  },
  {
    icon: FaClock,
    title: 'Always Available',
    description:
      'Our platform runs around the clock, so a request for blood is matched with nearby donors as soon as it comes in.',
  },
  {
    icon: FaHandHoldingHeart,
    title: 'Community Driven',
    description:
      'Built by and for the community — every donor profile, every request, and every match brings us closer as a network of people helping people.',
  },
];

export const ValuesSection = () => (
  <div className="mb-20">
    <SectionTitle>What Drives Us</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {values.map((value, i) => (
        <ValueCard
          key={value.title}
          icon={value.icon}
          title={value.title}
          description={value.description}
          delay={i * 0.1}
        />
      ))}
    </div>
  </div>
);