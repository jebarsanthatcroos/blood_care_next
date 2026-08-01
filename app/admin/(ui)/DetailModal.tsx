'use client';
import { motion } from 'framer-motion';
import { FaTint } from 'react-icons/fa';
import { Donor, Contact } from '@/types/admin';
import { getStatusBadge, formatDate } from '@/utils/admin';

interface DetailModalProps {
  donor?: Donor;
  contact?: Contact;
  onClose: () => void;
  updateDonorStatus: (id: string, status: string) => void;
  updateContactStatus: (id: string, status: string) => void;
  deleteDonor: (id: string) => void;
  deleteContact: (id: string) => void;
}

export const DetailModal = ({
  donor,
  contact,
  onClose,
  updateDonorStatus,
  updateContactStatus,
  deleteDonor,
  deleteContact,
}: DetailModalProps) => {
  const isDonor = !!donor;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#0A0F1E] border border-white/10 rounded-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {isDonor ? 'Donor Details' : 'Contact Details'}
        </h2>

        <div className="space-y-4">
          {isDonor ? (
            <DonorDetailContent
              donor={donor!}
              updateDonorStatus={updateDonorStatus}
              deleteDonor={deleteDonor}
              onClose={onClose}
            />
          ) : (
            <ContactDetailContent
              contact={contact!}
              updateContactStatus={updateContactStatus}
              deleteContact={deleteContact}
              onClose={onClose}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Sub-component for Donor Details
const DonorDetailContent = ({
  donor,
  updateDonorStatus,
  deleteDonor,
  onClose,
}: {
  donor: Donor;
  updateDonorStatus: (id: string, status: string) => void;
  deleteDonor: (id: string) => void;
  onClose: () => void;
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-500 uppercase">Full Name</label>
        <p className="text-white font-medium">{donor.fullName}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase">Blood Type</label>
        <p className="text-white font-medium flex items-center gap-2">
          <FaTint className="text-red-500" />
          {donor.bloodType}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-500 uppercase">Phone</label>
        <p className="text-white font-medium">{donor.phone}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase">Email</label>
        <p className="text-white font-medium">{donor.email || 'N/A'}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-500 uppercase">City</label>
        <p className="text-white font-medium">{donor.city}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase">Preferred Date</label>
        <p className="text-white font-medium">{donor.preferredDate || 'N/A'}</p>
      </div>
    </div>

    <div>
      <label className="text-xs text-gray-500 uppercase">Status</label>
      <div className="mt-1">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(donor.status).bg} ${getStatusBadge(donor.status).text}`}>
          {donor.status?.toUpperCase()}
        </span>
      </div>
    </div>

    {donor.message && (
      <div>
        <label className="text-xs text-gray-500 uppercase">Additional Notes</label>
        <p className="text-gray-300 text-sm mt-1">{donor.message}</p>
      </div>
    )}

    <div>
      <label className="text-xs text-gray-500 uppercase">Registered On</label>
      <p className="text-gray-400 text-sm">{donor.createdAt ? formatDate(donor.createdAt) : 'N/A'}</p>
    </div>

    <div className="flex gap-3 mt-4">
      {donor.status === 'pending' && (
        <>
          <button
            onClick={() => {
              updateDonorStatus(donor.id, 'approved');
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => {
              updateDonorStatus(donor.id, 'rejected');
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
          >
            Reject
          </button>
        </>
      )}
      <button
        onClick={() => deleteDonor(donor.id)}
        className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg text-red-400 font-medium transition-colors"
      >
        Delete
      </button>
    </div>
  </>
);

// Sub-component for Contact Details
const ContactDetailContent = ({
  contact,
  updateContactStatus,
  deleteContact,
  onClose,
}: {
  contact: Contact;
  updateContactStatus: (id: string, status: string) => void;
  deleteContact: (id: string) => void;
  onClose: () => void;
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-500 uppercase">Name</label>
        <p className="text-white font-medium">{contact.name}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase">Subject</label>
        <p className="text-white font-medium">{contact.subject}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-500 uppercase">Email</label>
        <p className="text-white font-medium">{contact.email}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase">Phone</label>
        <p className="text-white font-medium">{contact.phone || 'N/A'}</p>
      </div>
    </div>

    <div>
      <label className="text-xs text-gray-500 uppercase">Status</label>
      <div className="mt-1">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status).bg} ${getStatusBadge(contact.status).text}`}>
          {contact.status?.toUpperCase()}
        </span>
      </div>
    </div>

    <div>
      <label className="text-xs text-gray-500 uppercase">Message</label>
      <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{contact.message}</p>
    </div>

    <div>
      <label className="text-xs text-gray-500 uppercase">Received On</label>
      <p className="text-gray-400 text-sm">{contact.createdAt ? formatDate(contact.createdAt) : 'N/A'}</p>
    </div>

    <div className="flex gap-3 mt-4">
      {contact.status === 'unread' && (
        <button
          onClick={() => {
            updateContactStatus(contact.id, 'read');
            onClose();
          }}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
        >
          Mark as Read
        </button>
      )}
      <button
        onClick={() => deleteContact(contact.id)}
        className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg text-red-400 font-medium transition-colors"
      >
        Delete
      </button>
    </div>
  </>
);