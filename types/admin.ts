import { Timestamp } from 'firebase/firestore';

export interface Donor {
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

export interface Contact {
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

export type TabType = 'donors' | 'contacts';

export interface StatusBadge {
  bg: string;
  text: string;
}

export interface Stats {
  totalDonors: number;
  pendingDonors: number;
  approvedDonors: number;
  totalContacts: number;
  unreadContacts: number;
}