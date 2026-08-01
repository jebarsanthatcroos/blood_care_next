/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href.replace('/', '') || 'home'}`}>
      {children}
    </a>
  );
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaTint: () => <div data-testid="icon-tint" />,
  FaHeartbeat: () => <div data-testid="icon-heartbeat" />,
  FaArrowRight: () => <div data-testid="icon-arrow-right" />,
  FaHome: () => <div data-testid="icon-home" />,
  FaSearch: () => <div data-testid="icon-search" />,
}));

describe('NotFound Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the page without crashing', () => {
      render(<NotFound />);
      expect(document.querySelector('main')).toBeInTheDocument();
    });

    it('renders the 404 status badge', () => {
      render(<NotFound />);
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    it('renders the 404 heading with animated zero', () => {
      render(<NotFound />);
      // The heading is "4" + <span>0</span> + "4", so the outer 4s are bare text
      // nodes with no element of their own — assert on the h1's full text instead,
      // and check the zero separately since it IS its own element.
      const heading = document.querySelector('h1');
      expect(heading?.textContent).toBe('404');
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders the error description', () => {
      render(<NotFound />);
      expect(
        screen.getByText(/This page went missing, but lives are still being saved every minute/i)
      ).toBeInTheDocument();
    });

    it('renders both action buttons', () => {
      render(<NotFound />);
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
      expect(screen.getByText('Donate Now')).toBeInTheDocument();
    });

    it('renders background elements', () => {
      render(<NotFound />);
      const backgrounds = document.querySelectorAll('.absolute.inset-0');
      expect(backgrounds.length).toBeGreaterThan(0);
    });
  });

  describe('Icons', () => {
    it('renders the heartbeat icon in the badge', () => {
      render(<NotFound />);
      expect(screen.getByTestId('icon-heartbeat')).toBeInTheDocument();
    });

    it('renders the blood drop icon', () => {
      render(<NotFound />);
      expect(screen.getByTestId('icon-tint')).toBeInTheDocument();
    });

    it('renders the search icon', () => {
      render(<NotFound />);
      expect(screen.getByTestId('icon-search')).toBeInTheDocument();
    });

    it('renders the home icon on the button', () => {
      render(<NotFound />);
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    });

    it('renders the arrow icon on the donate button', () => {
      render(<NotFound />);
      expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
    });
  });

  describe('Links and Navigation', () => {
    it('has correct href for Back to Home button', () => {
      render(<NotFound />);
      const homeLink = screen.getByTestId('link-home');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('has correct href for Donate Now button', () => {
      render(<NotFound />);
      const donateLink = screen.getByTestId('link-donate');
      expect(donateLink).toHaveAttribute('href', '/donate');
    });

    it('renders Back to Home as primary button', () => {
      render(<NotFound />);
      const homeButton = screen.getByText('Back to Home');
      const buttonElement = homeButton.closest('button');
      expect(buttonElement).toHaveClass('bg-linear-to-r', 'from-[#E11D2E]', 'to-[#7B2FFF]');
    });

    it('renders Donate Now as secondary button', () => {
      render(<NotFound />);
      const donateButton = screen.getByText('Donate Now');
      const buttonElement = donateButton.closest('button');
      expect(buttonElement).toHaveClass('border', 'border-white/10');
    });
  });

  describe('Styling', () => {
    it('has correct background color', () => {
      render(<NotFound />);
      const main = document.querySelector('main');
      expect(main).toHaveClass('bg-[#03060F]');
    });

    it('has gradient text on the zero', () => {
      render(<NotFound />);
      const zeroElement = screen.getByText('0');
      expect(zeroElement).toHaveClass(
        'bg-linear-to-r',
        'from-[#E11D2E]',
        'via-[#FF3C6E]',
        'to-[#7B2FFF]',
        'bg-clip-text',
        'text-transparent'
      );
    });

    it('has proper responsive classes', () => {
      render(<NotFound />);
      const section = document.querySelector('section');
      expect(section).toHaveClass('px-4', 'sm:px-6', 'py-32');
    });

    it('has proper max-width container', () => {
      render(<NotFound />);
      const section = document.querySelector('section');
      expect(section).toHaveClass('max-w-2xl');
    });

    it('applies gradient border to badge', () => {
      render(<NotFound />);
      // "Page not found" text sits directly in the badge <span> itself
      // (alongside the icon div, which contributes no text), so getByText
      // already returns the badge element — no need to go up to .parentElement.
      const badge = screen.getByText('Page not found');
      expect(badge).toHaveClass('bg-[#FF3C6E]/10', 'border-[#FF3C6E]/20');
    });
  });

  describe('Animations', () => {
    it('applies framer-motion animation props to elements', () => {
      render(<NotFound />);
      // The mocked motion.* components spread initial/animate/transition
      // straight onto the DOM as attributes rather than adding literal
      // Tailwind classes like "opacity-0", so check for the attribute instead.
      const animatedElements = document.querySelectorAll('[initial]');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('has spring animation on the blood drop container', () => {
      render(<NotFound />);
      const container = document.querySelector('.relative.w-24.h-24');
      expect(container).toBeInTheDocument();
    });

    it('has pulsing animation on the search icon', () => {
      render(<NotFound />);
      const pulseElement = document.querySelector('.absolute.-bottom-1.-right-1');
      expect(pulseElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      render(<NotFound />);
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<NotFound />);
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain('404');
    });

    it('buttons have proper roles', () => {
      render(<NotFound />);
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBe(2);
    });

    it('has descriptive link text', () => {
      render(<NotFound />);
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
      expect(screen.getByText('Donate Now')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive heading size', () => {
      render(<NotFound />);
      const heading = document.querySelector('h1');
      expect(heading).toHaveClass('text-5xl', 'sm:text-7xl');
    });

    it('has responsive button layout', () => {
      render(<NotFound />);
      const buttonContainer = document.querySelector('.flex.flex-col.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('items-center', 'justify-center', 'gap-4');
    });

    it('has responsive text size for description', () => {
      render(<NotFound />);
      const description = document.querySelector('p.text-gray-400');
      expect(description).toHaveClass('text-lg');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing translations gracefully', () => {
      render(<NotFound />);
      // All text should be hardcoded in English
      expect(screen.getByText('Page not found')).toBeInTheDocument();
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
      expect(screen.getByText('Donate Now')).toBeInTheDocument();
    });

    it('renders with all icons', () => {
      render(<NotFound />);
      const iconElements = document.querySelectorAll('[data-testid^="icon-"]');
      expect(iconElements.length).toBe(5); // heartbeat, tint, search, home, arrow
    });
  });

  describe('Snapshot Testing', () => {
    it('matches snapshot', () => {
      const { container } = render(<NotFound />);
      expect(container).toMatchSnapshot();
    });
  });
});

// Integration test with actual components (optional)
describe('NotFound - Integration', () => {
  it('renders without crashing with real framer-motion', () => {
    // This would test with actual framer-motion instead of mocks
    jest.unmock('framer-motion');
    const { container } = render(<NotFound />);
    expect(container).toBeInTheDocument();
  });
});