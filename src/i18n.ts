import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './locales/en/common.json';
import services from './locales/en/services.json';
import admin from './locales/en/admin.json';
import auth from './locales/en/auth.json';
import docs from './locales/en/docs.json';

const resources = {
  en: {
    common,
    services,
    admin,
    auth,
    docs
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    defaultNS: 'common',
    fallbackLng: 'en',
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