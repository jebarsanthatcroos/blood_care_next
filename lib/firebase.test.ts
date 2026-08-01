/* eslint-disable @typescript-eslint/no-require-imports */
describe('firebase client initialization', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn(() => Promise.resolve({ ok: true, json: async () => ({}) })),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('does not throw during a build-like phase when Firebase config is missing', () => {
    process.env.NEXT_PHASE = 'phase-production-build';

    expect(() => require('./firebase')).not.toThrow();
  });

});
