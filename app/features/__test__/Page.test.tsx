/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import WhyDonatePage from '../page';

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

jest.mock('../../../lib/language', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        whyDonateBlood: 'Why Donate Blood',
        yourBloodCanSave: 'Your Blood Can Save',
        saveLives: 'Save Lives',
        featureDescription: 'Every donation makes a difference',
        stat1: 'People need blood',
        stat2: 'Units donated annually',
        stat3: 'Of population eligible',
        stat4: 'Days shelf life',
        reason1Title: 'Emergency Response',
        reason1Description: 'Blood is needed for emergencies',
        reason2Title: 'Medical Treatments',
        reason2Description: 'Patients need blood for treatments',
        reason3Title: 'Maternal Health',
        reason3Description: 'Safe childbirth requires blood',
        reason4Title: 'Chronic Conditions',
        reason4Description: 'Ongoing care for chronic illnesses',
        reason5Title: 'Surgical Procedures',
        reason5Description: 'Blood is essential for surgeries',
        reason6Title: 'Community Support',
        reason6Description: 'Help your community thrive',
        simpleDonationProcess: 'Simple Donation Process',
        process1Title: 'Register',
        process1Description: 'Sign up to donate',
        process2Title: 'Screening',
        process2Description: 'Health check',
        process3Title: 'Donate',
        process3Description: 'The donation process',
        process4Title: 'Recovery',
        process4Description: 'Rest and refresh',
        mythsFacts: 'Myths vs Facts',
        mythLabel: 'Myth',
        factLabel: 'Fact',
        myth1: 'Donating blood hurts',
        fact1: 'Only a small pinch',
        myth2: 'You can get diseases',
        fact2: 'All equipment is sterile',
        myth3: 'It takes hours',
        fact3: 'Only 10-15 minutes',
        myth4: 'Only for emergencies',
        fact4: 'Regular donations needed',
        whoCanDonate: 'Who Can Donate',
        age: 'Age',
        ageDetails: '18-65 years',
        weight: 'Weight',
        weightDetails: '50kg+',
        health: 'Health',
        healthDetails: 'Generally healthy',
        lastDonation: 'Last Donation',
        lastDonationDetails: '3 months ago',
        hemoglobin: 'Hemoglobin',
        hemoglobinDetails: '12.5 g/dL+',
        pregnancy: 'Pregnancy',
        pregnancyDetails: '6 weeks post-birth',
        readyDifference: 'Ready to Make a Difference',
        registrationDescription: 'Join thousands of donors saving lives',
        registerToDonate: 'Register to Donate',
        contactUsFeature: 'Contact Us',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the motion components
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock the ClayCTA and ClayCard components (adjust paths as needed)
jest.mock('../clay/ClayCTA', () => ({
  ClayCTA: ({ href, label, variant }: any) => (
    <a href={href} data-variant={variant} className="clay-cta">
      {label}
    </a>
  ),
}), { virtual: true });

jest.mock('../clay/ClayCard', () => ({
  ClayCard: ({ children, className }: any) => (
    <div className={`clay-card ${className || ''}`}>{children}</div>
  ),
}), { virtual: true });

// Mock the section components (adjust paths as needed)
jest.mock('../sections/StatsSection', () => ({
  StatsSection: () => (
    <div data-testid="stats-section">
      <div>1 in 3</div>
      <div>4.5M</div>
      <div>38%</div>
      <div>3-5</div>
    </div>
  ),
}), { virtual: true });

jest.mock('../sections/ReasonsSection', () => ({
  ReasonsSection: () => (
    <div data-testid="reasons-section">
      <div>Emergency Response</div>
      <div>Medical Treatments</div>
      <div>Maternal Health</div>
    </div>
  ),
}), { virtual: true });

jest.mock('../sections/ProcessSection', () => ({
  ProcessSection: () => (
    <div data-testid="process-section">
      <div>Register</div>
      <div>Screening</div>
      <div>Donate</div>
      <div>Recovery</div>
    </div>
  ),
}), { virtual: true });

jest.mock('../sections/MythsSection', () => ({
  MythsSection: () => (
    <div data-testid="myths-section">
      <div>Myth vs Fact</div>
    </div>
  ),
}), { virtual: true });

jest.mock('../sections/EligibilitySection', () => ({
  EligibilitySection: () => (
    <div data-testid="eligibility-section">
      <div>Age</div>
      <div>Weight</div>
      <div>Health</div>
    </div>
  ),
}), { virtual: true });

describe('WhyDonatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page without crashing', () => {
    render(<WhyDonatePage />);
    expect(screen.getByText('Why Donate Blood')).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<WhyDonatePage />);
    expect(screen.getByText('Your Blood Can Save')).toBeInTheDocument();
    expect(screen.getByText('Save Lives')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<WhyDonatePage />);
    expect(screen.getByText('Every donation makes a difference')).toBeInTheDocument();
  });

  it('renders all sections', () => {
    render(<WhyDonatePage />);
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.getByTestId('reasons-section')).toBeInTheDocument();
    expect(screen.getByTestId('process-section')).toBeInTheDocument();
    expect(screen.getByTestId('myths-section')).toBeInTheDocument();
    expect(screen.getByTestId('eligibility-section')).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    render(<WhyDonatePage />);
    const donateButton = screen.getByText('Register to Donate');
    const contactButton = screen.getByText('Contact Us');
    
    expect(donateButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
    expect(donateButton.closest('a')).toHaveAttribute('href', '/donate');
    expect(contactButton.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('renders the CTA heading', () => {
    render(<WhyDonatePage />);
    expect(screen.getByText('Ready to Make a Difference')).toBeInTheDocument();
  });

  it('renders the CTA description', () => {
    render(<WhyDonatePage />);
    expect(screen.getByText('Join thousands of donors saving lives')).toBeInTheDocument();
  });

  it('applies correct clay styles', () => {
    render(<WhyDonatePage />);
    const main = document.querySelector('main');
    expect(main).toHaveStyle({ background: '#f5f0eb' });
  });

  it('renders the badge with heartbeat icon', () => {
    render(<WhyDonatePage />);
    const badge = screen.getByText('Why Donate Blood').parentElement;
    expect(badge).toHaveClass('inline-flex');
  });

  it('renders all stats numbers', () => {
    render(<WhyDonatePage />);
    expect(screen.getByText('1 in 3')).toBeInTheDocument();
    expect(screen.getByText('4.5M')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByText('3-5')).toBeInTheDocument();
  });
});

describe('WhyDonatePage - Integration Tests', () => {
  it('renders with all translations', () => {
    render(<WhyDonatePage />);
    
    // Check for translated text
    expect(screen.getByText('Why Donate Blood')).toBeInTheDocument();
    expect(screen.getByText('Your Blood Can Save')).toBeInTheDocument();
    expect(screen.getByText('Save Lives')).toBeInTheDocument();
    expect(screen.getByText('Every donation makes a difference')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<WhyDonatePage />);
    
    // Check for main landmark
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
    
    // Check for heading levels
    const h1 = document.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toContain('Your Blood Can Save');
  });

  it('has proper responsive classes', () => {
    render(<WhyDonatePage />);
    const main = document.querySelector('main');
    expect(main).toHaveClass('pt-28', 'pb-20', 'px-4', 'sm:px-6');
  });

  it('renders the heart icon in the CTA', () => {
    render(<WhyDonatePage />);
    const ctaIcon = document.querySelector('.rounded-full');
    expect(ctaIcon).toBeInTheDocument();
  });
});

describe('WhyDonatePage - User Interaction', () => {
  it('has working donation link', async () => {
    render(<WhyDonatePage />);
    
    const donateButton = screen.getByText('Register to Donate');
    expect(donateButton.closest('a')).toHaveAttribute('href', '/donate');
  });

  it('has working contact link', async () => {
    render(<WhyDonatePage />);
    
    const contactButton = screen.getByText('Contact Us');
    expect(contactButton.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('applies correct variant classes to CTA buttons', () => {
    render(<WhyDonatePage />);
    const donateButton = screen.getByText('Register to Donate');
    const contactButton = screen.getByText('Contact Us');
    
    expect(donateButton.closest('a')).toHaveAttribute('data-variant', 'primary');
    expect(contactButton.closest('a')).toHaveAttribute('data-variant', 'secondary');
  });
});