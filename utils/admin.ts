/* eslint-disable @typescript-eslint/no-require-imports */
import { Timestamp } from 'firebase/firestore';
import { StatusBadge } from '@/types/admin';


export const formatDate = (timestamp: Timestamp) => {
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

export const getStatusBadge = (status: string): StatusBadge => {
  const statusMap: Record<string, StatusBadge> = {
    'pending': { bg: 'bg-yellow-500/20', text: 'text-yellow-500' },
    'approved': { bg: 'bg-green-500/20', text: 'text-green-500' },
    'rejected': { bg: 'bg-red-500/20', text: 'text-red-500' },
    'unread': { bg: 'bg-blue-500/20', text: 'text-blue-500' },
    'read': { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  };
  return statusMap[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };
};

export const getFirestoreDb = () => {
  const { db } = require('@/lib/firebase');
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return db;
};