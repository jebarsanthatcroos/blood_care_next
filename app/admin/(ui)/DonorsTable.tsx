
'use client';

import { FaTint, FaEye, FaCheckCircle, FaUserTimes, FaTrash } from 'react-icons/fa';
import { Donor } from '@/types/admin';
import { getStatusBadge } from '@/utils/admin';

interface DonorsTableProps {
  donors: Donor[];
  onView: (donor: Donor) => void;
  onApprove: (id: string, status: string) => void;
  onReject: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const DonorsTable = ({ donors, onView, onApprove, onReject, onDelete }: DonorsTableProps) => {
  if (donors.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
          No donors found
        </td>
      </tr>
    );
  }

  return (
    <>
      {donors.map((donor) => (
        <tr key={donor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
          <td className="px-4 py-3 text-white font-medium">{donor.fullName}</td>
          <td className="px-4 py-3">
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <FaTint className="text-xs" />
              {donor.bloodType}
            </span>
          </td>
          <td className="px-4 py-3 text-gray-300">{donor.phone}</td>
          <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{donor.city}</td>
          <td className="px-4 py-3 text-gray-300 hidden lg:table-cell text-sm">
            {donor.preferredDate || 'N/A'}
          </td>
          <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(donor.status).bg} ${getStatusBadge(donor.status).text}`}>
              {donor.status}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => onView(donor)}
                className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                title="View Details"
              >
                <FaEye className="text-sm" />
              </button>
              {donor.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(donor.id, 'approved')}
                    className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    title="Approve"
                  >
                    <FaCheckCircle className="text-sm" />
                  </button>
                  <button
                    onClick={() => onReject(donor.id, 'rejected')}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Reject"
                  >
                    <FaUserTimes className="text-sm" />
                  </button>
                </>
              )}
              <button
                onClick={() => onDelete(donor.id)}
                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Delete"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};