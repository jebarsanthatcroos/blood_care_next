'use client';

export const dynamic = 'force-static';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaTint,
  FaClock,
  FaCheckCircle,
  FaUserTimes,
  FaSpinner,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';
import { AuthGuard } from '../component/RouteGuards';
import { useAuth } from '../../lib/useAuth';
import { useLanguage } from '../../lib/language';

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
  createdAt: Timestamp | string | null;
}

const statusMeta: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: FaClock, label: 'Pending Review' },
  approved: { bg: 'bg-green-500/20', text: 'text-green-500', icon: FaCheckCircle, label: 'Approved' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-500', icon: FaUserTimes, label: 'Rejected' },
};

const formatDate = (timestamp?: Timestamp | string | null) => {
  if (!timestamp) return 'N/A';
  if (typeof timestamp === 'string') return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(timestamp));
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(timestamp.toDate());
};

function DashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [donations, setDonations] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyDonations = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/donations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Donation history request failed: ${response.status}`);
        const list = await response.json() as Donor[];
        setDonations(list);
      } catch (error) {
        console.error('Error loading donation history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMyDonations();
  }, [user]);

  return (
    <main className="relative min-h-screen bg-[#03060F] overflow-hidden pt-28 pb-20 px-4 sm:px-6">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-75 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #E11D2E10 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
            <FaTint className="text-[#FF3C6E] text-xs" />
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              My Dashboard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-gray-500">
            {t('registrationDescription')}
          </p>
        </motion.div>

        {/* Donation history */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl bg-white/3 border border-white/10 p-6 sm:p-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#E11D2E40] to-transparent" />

          <h2 className="text-lg font-bold text-white mb-6">{t('yourRegistrations')}</h2>

          {loading ? (
            <div className="flex flex-col items-center py-14">
              <FaSpinner className="text-3xl text-[#FF3C6E] animate-spin mb-3" />
              <p className="text-gray-400 text-sm">{t('loadingDonations')}</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-14">
              <FaTint className="text-4xl text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 mb-1">{t('noRegistrations')}</p>
              <p className="text-gray-600 text-sm">
                {t('headToDonate')}{' '}
                <a href="/donate" className="text-[#FF3C6E] hover:text-white transition-colors">
                  Donate Now
                </a>{' '}
                to register as a donor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => {
                const meta = statusMeta[donation.status] || statusMeta.pending;
                const StatusIcon = meta.icon;
                return (
                  <motion.div
                    key={donation.id}
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-white/3 border border-white/10 p-5 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#E11D2E20] to-[#7B2FFF20] flex items-center justify-center">
                          <FaTint className="text-[#FF3C6E]" />
                        </div>
                        <div>
                          <p className="text-white font-semibold flex items-center gap-2">
                            Blood Type {donation.bloodType}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                            <FaMapMarkerAlt className="text-xs" /> {donation.city}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.text}`}>
                        <StatusIcon className="text-xs" />
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                      <span>Registered on {formatDate(donation.createdAt)}</span>
                      {donation.preferredDate && (
                        <span>Preferred date: {donation.preferredDate}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 rounded-2xl bg-linear-to-br from-[#E11D2E10] to-[#7B2FFF10] border border-white/10 p-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">{t('helpQuestion')}</h3>
            <p className="text-gray-400 text-sm">{t('reachTeam')}</p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-[#E11D2E] to-[#7B2FFF] text-white font-medium shadow-lg hover:shadow-[#E11D2E]/50 transition-all"
          >
            <FaEnvelope className="text-sm" /> Contact Us
          </a>
        </motion.div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}