/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from '../page';

// Mock data
const mockDonors = [
  {
    id: 'donor1',
    fullName: 'Jebarsan thatcroos',
    bloodType: 'A+',
    phone: '+94 76 23 97 951',
    email: 'jebarsanthatcroos@gmail.com',
    city: 'mannar',
    preferredDate: '2026-07-31',
    message: 'Available to donate',
    status: 'pending',
    createdAt: { toDate: () => new Date('2024-01-01') },
    updatedAt: { toDate: () => new Date('2024-01-01') },
  },
  {
    id: 'donor2',
    fullName: 'larksanan',
    bloodType: 'O-',
    phone: '+94 77 12 34 567',
    email: 'larksanan0918@gmail.com',
    city: 'batticaloa',
    preferredDate: '2026-08-16',
    message: 'Will donate',
    status: 'approved',
    createdAt: { toDate: () => new Date('2026-08-01') },
    updatedAt: { toDate: () => new Date('2026-08-01') },
  },
];

const mockContacts = [
  {
    id: 'contact1',
    name: 'Sathuska',
    email: 'gwu-hict-2020-37@gwu.ac.lk',
    phone: '+94 78 90 12 345',
    subject: 'general',
    message: 'I want to organize a blood drive',
    status: 'unread',
    createdAt: { toDate: () => new Date('2026-08-01') },
    updatedAt: { toDate: () => new Date('2026-01-01') },
  },
  {
    id: 'contact2',
    name: 'sovika',
    email: 'gwu-hict-2021-39@gwu.ac.lk',
    phone: '+94 71 23 45 678',
    subject: 'donation',
    message: 'I want to donate blood',
    status: 'read',
    createdAt: { toDate: () => new Date('2026-08-01') },
    updatedAt: { toDate: () => new Date('2026-08-01') },
  },
];

// Mock Firebase functions
const mockGetDocs = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

// NOTE: collection() now preserves the collection name (e.g. 'donors' / 'contacts')
// so getDocs() below can tell which collection is being queried and return the
// right mock data. Before, collection() always returned the same generic object,
// so every fetch (donors AND contacts) resolved to mockDonors, and contacts ended
// up holding donor objects with no `.name`/`.subject`, crashing the filter.
// If your AdminPageContent.tsx uses different collection names, update the
// `path === 'contacts'` check in the getDocs mock below to match.
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db: any, name: string) => ({ path: name })),
  query: jest.fn((collRef: any, ...rest: any[]) => ({ collRef, rest })),
  getDocs: (...args: any[]) => mockGetDocs(...args),
  doc: jest.fn(() => ({ id: 'mock-doc' })),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
  orderBy: jest.fn(() => ({ field: 'createdAt', direction: 'desc' })),
  limit: jest.fn(() => ({ limit: 10 })),
  startAfter: jest.fn(() => ({ startAfter: {} })),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

// Mock AdminGuard
jest.mock('../../component/RouteGuards', () => ({
  AdminGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Remove framer-motion specific props to avoid React warnings
      const { initial, animate, exit, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Return donors or contacts depending on which collection was queried
    mockGetDocs.mockImplementation(async (q: any) => {
      const path = q?.collRef?.path;
      const data = path === 'contacts' ? mockContacts : mockDonors;
      return {
        docs: data.map((d) => ({
          id: d.id,
          data: () => d,
          exists: true,
        })),
      };
    });

    mockUpdateDoc.mockResolvedValue({});
    mockDeleteDoc.mockResolvedValue({});
  });

  // Helper to wait for loading to complete
  const waitForLoadingComplete = async () => {
    await waitFor(() => {
      expect(screen.queryByText('Loading admin dashboard...')).not.toBeInTheDocument();
    });
  };

  it('renders the admin dashboard', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Operations overview')).toBeInTheDocument();
    expect(screen.getByText('BloodBank Portal')).toBeInTheDocument();
    expect(screen.getByText('Live operations')).toBeInTheDocument();
  });

  it('displays stats cards', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Total Donors')).toBeInTheDocument();
    // 'Pending' also exists as a <option> in the status filter, so scope to the stat card's <p>
    expect(screen.getByText('Pending', { selector: 'p' })).toBeInTheDocument();
    // 'Approved' also exists as a <option> in the status filter, so scope to the stat card's <p>
    expect(screen.getByText('Approved', { selector: 'p' })).toBeInTheDocument();
    // 'Messages' also exists as the tab <button>, so scope to the stat card's <p>
    expect(screen.getByText('Messages', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
  });

  it('shows donor tab by default and displays donors', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();
    expect(screen.getByText('larksanan')).toBeInTheDocument();
  });

  it('switches between tabs', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();

    // 'Messages' also exists as the stat card <p> label, so scope to the tab <button>
    const messagesTab = screen.getByText('Messages', { selector: 'button' });
    fireEvent.click(messagesTab);

    await waitFor(() => {
      expect(screen.getByText('Sathuska')).toBeInTheDocument();
      expect(screen.queryByText('Jebarsan thatcroos')).not.toBeInTheDocument();
    });
  });

  it('filters donors by search term', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();
    expect(screen.getByText('larksanan')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Jebarsan' } });

    await waitFor(() => {
      expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();
      expect(screen.queryByText('larksanan')).not.toBeInTheDocument();
    });
  });

  it('filters donors by status', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();
    expect(screen.getByText('larksanan')).toBeInTheDocument();

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();
      expect(screen.queryByText('larksanan')).not.toBeInTheDocument();
    });
  });

  it('opens detail modal when view button is clicked', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();

    const viewButtons = screen.getAllByTitle('View Details');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Donor Details')).toBeInTheDocument();
      // 'A+' also shows in the donor row behind the modal, so scope to the modal's <p>
      expect(screen.getByText('A+', { selector: 'p' })).toBeInTheDocument();
      // 'mannar' also shows in the table row's <td> behind the modal, so scope to the modal's <p>
      expect(screen.getByText('mannar', { selector: 'p' })).toBeInTheDocument();
    });
  });

  it('approves a donor', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();

    const approveButtons = screen.getAllByTitle('Approve');
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('rejects a donor', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();

    const rejectButtons = screen.getAllByTitle('Reject');
    fireEvent.click(rejectButtons[0]);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('deletes a donor', async () => {
    window.confirm = jest.fn(() => true);

    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });

  it('marks a contact as read', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    // Switch to contacts tab ('Messages' also exists as the stat card <p> label)
    const messagesTab = screen.getByText('Messages', { selector: 'button' });
    fireEvent.click(messagesTab);

    await waitFor(() => {
      expect(screen.getByText('Sathuska')).toBeInTheDocument();
    });

    const readButtons = screen.getAllByTitle('Mark as Read');
    fireEvent.click(readButtons[0]);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('displays "No donors found" when no results', async () => {
    mockGetDocs.mockImplementation(async () => ({
      docs: [],
    }));

    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('No donors found')).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGetDocs.mockRejectedValueOnce(new Error('Firebase error'));

    render(<AdminPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('shows loading state initially', () => {
    mockGetDocs.mockImplementation(() => new Promise(() => {}));

    render(<AdminPage />);

    expect(screen.getByText('Loading admin dashboard...')).toBeInTheDocument();
  });

  it('displays donor status badges correctly', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    const pendingBadge = screen.getByText('pending');
    const approvedBadge = screen.getByText('approved');

    expect(pendingBadge).toHaveClass('bg-yellow-500/20', 'text-yellow-500');
    expect(approvedBadge).toHaveClass('bg-green-500/20', 'text-green-500');
  });

  it('closes modal when close button is clicked', async () => {
    render(<AdminPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Jebarsan thatcroos')).toBeInTheDocument();

    const viewButtons = screen.getAllByTitle('View Details');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Donor Details')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Donor Details')).not.toBeInTheDocument();
    });
  });
});