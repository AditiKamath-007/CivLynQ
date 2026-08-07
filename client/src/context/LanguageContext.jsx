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
    // This function will programmatically change the Google Translate widget if it exists
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // If widget hasn't loaded yet, try to set a cookie so it loads in the right language
      // Google translate cookie format: /auto/lang
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
