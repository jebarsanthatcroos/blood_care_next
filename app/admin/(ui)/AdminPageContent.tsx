
'use client';

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy, limit, startAfter, Timestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Donor, Contact, Stats } from '@/types/admin';
import { getFirestoreDb } from '@/utils/admin';
import { AdminHeader } from './AdminHeader';
import { StatsCards } from './StatsCards';
import { AdminTabs } from './AdminTabs';
import { AdminFilters } from './AdminFilters';
import { DonorsTable } from './DonorsTable';
import { ContactsTable } from './ContactsTable';
import { DetailModal } from './DetailModal';
import { Pagination } from './Pagination';
import { AdminBackground } from './AdminBackground';

export const AdminPageContent = () => {
  const [activeTab, setActiveTab] = useState<'donors' | 'contacts'>('donors');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalDonors: 0,
    pendingDonors: 0,
    approvedDonors: 0,
    totalContacts: 0,
    unreadContacts: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Fetch functions
  const fetchDonors = async (loadMore = false) => {
    try {
      const firestoreDb = getFirestoreDb();
      setLoading(true);
      let donorsQuery;

      if (loadMore && lastVisible) {
        donorsQuery = query(
          collection(firestoreDb, 'donors'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else {
        donorsQuery = query(
          collection(firestoreDb, 'donors'),
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

  const fetchContacts = async () => {
    try {
      const firestoreDb = getFirestoreDb();
      setLoading(true);
      const contactsQuery = query(
        collection(firestoreDb, 'contacts'),
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

  const fetchStats = async () => {
    try {
      const firestoreDb = getFirestoreDb();
      const donorsSnapshot = await getDocs(collection(firestoreDb, 'donors'));
      const contactsSnapshot = await getDocs(collection(firestoreDb, 'contacts'));

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

  // CRUD operations
  const updateDonorStatus = async (id: string, status: string) => {
    try {
      const firestoreDb = getFirestoreDb();
      const donorRef = doc(firestoreDb, 'donors', id);
      await updateDoc(donorRef, {
        status: status,
        updatedAt: new Date()
      });

      setDonors(donors.map(donor =>
        donor.id === id ? { ...donor, status, updatedAt: Timestamp.now() } : donor
      ));
      fetchStats();
    } catch (error) {
      console.error('Error updating donor status:', error);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const firestoreDb = getFirestoreDb();
      const contactRef = doc(firestoreDb, 'contacts', id);
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

  const deleteDonor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donor registration?')) return;

    try {
      const firestoreDb = getFirestoreDb();
      await deleteDoc(doc(firestoreDb, 'donors', id));
      setDonors(donors.filter(donor => donor.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting donor:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
      const firestoreDb = getFirestoreDb();
      await deleteDoc(doc(firestoreDb, 'contacts', id));
      setContacts(contacts.filter(contact => contact.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Filter data
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donor.phone.includes(searchTerm) ||
                          donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || donor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Effects
  useEffect(() => {
    Promise.resolve().then(() => {
      fetchDonors(false);
      fetchContacts();
      fetchStats();
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'donors') {
      Promise.resolve().then(() => {
        fetchDonors(false);
      });
    }
  }, [activeTab]);

  // Loading state
  if (loading && donors.length === 0 && contacts.length === 0) {
    return (
      <main className="min-h-screen bg-[#03060F] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <svg className="text-4xl text-[#FF3C6E] animate-spin mx-auto mb-4 h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Loading admin dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#07111f] overflow-hidden pt-28 pb-20 px-4 sm:px-6">
      <AdminBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
        <AdminHeader />
        <StatsCards stats={stats} />
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          activeTab={activeTab}
        />

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
                  <DonorsTable
                    donors={filteredDonors}
                    onView={(donor) => {
                      setSelectedDonor(donor);
                      setShowDetailModal(true);
                    }}
                    onApprove={updateDonorStatus}
                    onReject={updateDonorStatus}
                    onDelete={deleteDonor}
                  />
                ) : (
                  <ContactsTable
                    contacts={filteredContacts}
                    onView={(contact) => {
                      setSelectedContact(contact);
                      setShowDetailModal(true);
                    }}
                    onMarkRead={updateContactStatus}
                    onDelete={deleteContact}
                  />
                )}
              </tbody>
            </table>
          </div>

          {activeTab === 'donors' && donors.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={donors.length}
              onPrevious={() => fetchDonors(false)}
              onNext={() => {
                setCurrentPage(prev => prev + 1);
                fetchDonors(true);
              }}
            />
          )}
        </div>
      </div>

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
};