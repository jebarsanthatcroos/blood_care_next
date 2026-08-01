/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import ContactPage from '../page';


jest.mock('../(ui)', () => ({
  ContactHeader: () => <div data-testid="contact-header">Mock Header</div>,
  ContactInfoGrid: () => <div data-testid="contact-info-grid">Mock Info Grid</div>,
  ContactForm: () => <div data-testid="contact-form">Mock Form</div>,
  ContactSidebar: () => <div data-testid="contact-sidebar">Mock Sidebar</div>,
}));

jest.mock('@/lib/firebase', () => ({
  db: null,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('@/lib/clay', () => ({
  CLAY: {
    bg: '#03060F',
  },
}));

describe('ContactPage Snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<ContactPage />);
    expect(container).toMatchSnapshot();
  });
});