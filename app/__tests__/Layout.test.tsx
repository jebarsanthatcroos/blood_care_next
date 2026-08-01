
/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '../layout';


jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

jest.mock('../../lib/clay', () => ({
  CLAY: {
    bg: '#f5f0eb',
  },
}));

jest.mock('../../lib/language', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="language-provider">{children}</div>
  ),
}));


jest.mock('../component/header', () => {
  return () => <nav data-testid="navbar">Navbar</nav>;
});

jest.mock('../component/Footer', () => {
  return () => <footer data-testid="footer">Footer</footer>;
});

describe('RootLayout', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the Navbar', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the Footer', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children between Navbar and Footer', () => {
    render(
      <RootLayout>
        <div data-testid="page-content">Test Content</div>
      </RootLayout>
    );

    const provider = screen.getByTestId('language-provider');
    const children = Array.from(provider.children).map(
      (el) => el.getAttribute('data-testid') || el.tagName.toLowerCase()
    );

    const navIndex = children.indexOf('navbar');
    const contentIndex = children.indexOf('page-content');
    const footerIndex = children.indexOf('footer');

    expect(navIndex).toBeGreaterThan(-1);
    expect(contentIndex).toBeGreaterThan(-1);
    expect(footerIndex).toBeGreaterThan(-1);
    expect(navIndex).toBeLessThan(contentIndex);
    expect(contentIndex).toBeLessThan(footerIndex);
  });

  it('wraps everything in LanguageProvider', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    const provider = screen.getByTestId('language-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toContainElement(screen.getByTestId('navbar'));
    expect(provider).toContainElement(screen.getByTestId('footer'));
    expect(provider).toContainElement(screen.getByText('Test Content'));
  });

  it('sets the CLAY background color on the body', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    const body = document.querySelector('body');
    expect(body).toHaveStyle({ background: '#f5f0eb' });
  });

  it('applies layout classes to the body', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    const body = document.querySelector('body');
    expect(body).toHaveClass('min-h-full', 'flex', 'flex-col');
  });

  it('sets the lang attribute and font variable classes on html', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    const html = document.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
    expect(html).toHaveClass(
      '--font-geist-sans',
      '--font-geist-mono',
      'h-full',
      'antialiased'
    );
  });
});

describe('RootLayout metadata', () => {
  it('exports the correct page title', () => {
    expect(metadata.title).toBe('BloodCare — Give Blood, Give Life');
  });

  it('exports a non-empty description', () => {
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});