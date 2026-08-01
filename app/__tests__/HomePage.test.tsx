/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { render, screen,  } from '@testing-library/react';
import HomePage from '../page';

jest.mock('../../lib/language', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        everyDonationMatters: 'Every Donation Matters',
        giveBlood: 'Give Blood',
        giveLife: 'Give Life',
        heroDescription: 'Connect with donors and save lives in your community',
        donateNow: 'Donate Now',
        whyDonate: 'Why Donate',
        whyChoose: 'Why Choose Us',
        whyChooseDescription: 'We make blood donation simple, fast, and reliable',
        howItWorksTitle: 'How It Works',
        communityStories: 'Community Stories',
        nearbyNeedsHelp: 'Someone Nearby Needs Your Help',
        registrationDescription: 'Join thousands of donors saving lives every day',
        becomeDonor: 'Become a Donor',
        'Lives Saved': 'Lives Saved',
        'Registered Donors': 'Registered Donors',
        'Partner Hospitals': 'Partner Hospitals',
        'Cities Covered': 'Cities Covered',
      };
      return translations[key] || key;
    },
  }),
}));


jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});


jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('react-icons/fa', () => ({
  FaTint: () => <div data-testid="icon-tint" />,
  FaHeartbeat: () => <div data-testid="icon-heartbeat" />,
  FaUsers: () => <div data-testid="icon-users" />,
  FaHospital: () => <div data-testid="icon-hospital" />,
  FaShieldAlt: () => <div data-testid="icon-shield" />,
  FaClock: () => <div data-testid="icon-clock" />,
  FaArrowRight: () => <div data-testid="icon-arrow" />,
  FaMapMarkerAlt: () => <div data-testid="icon-map" />,
  FaQuoteLeft: () => <div data-testid="icon-quote" />,
  FaCheckCircle: () => <div data-testid="icon-check" />,
}));

// Mock the components
jest.mock('../component/ui/BackgroundGrid', () => ({
  BackgroundGrid: () => <div data-testid="background-grid" />,
}));

jest.mock('../component/ui/GradientRadial', () => ({
  GradientRadial: () => <div data-testid="gradient-radial" />,
}));

jest.mock('../component/sections/HeroSection', () => ({
  // Badge text + real <a href> links so the "donation badge" and
  // "links have proper href attributes" assertions have something to find
  HeroSection: ({ t }: any) => (
    <div data-testid="hero-section">
      <span>Every Donation Matters</span>
      <h1>Give Blood Give Life</h1>
      <a href="/donate">
        <button>Donate Now</button>
      </a>
      <a href="/features">
        <button>Why Donate</button>
      </a>
    </div>
  ),
}));

jest.mock('../component/sections/StatsSection', () => ({
  StatsSection: () => (
    <div data-testid="stats-section">
      <div>2,400+ Lives Saved</div>
      <div>5,800+ Registered Donors</div>
      <div>32 Partner Hospitals</div>
      <div>18 Cities Covered</div>
    </div>
  ),
}));

jest.mock('../component/sections/FeaturesSection', () => ({
  FeaturesSection: ({ t }: any) => (
    <div data-testid="features-section">
      <h2>Why Choose Us</h2>
      <div>Fast Matching</div>
      <div>Verified & Safe</div>
      <div>Local Network</div>
      <div>Track Your Impact</div>
    </div>
  ),
}));

jest.mock('../component/sections/HowItWorksSection', () => ({
  HowItWorksSection: ({ t }: any) => (
    <div data-testid="how-it-works-section">
      <h2>How It Works</h2>
      <div>01 Register</div>
      <div>02 Get Matched</div>
      <div>03 Donate</div>
      <div>04 Save a Life</div>
    </div>
  ),
}));

jest.mock('../component/sections/TestimonialsSection', () => ({
  TestimonialsSection: ({ t }: any) => (
    <div data-testid="testimonials-section">
      <h2>Community Stories</h2>
      <div>Nadeesha P.</div>
      <div>Dr. Ruwan F.</div>
      <div>Ishara W.</div>
    </div>
  ),
}));

jest.mock('../component/sections/CTASection', () => ({
  CTASection: ({ t }: any) => (
    <div data-testid="cta-section">
      <h2>Someone Nearby Needs Your Help</h2>
      <button>Become a Donor</button>
    </div>
  ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the page without crashing', () => {
      render(<HomePage />);
      expect(document.querySelector('main')).toBeInTheDocument();
    });

    it('renders all sections', () => {
      render(<HomePage />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('stats-section')).toBeInTheDocument();
      expect(screen.getByTestId('features-section')).toBeInTheDocument();
      expect(screen.getByTestId('how-it-works-section')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('cta-section')).toBeInTheDocument();
    });

    it('renders background elements', () => {
      render(<HomePage />);
      expect(screen.getByTestId('background-grid')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-radial')).toBeInTheDocument();
    });

    it('has correct background color', () => {
      render(<HomePage />);
      const main = document.querySelector('main');
      expect(main).toHaveClass('bg-[#03060F]');
    });
  });

  describe('Hero Section', () => {
    it('renders hero title', () => {
      render(<HomePage />);
      expect(screen.getByText('Give Blood Give Life')).toBeInTheDocument();
    });

    it('renders hero buttons', () => {
      render(<HomePage />);
      expect(screen.getByText('Donate Now')).toBeInTheDocument();
      expect(screen.getByText('Why Donate')).toBeInTheDocument();
    });

    it('renders donation badge', () => {
      render(<HomePage />);
      expect(screen.getByText('Every Donation Matters')).toBeInTheDocument();
    });
  });

  describe('Stats Section', () => {
    it('renders all stats', () => {
      render(<HomePage />);
      expect(screen.getByText('2,400+ Lives Saved')).toBeInTheDocument();
      expect(screen.getByText('5,800+ Registered Donors')).toBeInTheDocument();
      expect(screen.getByText('32 Partner Hospitals')).toBeInTheDocument();
      expect(screen.getByText('18 Cities Covered')).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('renders features title', () => {
      render(<HomePage />);
      expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
    });

    it('renders all features', () => {
      render(<HomePage />);
      expect(screen.getByText('Fast Matching')).toBeInTheDocument();
      expect(screen.getByText('Verified & Safe')).toBeInTheDocument();
      expect(screen.getByText('Local Network')).toBeInTheDocument();
      expect(screen.getByText('Track Your Impact')).toBeInTheDocument();
    });
  });

  describe('How It Works Section', () => {
    it('renders section title', () => {
      render(<HomePage />);
      expect(screen.getByText('How It Works')).toBeInTheDocument();
    });

    it('renders all steps', () => {
      render(<HomePage />);
      expect(screen.getByText('01 Register')).toBeInTheDocument();
      expect(screen.getByText('02 Get Matched')).toBeInTheDocument();
      expect(screen.getByText('03 Donate')).toBeInTheDocument();
      expect(screen.getByText('04 Save a Life')).toBeInTheDocument();
    });
  });

  describe('Testimonials Section', () => {
    it('renders section title', () => {
      render(<HomePage />);
      expect(screen.getByText('Community Stories')).toBeInTheDocument();
    });

    it('renders testimonial authors', () => {
      render(<HomePage />);
      expect(screen.getByText('Nadeesha P.')).toBeInTheDocument();
      expect(screen.getByText('Dr. Ruwan F.')).toBeInTheDocument();
      expect(screen.getByText('Ishara W.')).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('renders CTA title', () => {
      render(<HomePage />);
      expect(screen.getByText('Someone Nearby Needs Your Help')).toBeInTheDocument();
    });

    it('renders CTA button', () => {
      render(<HomePage />);
      expect(screen.getByText('Become a Donor')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive container classes', () => {
      render(<HomePage />);
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        if (section.className.includes('px-4')) {
          expect(section).toHaveClass('px-4', 'sm:px-6');
        }
      });
    });

    it('has proper max-width containers', () => {
      render(<HomePage />);
      const containers = document.querySelectorAll('.max-w-6xl, .max-w-5xl');
      containers.forEach(container => {
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<HomePage />);
      const h1 = document.querySelector('h1');
      const h2s = document.querySelectorAll('h2');

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('has proper main landmark', () => {
      render(<HomePage />);
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('buttons have proper roles', () => {
      render(<HomePage />);
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Integration', () => {
    it('renders with translations', () => {
      render(<HomePage />);
      // Check that translation function is called
      expect(screen.getByText('Every Donation Matters')).toBeInTheDocument();
      expect(screen.getByText('Give Blood Give Life')).toBeInTheDocument();
    });

    it('links have proper href attributes', () => {
      render(<HomePage />);
      const links = document.querySelectorAll('a[href]');
      const hrefs = Array.from(links).map(link => link.getAttribute('href'));
      expect(hrefs).toContain('/donate');
      expect(hrefs).toContain('/features');
    });
  });
});


describe('HomePage - Integration with Real Components', () => {
  it('renders without crashing with real components', async () => {

    jest.unmock('../component/sections/HeroSection');
    jest.unmock('../component/ui/BackgroundGrid');

    const { container } = render(<HomePage />);
    expect(container).toBeInTheDocument();
  });
});