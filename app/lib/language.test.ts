import { resolveTranslation } from './language';

describe('resolveTranslation', () => {
  it('returns the requested English translation', () => {
    expect(resolveTranslation('en', 'home')).toBe('Home');
  });

  it('returns the requested Tamil translation', () => {
    expect(resolveTranslation('ta', 'contactUs')).toBe('எங்களைத் தொடர்பு கொள்ளுங்கள்');
  });

  it('falls back to the key when a translation is missing', () => {
    expect(resolveTranslation('en', 'missingKey' as never)).toBe('missingKey');
  });
});
