import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './locales/en/common.json';
import services from './locales/en/services.json';
import admin from './locales/en/admin.json';
import auth from './locales/en/auth.json';
import docs from './locales/en/docs.json';

// Import Spanish translations
import commonEs from './locales/es/common.json';
import servicesEs from './locales/es/services.json';
import adminEs from './locales/es/admin.json';
import authEs from './locales/es/auth.json';
import docsEs from './locales/es/docs.json';

// Import French translations
import commonFr from './locales/fr/common.json';
import servicesFr from './locales/fr/services.json';
import adminFr from './locales/fr/admin.json';
import authFr from './locales/fr/auth.json';
import docsFr from './locales/fr/docs.json';

const resources = {
  en: {
    common,
    services,
    admin,
    auth,
    docs
  },
  es: {
    common: commonEs,
    services: servicesEs,
    admin: adminEs,
    auth: authEs,
    docs: docsEs
  },
  fr: {
    common: commonFr,
    services: servicesFr,
    admin: adminFr,
    auth: authFr,
    docs: docsFr
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'services', 'admin', 'auth', 'docs'],
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
  });

export default i18n;