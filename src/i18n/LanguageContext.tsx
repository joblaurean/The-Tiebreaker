import React, { createContext, useContext, useState, useMemo } from 'react';
import type { SupportedLanguage, LanguageMeta, Translations } from './types';
import { DEFAULT_LANGUAGE, STORAGE_LANG_KEY, SUPPORTED_LANGUAGES } from './constants';
import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { zh } from './locales/zh';

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES };

const DICTIONARIES: Record<SupportedLanguage, Translations> = {
  en,
  es,
  pt,
  fr,
  de,
  zh,
};


interface LanguageContextType {
  language: SupportedLanguage;
  currentMeta: LanguageMeta;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  languages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LANG_KEY) as SupportedLanguage | null;
      if (stored && DICTIONARIES[stored]) {
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: SupportedLanguage) => {
    if (!DICTIONARIES[lang]) return;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch (e) {
      console.warn('Could not persist language to localStorage:', e);
    }
  };

  const currentMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const t = useMemo(() => {
    return DICTIONARIES[language] || DICTIONARIES[DEFAULT_LANGUAGE];
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      currentMeta,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
    }),
    [language, currentMeta, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation(): Translations {
  const { t } = useLanguage();
  return t;
}
