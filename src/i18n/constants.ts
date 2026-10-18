import type { LanguageMeta, SupportedLanguage } from './types';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const STORAGE_LANG_KEY = 'the_tiebreaker_enterprise_language_v1';

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', shortCode: 'EN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', shortCode: 'ES' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', shortCode: 'PT' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', shortCode: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', shortCode: 'DE' },
  { code: 'zh', name: 'Simplified Chinese', nativeName: '中文 (Chinese)', flag: '🇨🇳', shortCode: 'ZH' },
];
