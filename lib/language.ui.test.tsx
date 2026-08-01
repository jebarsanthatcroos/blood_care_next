import { fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './language';

function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div>
      <p data-testid="language">{language}</p>
      <p>{t('home')}</p>
      <button type="button" onClick={toggleLanguage}>
        Toggle language
      </button>
    </div>
  );
}

describe('LanguageProvider UI', () => {
  it('renders English text and switches to Tamil when toggled', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('language')).toHaveTextContent('en');

    fireEvent.click(screen.getByRole('button', { name: /toggle language/i }));

    expect(screen.getByText('முகப்பு')).toBeInTheDocument();
    expect(screen.getByTestId('language')).toHaveTextContent('ta');
  });
});
