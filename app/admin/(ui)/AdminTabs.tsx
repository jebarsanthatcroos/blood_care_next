'use client';

import { FaUsers, FaEnvelope } from 'react-icons/fa';
import { TabType } from '@/types/admin';

interface AdminTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  return (
    <div className="flex gap-2 mb-6 border-b border-white/10">
      <button
        onClick={() => onTabChange('donors')}
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === 'donors'
            ? 'text-white border-b-2 border-[#FF3C6E]'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <FaUsers className="inline mr-2" />
        Donors
      </button>
      <button
        onClick={() => onTabChange('contacts')}
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === 'contacts'
            ? 'text-white border-b-2 border-[#FF3C6E]'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <FaEnvelope className="inline mr-2" />
        Messages
      </button>
    </div>
  );
};