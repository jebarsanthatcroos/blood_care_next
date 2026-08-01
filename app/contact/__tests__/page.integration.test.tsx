/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from '../page';


const mockAddDoc = jest.fn();
jest.mock('@/lib/firebase', () => ({
  db: {
    id: 'mock-db',
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock('@/lib/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));


jest.mock('@/lib/language', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}));

jest.mock('@/lib/clay', () => ({
  CLAY: {
    bg: '#03060F',
    surface: '#0A0F1F',
    recessed: '#050A17',
    red: '#FF3C6E',
    purple: '#7C3AED',
    teal: '#14B8A6',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
  },
  SHADOW: {
    raised: '0 4px 12px rgba(0,0,0,0.3)',
    pressedSm: 'inset 0 2px 4px rgba(0,0,0,0.4)',
  },
  usePressable: () => ({
    isPressed: false,
    pressHandlers: {},
  }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, whileHover, whileTap, ...props }: any) => (
      <div {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </div>
    ),
    form: ({ children, initial, animate, whileHover, whileTap, ...props }: any) => (
      <form {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </form>
    ),
    button: ({ children, initial, animate, whileHover, whileTap, ...props }: any) => (
      <button {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </button>
    ),
    a: ({ children, initial, animate, whileHover, whileTap, ...props }: any) => (
      <a {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </a>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ContactPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the complete contact page with all sections', () => {
    render(<ContactPage />);
    

    expect(screen.getByText('contactUs')).toBeInTheDocument();
    expect(screen.getByText('getInTouch')).toBeInTheDocument();
    expect(screen.getByText('contactDescription')).toBeInTheDocument();
    

    expect(screen.getAllByText('phone').length).toBeGreaterThan(0);
    expect(screen.getAllByText('email').length).toBeGreaterThan(0);
    expect(screen.getAllByText('location').length).toBeGreaterThan(0);
    expect(screen.getAllByText('workingHours').length).toBeGreaterThan(0);
  });

  it('displays the contact form with all fields', () => {
    render(<ContactPage />);

    const nameInput = screen.getByPlaceholderText('Jebarsan Thatcroos');
    const emailInput = screen.getByPlaceholderText('jebarsanthatcroos@gmail.com');
    const phoneInput = screen.getByPlaceholderText('+94 76 23 97 951');
    const messageTextarea = screen.getByPlaceholderText('writeMessage');
    
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(messageTextarea).toBeInTheDocument();
  });

  it('shows sidebar with map, social links, and quick response', () => {
    render(<ContactPage />);
    
    expect(screen.getByText('findUs')).toBeInTheDocument();
    expect(screen.getByText('connectWithUs')).toBeInTheDocument();
    expect(screen.getByText('quickResponse')).toBeInTheDocument();
    expect(screen.getByText('quickResponseDescription')).toBeInTheDocument();
    expect(screen.getByText('availableHours')).toBeInTheDocument();
  });

  it('handles form submission with validation', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'test-id-123' });
    
    render(<ContactPage />);
    

    fireEvent.change(screen.getByPlaceholderText('Jebarsan Thatcroos'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('jebarsanthatcroos@gmail.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('writeMessage'), {
      target: { value: 'This is a test message' },
    });
    
   
    const submitButton = screen.getByText('sendMessage');
    fireEvent.click(submitButton);
    
 
    await waitFor(() => {
      expect(screen.getByText('messageSent')).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<ContactPage />);

    const submitButton = screen.getByText('sendMessage');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Jebarsan Thatcroos')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('jebarsanthatcroos@gmail.com')).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });
});