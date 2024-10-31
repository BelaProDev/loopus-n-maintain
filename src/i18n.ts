import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES },
  fr: { translation: translationFR }
};

const i18nConfig = {
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  },
  react: {
    useSuspense: false
  }
};

i18n
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n;