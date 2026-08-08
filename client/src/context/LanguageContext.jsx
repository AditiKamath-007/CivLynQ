import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
];

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('civlynq_language');
    if (savedLang) {
      setLanguageState(savedLang);
      setHasSelectedLanguage(true);
      applyGoogleTranslate(savedLang);
    }
  }, []);

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    setHasSelectedLanguage(true);
    localStorage.setItem('civlynq_language', langCode);
    applyGoogleTranslate(langCode);
  };

  const applyGoogleTranslate = (langCode) => {
    if (langCode === 'en') {
      const hasCookie = document.cookie.includes('googtrans=');
      if (hasCookie) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        window.location.reload();
      }
      return;
    }

    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/`;
    }
  };

  const currentLanguageName = LANGUAGES.find(l => l.code === language)?.name || 'English';

  const value = {
    language,
    currentLanguageName,
    hasSelectedLanguage,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
