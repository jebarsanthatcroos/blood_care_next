'use client';

import { 
  FaTint, 
  FaUsers, 
  FaHospital, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { StatsCard } from '../ui/StatsCard';

const stats = [
  { icon: FaTint, label: 'Lives Saved', value: '2,400+' },
  { icon: FaUsers, label: 'Registered Donors', value: '5,800+' },
  { icon: FaHospital, label: 'Partner Hospitals', value: '32' },
  { icon: FaMapMarkerAlt, label: 'Cities Covered', value: '18' },
];

export function StatsSection() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}