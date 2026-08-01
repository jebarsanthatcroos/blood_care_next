/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DonatePage from '../page';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaTint: () => <div data-testid="icon-tint" />,
  FaCheckCircle: () => <div data-testid="icon-check" />,
  FaMapMarkerAlt: () => <div data-testid="icon-map" />,
  FaPhone: () => <div data-testid="icon-phone" />,
  FaEnvelope: () => <div data-testid="icon-envelope" />,
  FaUser: () => <div data-testid="icon-user" />,
  FaCalendarAlt: () => <div data-testid="icon-calendar" />,
  FaLock: () => <div data-testid="icon-lock" />,
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
        becomeDonor: 'Become a Donor',
        registerDonate: 'Register to Donate',
        registrationDescription: 'Join thousands of donors saving lives every day',
        fullName: 'Full Name',
        bloodType: 'Blood Type',
        phoneNumber: 'Phone Number',
        email: 'Email',
        fromYourAccount: 'From your account',
        city: 'City',
        preferredDate: 'Preferred Date',
        additionalNotes: 'Additional Notes',
        selectBloodType: 'Please select a blood type to continue',
        submitting: 'Submitting...',
        registerAsDonor: 'Register as Donor',
        thankYou: 'Thank You!',
        donorRegistrationReceived: "We've received your registration. We'll reach out to",
        confirmDonationSlot: 'confirm your donation slot.',
        registerAnotherDonor: 'Register Another Donor',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock CLAY design tokens
jest.mock('../../../lib/clay', () => ({
  CLAY: {
    bg: '#f5f0eb',
    surface: '#ffffff',
    text: '#1a1a1a',
    textMuted: '#666666',
    red: '#e63946',
    purple: '#6d597a',
    teal: '#2a9d8f',
    recessed: '#e8e3dd',
  },
  SHADOW: {
    raised: '0 4px 12px rgba(0,0,0,0.08)',
    raisedSm: '0 2px 6px rgba(0,0,0,0.06)',
    pressedSm: 'inset 0 2px 4px rgba(0,0,0,0.06)',
    pressed: 'inset 0 4px 8px rgba(0,0,0,0.08)',
  },
  usePressable: () => ({
    isPressed: false,
    pressHandlers: {
      onMouseDown: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseLeave: jest.fn(),
      onTouchStart: jest.fn(),
      onTouchEnd: jest.fn(),
    },
  }),
}));

const mockGetIdToken = jest.fn().mockResolvedValue('test-token');

const loggedInUser = {
  email: 'jebarsan@example.com',
  displayName: 'Jebarsan Thatcroos',
  getIdToken: mockGetIdToken,
};

// Helper to fill out the minimum required fields and select a blood type
const fillRequiredFields = ({
  fullName = 'Test User',
  bloodType = 'A+',
  phone = '+94 771234567',
  city = 'Colombo',
}: Partial<Record<'fullName' | 'bloodType' | 'phone' | 'city', string>> = {}) => {
  if (fullName) {
    fireEvent.change(screen.getByPlaceholderText('Jebarsan Thatcroos'), {
      target: { value: fullName },
    });
  }
  if (bloodType) {
    fireEvent.click(screen.getByText(bloodType));
  }
  if (phone) {
    fireEvent.change(screen.getByPlaceholderText('+94 76 239 7951'), {
      target: { value: phone },
    });
  }
  if (city) {
    fireEvent.change(screen.getByPlaceholderText('Kalmunai'), {
      target: { value: city },
    });
  }
};

// Query by the stable `type="submit"` attribute rather than the button's
// visible text — the label flips between "Register as Donor" and
// "Submitting..." depending on state, so text-based lookup breaks the
// moment submission starts.
const getSubmitButton = () =>
  document.querySelector('button[type="submit"]') as HTMLButtonElement;

// The component's text inputs use the native HTML `required` attribute.
// jsdom enforces real HTML5 constraint validation on submit-button clicks:
// if a required field is empty, it silently blocks the `submit` event
// entirely (no event ever reaches React's onSubmit), so our own
// validateForm()/setErrors() logic never runs and no error text appears.
// Setting `form.noValidate = true` mirrors what a novalidate form (or a
// user bypassing the browser's native tooltip) would do — it lets the
// submit event through so our custom validation gets a chance to run,
// exactly like the app's production error text is designed to render.
const renderPage = (...args: Parameters<typeof render>) => {
  const utils = render(...args);
  const form = document.querySelector('form');
  if (form) {
    (form as HTMLFormElement).noValidate = true;
  }
  return utils;
};

describe('DonatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetIdToken.mockResolvedValue('test-token');
    mockUseAuth.mockReturnValue({ user: null });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'donation1' }),
    }) as any;
  });

  it('renders without crashing', () => {
    renderPage(<DonatePage />);
    expect(document.querySelector('main')).toBeInTheDocument();
    expect(screen.getByText('Become a Donor')).toBeInTheDocument();
  });

  it('renders all blood type options', () => {
    renderPage(<DonatePage />);
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it('disables the submit button until a blood type is selected', () => {
    renderPage(<DonatePage />);
    expect(getSubmitButton()).toBeDisabled();

    fireEvent.click(screen.getByText('O+'));
    expect(getSubmitButton()).not.toBeDisabled();
  });

  it('prefills name and email from a logged-in user', () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    renderPage(<DonatePage />);

    expect(
      (screen.getByPlaceholderText('Jebarsan Thatcroos') as HTMLInputElement).value
    ).toBe('Jebarsan Thatcroos');
    expect(
      (screen.getByPlaceholderText('jebarsanthatcroos@gmail.com') as HTMLInputElement).value
    ).toBe('jebarsan@example.com');
  });

  it('marks the email field read-only and shows the account badge when logged in', () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    renderPage(<DonatePage />);

    const emailInput = screen.getByPlaceholderText('jebarsanthatcroos@gmail.com');
    expect(emailInput).toHaveAttribute('readonly');
    expect(screen.getByText('From your account')).toBeInTheDocument();
  });

  it('leaves the email field editable when not logged in', () => {
    renderPage(<DonatePage />);
    const emailInput = screen.getByPlaceholderText('jebarsanthatcroos@gmail.com');
    expect(emailInput).not.toHaveAttribute('readonly');
    expect(screen.queryByText('From your account')).not.toBeInTheDocument();
  });

  it('shows validation errors for missing required fields', async () => {
    renderPage(<DonatePage />);

    // Select a blood type so the submit button is enabled, leave the rest blank
    fireEvent.click(screen.getByText('A+'));
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
    });
    // The fetch call should never have been made since validation failed
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows an error for an invalid phone number', async () => {
    renderPage(<DonatePage />);
    fillRequiredFields({ phone: '123' });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
    });
  });

  it('shows an error for an invalid email address when editable', async () => {
    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText('jebarsanthatcroos@gmail.com'), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('clears a field error as soon as the user edits that field', async () => {
    renderPage(<DonatePage />);
    fireEvent.click(screen.getByText('A+'));
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Jebarsan Thatcroos'), {
      target: { value: 'Test User' },
    });

    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
  });

  it('requires the user to be signed in before submitting', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText('Please sign in before registering as a donor.')
      ).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits the form with the auth token and trimmed field values', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    renderPage(<DonatePage />);
    fillRequiredFields({ fullName: '  Test User  ', city: '  Colombo  ' });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/donations',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: 'Test User',
            bloodType: 'A+',
            phone: '+94 771234567',
            city: 'Colombo',
            preferredDate: '',
            message: '',
          }),
        })
      );
    });
  });

  it('shows the thank-you screen after a successful submission', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });
  });

  it('resets the form when "Register Another Donor" is clicked', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Register Another Donor'));

    expect(screen.queryByText('Thank You!')).not.toBeInTheDocument();
    expect(
      (screen.getByPlaceholderText('Jebarsan Thatcroos') as HTMLInputElement).value
    ).toBe('');
  });

  // --- Fixed: use fake timers instead of manually invoking a captured
  // setTimeout callback. The previous approach spied on setTimeout but let
  // the REAL 8s timer keep running in the background, which could fire
  // after the test (or even the whole file) finished and update state on
  // an unmounted component, causing act() warnings / flaky CI failures.
  describe('post-success auto-reset', () => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: false });
    });

    afterEach(() => {
      // Flush and clear any timers the component scheduled before restoring
      // real timers, so nothing leaks into the next test.
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it('resets the form automatically once the post-success timeout fires', async () => {
      mockUseAuth.mockReturnValue({ user: loggedInUser });
      renderPage(<DonatePage />);
      fillRequiredFields();

      // getIdToken / fetch are real promises even under fake timers, so let
      // them resolve via microtask flushing before advancing timers.
      await act(async () => {
        fireEvent.click(getSubmitButton());
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(screen.getByText('Thank You!')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(8000);
      });

      expect(screen.queryByText('Thank You!')).not.toBeInTheDocument();
      expect(
        (screen.getByPlaceholderText('Jebarsan Thatcroos') as HTMLInputElement).value
      ).toBe('');
    });
  });

  it('shows the server-provided error message when the response is not ok', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'That phone number is already registered.' }),
    }) as any;

    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText('That phone number is already registered.')
      ).toBeInTheDocument();
    });
  });

  it('shows a permission-denied specific error message', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    mockGetIdToken.mockRejectedValueOnce(
      Object.assign(new Error('nope'), { code: 'permission-denied' })
    );

    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText(/Permission denied\. Please check Firebase security rules\./)
      ).toBeInTheDocument();
    });
  });

  it('shows a service-unavailable specific error message', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    mockGetIdToken.mockRejectedValueOnce(
      Object.assign(new Error('nope'), { code: 'unavailable' })
    );

    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText(/Service unavailable\. Please try again\./)
      ).toBeInTheDocument();
    });
  });

  it('clears a previous submit error as soon as any field is edited', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText('Please sign in before registering as a donor.')
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Kalmunai'), {
      target: { value: 'Colombo 2' },
    });

    expect(
      screen.queryByText('Please sign in before registering as a donor.')
    ).not.toBeInTheDocument();
  });

  it('shows a submitting state while the request is in flight', async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser });
    let resolveFetch: (value: any) => void;
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    ) as any;

    renderPage(<DonatePage />);
    fillRequiredFields();
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
    expect(getSubmitButton()).toBeDisabled();

    await act(async () => {
      resolveFetch!({ ok: true, json: async () => ({ id: 'donation1' }) });
    });
  });
});