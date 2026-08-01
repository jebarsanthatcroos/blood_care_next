/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen} from '@testing-library/react';
import ContactPage from '../page';

jest.mock('../(ui)', () => ({
  ContactHeader: () => <div data-testid="contact-header">Contact Header</div>,
  ContactInfoGrid: () => <div data-testid="contact-info-grid">Contact Info Grid</div>,
  ContactForm: () => <div data-testid="contact-form">Contact Form</div>,
  ContactSidebar: () => <div data-testid="contact-sidebar">Contact Sidebar</div>,
}));

jest.mock('@/lib/firebase', () => ({
  db: null,
}));


jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, ...props }: any) => (
      <div {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </div>
    ),
    form: ({ children, initial, animate, ...props }: any) => (
      <form {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </form>
    ),
    button: ({ children, initial, animate, ...props }: any) => (
      <button {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </button>
    ),
    a: ({ children, initial, animate, ...props }: any) => (
      <a {...props} data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)}>
        {children}
      </a>
    ),
  },
}));

jest.mock('@/lib/clay', () => ({
  CLAY: {
    bg: '#03060F',
  },
}));

describe('ContactPage', () => {
  it('renders all contact components', () => {
    render(<ContactPage />);
    
    expect(screen.getByTestId('contact-header')).toBeInTheDocument();
    expect(screen.getByTestId('contact-info-grid')).toBeInTheDocument();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-sidebar')).toBeInTheDocument();
  });

  it('renders the main container with correct styles', () => {
    render(<ContactPage />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('relative min-h-screen overflow-hidden pt-28 pb-20 px-4 sm:px-6');
  });

  it('renders the grid layout correctly', () => {
    render(<ContactPage />);
    
    const grid = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3.gap-8');
    expect(grid).toBeInTheDocument();
  });

  it('renders contact form in the correct column', () => {
    render(<ContactPage />);
    
    const formContainer = document.querySelector('.lg\\:col-span-2');
    expect(formContainer).toContainElement(screen.getByTestId('contact-form'));
  });

  it('renders sidebar in the correct column', () => {
    render(<ContactPage />);
    
    const sidebarContainer = document.querySelector('.lg\\:col-span-1');
    expect(sidebarContainer).toContainElement(screen.getByTestId('contact-sidebar'));
  });

  it('applies motion animations to form and sidebar', () => {
    render(<ContactPage />);

    const motionElements = document.querySelectorAll('[data-initial]');
    expect(motionElements.length).toBeGreaterThan(0);
  });
});