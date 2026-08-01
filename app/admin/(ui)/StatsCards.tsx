/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { motion } from 'framer-motion';
import { FaUsers, FaEnvelope, FaClock, FaUserCheck, FaCheckCircle } from 'react-icons/fa';
import { Stats } from '@/types/admin';

interface StatsCardsProps {
  stats: Stats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const statsConfig = [
    { icon: FaUsers, label: 'Total Donors', value: stats.totalDonors, color: 'text-blue-400' },
    { icon: FaClock, label: 'Pending', value: stats.pendingDonors, color: 'text-yellow-400' },
    { icon: FaUserCheck, label: 'Approved', value: stats.approvedDonors, color: 'text-green-400' },
    { icon: FaEnvelope, label: 'Messages', value: stats.totalContacts, color: 'text-purple-400' },
    { icon: FaCheckCircle, label: 'Unread', value: stats.unreadContacts, color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          whileHover={{ y: -2 }}
          className="bg-[#101d2d]/80 border border-white/10 rounded-xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-center justify-between">
            <stat.icon className={`${stat.color} text-xl`} />
            <span className="text-2xl font-bold text-white">{stat.value}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};