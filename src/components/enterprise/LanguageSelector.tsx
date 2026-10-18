import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../i18n';
import type { SupportedLanguage } from '../../i18n/types';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, currentMeta, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors shadow-xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.navbar.languageSelectorLabel}
        title={t.navbar.languageSelectorLabel}
      >
        <span className="text-sm leading-none" role="img" aria-label={currentMeta.name}>
          {currentMeta.flag}
        </span>
        <span className="font-mono text-[11px] sm:text-xs font-bold text-slate-200">
          {currentMeta.shortCode}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 py-1.5 focus:outline-hidden divide-y divide-slate-800"
          role="listbox"
          aria-label={t.navbar.languageSelectorLabel}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {t.navbar.languageSelectorLabel}
          </div>
          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = lang.code === language;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <span className="truncate">{lang.nativeName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-800 border border-slate-700">
                      {lang.shortCode}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
