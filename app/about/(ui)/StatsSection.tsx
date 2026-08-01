
'use client';

import { motion } from 'framer-motion';
import { StatCard } from './StatCard';
import { FaTint, FaUsers, FaHospital, FaMapMarkerAlt } from 'react-icons/fa';

const stats = [
  { icon: FaTint, label: 'Lives Saved', value: '2,400+' },
  { icon: FaUsers, label: 'Registered Donors', value: '5,800+' },
  { icon: FaHospital, label: 'Partner Hospitals', value: '32' },
  { icon: FaMapMarkerAlt, label: 'Cities Covered', value: '18' },
];

export const StatsSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
  >
    {stats.map((stat, i) => (
      <StatCard
        key={stat.label}
        icon={stat.icon}
        label={stat.label}
        value={stat.value}
        delay={i * 0.1}
      />
    ))}
  </motion.div>
);