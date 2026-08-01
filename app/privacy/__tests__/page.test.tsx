/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PrivacyPolicy from '../page';


jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

jest.mock('framer-motion', () => {
  const React = require('react');

  const stripMotionProps = (props: any) => {
    const {
      initial,
      animate,
      exit,
      variants,
      whileHover,
      whileTap,
      transition,
      layoutId,
      style,
      ...rest
    } = props;
    return rest;
  };

  const makeMotionComponent = (tag: string) =>
    React.forwardRef((props: any, ref: any) => {
      const cleanProps = stripMotionProps(props);
      return React.createElement(tag, { ...cleanProps, ref }, props.children);
    });

  const motion = new Proxy(
    {},
    {
      get: (_target, tagName: string) => makeMotionComponent(tagName),
    }
  );

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({
      scrollYProgress: { get: () => 0, on: jest.fn(() => jest.fn()) },
      scrollY: { get: () => 0, on: jest.fn(() => jest.fn()) },
    }),
    useTransform: () => ({ get: () => 0 }),
    useSpring: (value: any) => value,
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('<PrivacyPolicy />', () => {
  it('renders the header and last-updated badge', () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole('heading', { level: 1, name: /privacy policy/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/your privacy is our priority/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/last updated:/i)).toBeInTheDocument();
  });

  it('renders all sidebar navigation sections', () => {
    render(<PrivacyPolicy />);

    const expectedSections = [
      'Introduction',
      'Data Collection',
      'Data Usage',
      'Data Sharing',
      'Cookies',
      'Your Rights',
      'Security',
    ];

    const nav = screen.getByRole('navigation');
    expectedSections.forEach(label => {
      expect(within(nav).getByText(label)).toBeInTheDocument();
    });
  });

  it('shows the Introduction section by default', () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole('heading', { level: 2, name: /1\. introduction/i })
    ).toBeInTheDocument();

    expect(screen.getByText('jebarsanthatcroos', { selector: 'strong' })).toBeInTheDocument();
    expect(
      screen.getByText(/our commitment to you/i)
    ).toBeInTheDocument();
  });

  it('switches to the Data Collection section when clicked', async () => {
    const user = userEvent.setup();
    render(<PrivacyPolicy />);

    const dataCollectionButton = screen.getByRole('button', {
      name: /data collection/i,
    });

    await user.click(dataCollectionButton);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /2\. information we collect/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/account information \(name, email, profile data\)/i)
    ).toBeInTheDocument();

    // Introduction content should no longer be present
    expect(
      screen.queryByRole('heading', { level: 2, name: /1\. introduction/i })
    ).not.toBeInTheDocument();
  });

  it('returns to the Introduction section when re-selected', async () => {
    const user = userEvent.setup();
    render(<PrivacyPolicy />);

    await user.click(screen.getByRole('button', { name: /data collection/i }));
    await user.click(screen.getByRole('button', { name: /introduction/i }));

    expect(
      screen.getByRole('heading', { level: 2, name: /1\. introduction/i })
    ).toBeInTheDocument();
  });

  it('renders the contact section with the correct email', () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole('heading', { level: 3, name: /contact us/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/jebarsanthatcroos@gmail\.com/i)
    ).toBeInTheDocument();
  });

  it('renders the logo image with correct alt text', () => {
    render(<PrivacyPolicy />);

    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/Logo.jpg');
  });
});