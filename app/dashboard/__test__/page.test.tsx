/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../page';
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('react-icons/fa', () => ({
  FaTint: () => <div data-testid="icon-tint" />,
  FaClock: () => <div data-testid="icon-clock" />,
  FaCheckCircle: () => <div data-testid="icon-check" />,
  FaUserTimes: () => <div data-testid="icon-user-times" />,
  FaSpinner: () => <div data-testid="icon-spinner" />,
  FaEnvelope: () => <div data-testid="icon-envelope" />,
  FaMapMarkerAlt: () => <div data-testid="icon-map" />,
}));


jest.mock('firebase/firestore', () => ({
  Timestamp: {},
}));

jest.mock('../../component/RouteGuards', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-guard">{children}</div>
  ),
}));

// Mock useAuth — controllable per test via mockUseAuth
const mockUseAuth = jest.fn();
jest.mock('../../../lib/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock useLanguage
jest.mock('../../../lib/language', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        registrationDescription: 'Join thousands of donors saving lives every day',
        yourRegistrations: 'Your Registrations',
        loadingDonations: 'Loading your donations...',
        noRegistrations: "You haven't registered yet",
        headToDonate: 'Head over',
        helpQuestion: 'Have a question?',
        reachTeam: 'Reach out to our team anytime',
      };
      return translations[key] || key;
    },
  }),
}));

const mockGetIdToken = jest.fn().mockResolvedValue('test-token');

const defaultUser = {
  email: 'jebarsan@example.com',
  displayName: 'Jebarsan Thatcroos',
  getIdToken: mockGetIdToken,
};

const makeDonor = (overrides: Partial<any> = {}) => ({
  id: 'donor1',
  fullName: 'Jebarsan Thatcroos',
  bloodType: 'A+',
  phone: '+94 76 23 97 951',
  email: 'jebarsan@example.com',
  city: 'mannar',
  preferredDate: '2026-09-01',
  message: 'Available to donate',
  status: 'pending',
  createdAt: '2026-08-01',
  ...overrides,
});

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetIdToken.mockResolvedValue('test-token');
    mockUseAuth.mockReturnValue({ user: defaultUser });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    }) as any;
  });

  const waitForLoadingComplete = async () => {
    await waitFor(() => {
      expect(screen.queryByText('Loading your donations...')).not.toBeInTheDocument();
    });
  };

  it('renders without crashing', async () => {
    render(<DashboardPage />);
    await waitForLoadingComplete();
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('wraps content in AuthGuard', async () => {
    render(<DashboardPage />);
    await waitForLoadingComplete();
    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
  });

  it('shows the loading spinner before donations resolve', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any; // never resolves
    render(<DashboardPage />);
    expect(screen.getByText('Loading your donations...')).toBeInTheDocument();
    expect(screen.getByTestId('icon-spinner')).toBeInTheDocument();
  });

  it('shows welcome message with the first name when displayName is set', async () => {
    render(<DashboardPage />);
    await waitForLoadingComplete();
    expect(screen.getByText(/Welcome back, Jebarsan/)).toBeInTheDocument();
  });

  it('shows a generic welcome message when displayName is missing', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'noname@example.com', displayName: null, getIdToken: mockGetIdToken },
    });
    render(<DashboardPage />);
    await waitForLoadingComplete();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Welcome back');
  });

  it('fetches donations with the auth token when the user has an email', async () => {
    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(mockGetIdToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/donations',
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-token' },
      })
    );
  });

  it('does not fetch when there is no logged-in user', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(<DashboardPage />);
    await waitForLoadingComplete();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows the empty state with a link to /donate when there are no donations', async () => {
    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText("You haven't registered yet")).toBeInTheDocument();
    const donateLink = screen.getByText('Donate Now');
    expect(donateLink.closest('a')).toHaveAttribute('href', '/donate');
  });

  it('renders a donation card for each returned donor', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        makeDonor({ id: 'd1', bloodType: 'A+', city: 'mannar', status: 'pending' }),
        makeDonor({ id: 'd2', bloodType: 'O-', city: 'batticaloa', status: 'approved' }),
      ],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Blood Type A+')).toBeInTheDocument();
    expect(screen.getByText('mannar')).toBeInTheDocument();
    expect(screen.getByText('Pending Review')).toBeInTheDocument();

    expect(screen.getByText('Blood Type O-')).toBeInTheDocument();
    expect(screen.getByText('batticaloa')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('shows the rejected status label and styling', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [makeDonor({ status: 'rejected' })],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    const badge = screen.getByText('Rejected');
    expect(badge.closest('span')).toHaveClass('bg-red-500/20', 'text-red-500');
  });

  it('falls back to the pending status meta for an unrecognized status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [makeDonor({ status: 'some-unknown-status' })],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Pending Review')).toBeInTheDocument();
  });

  it('shows the preferred date when present', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [makeDonor({ preferredDate: '2026-09-15' })],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText(/Preferred date: 2026-09-15/)).toBeInTheDocument();
  });

  it('omits the preferred date line when not present', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [makeDonor({ preferredDate: '' })],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.queryByText(/Preferred date:/)).not.toBeInTheDocument();
  });

  it('formats a string createdAt timestamp', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [makeDonor({ createdAt: '2026-08-01' })],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Registered on Aug 1, 2026')).toBeInTheDocument();
  });

  it('formats a Firestore-Timestamp-like createdAt (object with toDate)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        makeDonor({ createdAt: { toDate: () => new Date('2026-08-01') } }),
      ],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Registered on Aug 1, 2026')).toBeInTheDocument();
  });

  it('shows N/A when createdAt is missing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [makeDonor({ createdAt: null })],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(screen.getByText('Registered on N/A')).toBeInTheDocument();
  });

  it('logs an error and falls back to the empty state when the fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading donation history:',
      expect.any(Error)
    );
    expect(screen.getByText("You haven't registered yet")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('logs an error when the response is not ok', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => [],
    }) as any;

    render(<DashboardPage />);
    await waitForLoadingComplete();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('renders the Contact Us link', async () => {
    render(<DashboardPage />);
    await waitForLoadingComplete();

    const contactLink = screen.getByText('Contact Us');
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
  });
});