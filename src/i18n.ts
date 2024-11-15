import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations
import common from './locales/en/common.json';
import services from './locales/en/services.json';
import admin from './locales/en/admin.json';
import auth from './locales/en/auth.json';
import docs from './locales/en/docs.json';
import ui from './locales/en/ui.json';
import app from './locales/en/app.json';
import settings from './locales/en/settings.json';

// Import Spanish translations
import commonEs from './locales/es/common.json';
import servicesEs from './locales/es/services.json';
import adminEs from './locales/es/admin.json';
import authEs from './locales/es/auth.json';
import docsEs from './locales/es/docs.json';
import uiEs from './locales/es/ui.json';
import appEs from './locales/es/app.json';
import settingsEs from './locales/es/settings.json';

// Import French translations
import commonFr from './locales/fr/common.json';
import servicesFr from './locales/fr/services.json';
import adminFr from './locales/fr/admin.json';
import authFr from './locales/fr/auth.json';
import docsFr from './locales/fr/docs.json';
import uiFr from './locales/fr/ui.json';
import appFr from './locales/fr/app.json';
import settingsFr from './locales/fr/settings.json';

const resources = {
  en: {
    common,
    services,
    admin,
    auth,
    docs,
    ui,
    app,
    settings
  },
  es: {
    common: commonEs,
    services: servicesEs,
    admin: adminEs,
    auth: authEs,
    docs: docsEs,
    ui: uiEs,
    app: appEs,
    settings: settingsEs
  },
  fr: {
    common: commonFr,
    services: servicesFr,
    admin: adminFr,
    auth: authFr,
    docs: docsFr,
    ui: uiFr,
    app: appFr,
    settings: settingsFr
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'services', 'admin', 'auth', 'docs', 'ui', 'app', 'settings'],
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