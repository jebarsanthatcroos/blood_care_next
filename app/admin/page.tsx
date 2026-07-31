/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

export const dynamic = 'force-static';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaEnvelope,
  FaTint,
  FaSearch,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaUserTimes,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaHeartbeat,
} from 'react-icons/fa';
import {
  db
} from '../lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,

  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { AdminGuard } from '../component/RouteGuards';

interface Donor {
  id: string;
  fullName: string;
  bloodType: string;
  phone: string;
  email: string;
  city: string;
  preferredDate: string;
  message: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type TabType = 'donors' | 'contacts';

type StatusBadge = { bg: string; text: string };

// Format date
const formatDate = (timestamp: Timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Get status badge color
const getStatusBadge = (status: string): StatusBadge => {
  const statusMap: Record<string, StatusBadge> = {
    'pending': { bg: 'bg-yellow-500/20', text: 'text-yellow-500' },
    'approved': { bg: 'bg-green-500/20', text: 'text-green-500' },
    'rejected': { bg: 'bg-red-500/20', text: 'text-red-500' },
    'unread': { bg: 'bg-blue-500/20', text: 'text-blue-500' },
    'read': { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  };
  return statusMap[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };
};

// Detail Modal — declared outside AdminPageContent so it isn't recreated every render
interface DetailModalProps {
  donor?: Donor;
  contact?: Contact;
  onClose: () => void;
  updateDonorStatus: (id: string, status: string) => void;
  updateContactStatus: (id: string, status: string) => void;
  deleteDonor: (id: string) => void;
  deleteContact: (id: string) => void;
}

function DetailModal({
  donor,
  contact,
  onClose,
  updateDonorStatus,
  updateContactStatus,
  deleteDonor,
  deleteContact,
}: DetailModalProps) {
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
            // Donor details
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Full Name</label>
                  <p className="text-white font-medium">{donor?.fullName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Blood Type</label>
                  <p className="text-white font-medium flex items-center gap-2">
                    <FaTint className="text-red-500" />
                    {donor?.bloodType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  <p className="text-white font-medium">{donor?.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="text-white font-medium">{donor?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">City</label>
                  <p className="text-white font-medium">{donor?.city}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Preferred Date</label>
                  <p className="text-white font-medium">{donor?.preferredDate || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(donor?.status || 'pending').bg} ${getStatusBadge(donor?.status || 'pending').text}`}>
                    {donor?.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {donor?.message && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Additional Notes</label>
                  <p className="text-gray-300 text-sm mt-1">{donor.message}</p>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 uppercase">Registered On</label>
                <p className="text-gray-400 text-sm">{donor?.createdAt ? formatDate(donor.createdAt) : 'N/A'}</p>
              </div>

              <div className="flex gap-3 mt-4">
                {donor?.status === 'pending' && (
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
                  onClick={() => deleteDonor(donor!.id)}
                  className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg text-red-400 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            // Contact details
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Name</label>
                  <p className="text-white font-medium">{contact?.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Subject</label>
                  <p className="text-white font-medium">{contact?.subject}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="text-white font-medium">{contact?.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  <p className="text-white font-medium">{contact?.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact?.status || 'unread').bg} ${getStatusBadge(contact?.status || 'unread').text}`}>
                    {contact?.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Message</label>
                <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{contact?.message}</p>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Received On</label>
                <p className="text-gray-400 text-sm">{contact?.createdAt ? formatDate(contact.createdAt) : 'N/A'}</p>
              </div>

              <div className="flex gap-3 mt-4">
                {contact?.status === 'unread' && (
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
                  onClick={() => deleteContact(contact!.id)}
                  className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg text-red-400 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminPageContent() {
  const [activeTab, setActiveTab] = useState<TabType>('donors');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalDonors: 0,
    pendingDonors: 0,
    approvedDonors: 0,
    totalContacts: 0,
    unreadContacts: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);


  // Fetch donors
  const fetchDonors = async (loadMore = false) => {
    try {
      setLoading(true);
      let donorsQuery;

      if (loadMore && lastVisible) {
        donorsQuery = query(
          collection(db, 'donors'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else {
        donorsQuery = query(
          collection(db, 'donors'),
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );
      }

      const snapshot = await getDocs(donorsQuery);
      const donorsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Donor[];

      if (loadMore) {
        setDonors(prev => [...prev, ...donorsList]);
      } else {
        setDonors(donorsList);
      }

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setLoading(false);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const contactsQuery = query(
        collection(db, 'contacts'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(contactsQuery);
      const contactsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      setContacts(contactsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const donorsSnapshot = await getDocs(collection(db, 'donors'));
      const contactsSnapshot = await getDocs(collection(db, 'contacts'));

      const allDonors = donorsSnapshot.docs.map(doc => doc.data());
      const allContacts = contactsSnapshot.docs.map(doc => doc.data());

      setStats({
        totalDonors: allDonors.length,
        pendingDonors: allDonors.filter(d => d.status === 'pending').length,
        approvedDonors: allDonors.filter(d => d.status === 'approved').length,
        totalContacts: allContacts.length,
        unreadContacts: allContacts.filter(c => c.status === 'unread').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update donor status
  const updateDonorStatus = async (id: string, status: string) => {
    try {
      const donorRef = doc(db, 'donors', id);
      await updateDoc(donorRef, {
        status: status,
        updatedAt: new Date()
      });

      setDonors(donors.map(donor =>
        donor.id === id ? { ...donor, status, updatedAt: Timestamp.now() } : donor
      ));

      // Update stats
      fetchStats();
    } catch (error) {
      console.error('Error updating donor status:', error);
    }
  };

  // Update contact status
  const updateContactStatus = async (id: string, status: string) => {
    try {
      const contactRef = doc(db, 'contacts', id);
      await updateDoc(contactRef, {
        status: status,
        updatedAt: new Date()
      });

      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, status, updatedAt: Timestamp.now() } : contact
      ));

      fetchStats();
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  // Delete donor
  const deleteDonor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donor registration?')) return;

    try {
      await deleteDoc(doc(db, 'donors', id));
      setDonors(donors.filter(donor => donor.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting donor:', error);
    }
  };

  // Delete contact
  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
      await deleteDoc(doc(db, 'contacts', id));
      setContacts(contacts.filter(contact => contact.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Filter donors
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donor.phone.includes(searchTerm) ||
                          donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || donor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Load data on mount
  useEffect(() => {
    // Defer state-updating calls to avoid synchronous setState inside effect
    // which can cause cascading renders. Use a microtask to schedule them
    // after the current render phase.
    Promise.resolve().then(() => {
      fetchDonors(false);
      fetchContacts();
      fetchStats();
    });
  }, []);

  // Reload donors when tab changes
  useEffect(() => {
    if (activeTab === 'donors') {
      fetchDonors(false);
    }
  }, [activeTab]);

  // Stats Cards
  const statsCards = (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#101d2d]/80 border border-white/10 rounded-xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between">
          <FaUsers className="text-blue-400 text-xl" />
          <span className="text-2xl font-bold text-white">{stats.totalDonors}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Total Donors</p>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#101d2d]/80 border border-white/10 rounded-xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between">
          <FaClock className="text-yellow-400 text-xl" />
          <span className="text-2xl font-bold text-white">{stats.pendingDonors}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Pending</p>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#101d2d]/80 border border-white/10 rounded-xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between">
          <FaUserCheck className="text-green-400 text-xl" />
          <span className="text-2xl font-bold text-white">{stats.approvedDonors}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Approved</p>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#101d2d]/80 border border-white/10 rounded-xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between">
          <FaEnvelope className="text-purple-400 text-xl" />
          <span className="text-2xl font-bold text-white">{stats.totalContacts}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Messages</p>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#101d2d]/80 border border-white/10 rounded-xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between">
          <FaCheckCircle className="text-red-400 text-xl" />
          <span className="text-2xl font-bold text-white">{stats.unreadContacts}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Unread</p>
      </motion.div>
    </div>
  );

  // Loading skeleton
  if (loading && donors.length === 0 && contacts.length === 0) {
    return (
      <main className="min-h-screen bg-[#03060F] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <FaSpinner className="text-4xl text-[#FF3C6E] animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading admin dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#07111f] overflow-hidden pt-28 pb-20 px-4 sm:px-6">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.11) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="absolute -top-32 right-0 h-125 w-125 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,46,0.18) 0%, transparent 68%)' }}
      />
      <div className="absolute bottom-0 left-0 h-100 w-100 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 68%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5364]/25 bg-[#ff5364]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff8b96]">
                <FaHeartbeat />
                BloodBank Portal
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Operations overview
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Keep donor registrations moving, respond to messages, and protect every connection that can save a life.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101d2d]/70 px-4 py-3 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              Live operations
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {statsCards}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('donors')}
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
            onClick={() => setActiveTab('contacts')}
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

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3C6E]"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF3C6E]"
            >
              <option value="all">All Status</option>
              {activeTab === 'donors' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </>
              ) : (
                <>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {activeTab === 'donors' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Blood Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">City</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'donors' ? (
                  filteredDonors.length > 0 ? (
                    filteredDonors.map((donor) => (
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
                              onClick={() => {
                                setSelectedDonor(donor);
                                setShowDetailModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="View Details"
                            >
                              <FaEye className="text-sm" />
                            </button>
                            {donor.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateDonorStatus(donor.id, 'approved')}
                                  className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                  title="Approve"
                                >
                                  <FaCheckCircle className="text-sm" />
                                </button>
                                <button
                                  onClick={() => updateDonorStatus(donor.id, 'rejected')}
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  title="Reject"
                                >
                                  <FaUserTimes className="text-sm" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteDonor(donor.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        No donors found
                      </td>
                    </tr>
                  )
                ) : (
                  filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
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
                              onClick={() => {
                                setSelectedContact(contact);
                                setShowDetailModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="View Details"
                            >
                              <FaEye className="text-sm" />
                            </button>
                            {contact.status === 'unread' && (
                              <button
                                onClick={() => updateContactStatus(contact.id, 'read')}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Mark as Read"
                              >
                                <FaCheckCircle className="text-sm" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteContact(contact.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No messages found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {activeTab === 'donors' && donors.length > 0 && (
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Showing {donors.length} donors
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchDonors(false)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  <FaArrowLeft className="text-sm" />
                </button>
                <span className="px-3 py-1 text-white text-sm">{currentPage}</span>
                <button
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    fetchDonors(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <DetailModal
            donor={selectedDonor || undefined}
            contact={selectedContact || undefined}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedDonor(null);
              setSelectedContact(null);
            }}
            updateDonorStatus={updateDonorStatus}
            updateContactStatus={updateContactStatus}
            deleteDonor={deleteDonor}
            deleteContact={deleteContact}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  );
}