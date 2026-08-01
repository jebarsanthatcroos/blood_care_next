'use client';

import { FaSearch } from 'react-icons/fa';
import { TabType } from '@/types/admin';

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  activeTab: TabType;
}

export const AdminFilters = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  activeTab,
}: AdminFiltersProps) => {
  const statusOptions = activeTab === 'donors'
    ? ['all', 'pending', 'approved', 'rejected']
    : ['all', 'unread', 'read'];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-50">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3C6E]"
          />
        </div>
      </div>

      <div>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF3C6E]"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};