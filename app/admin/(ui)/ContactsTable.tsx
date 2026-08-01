
'use client';

import { FaEye, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { Contact } from '@/types/admin';
import { getStatusBadge, formatDate } from '@/utils/admin';

interface ContactsTableProps {
  contacts: Contact[];
  onView: (contact: Contact) => void;
  onMarkRead: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const ContactsTable = ({ contacts, onView, onMarkRead, onDelete }: ContactsTableProps) => {
  if (contacts.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
          No messages found
        </td>
      </tr>
    );
  }

  return (
    <>
      {contacts.map((contact) => (
        <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
          <td className="px-4 py-3 text-white font-medium">{contact.name}</td>
          <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{contact.email}</td>
          <td className="px-4 py-3 text-gray-300">{contact.subject}</td>
          <td className="px-4 py-3 text-gray-300 hidden lg:table-cell text-sm">
            {formatDate(contact.createdAt)}
          </td>
          <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status).bg} ${getStatusBadge(contact.status).text}`}>
              {contact.status}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => onView(contact)}
                className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                title="View Details"
              >
                <FaEye className="text-sm" />
              </button>
              {contact.status === 'unread' && (
                <button
                  onClick={() => onMarkRead(contact.id, 'read')}
                  className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  title="Mark as Read"
                >
                  <FaCheckCircle className="text-sm" />
                </button>
              )}
              <button
                onClick={() => onDelete(contact.id)}
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