import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getLanguageResources } from './lib/i18n/resources';

const i18nInstance = i18n.createInstance();

i18nInstance
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: getLanguageResources(),
    fallbackLng: 'en',
    defaultNS: 'core',
    ns: [
      'core',
      'services',
      'admin',
      'auth',
      'docs',
      'ui',
      'app',
      'settings',
      'tools',
      'tools/documents',
      'tools/analytics',
      'tools/audio',
      'home',
      'common'
    ],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode']
    },
    react: {
      useSuspense: false, // Changed to false to prevent suspense issues
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    },
    returnNull: false,
    returnEmptyString: false,
    returnObjects: false,
    debug: true // Added for debugging translation issues
  });

// Add a debug listener to help track translation loading
i18nInstance.on('initialized', (options) => {
  console.log('i18n initialized:', options);
});

i18nInstance.on('loaded', (loaded) => {
  console.log('i18n loaded:', loaded);
});

i18nInstance.on('failedLoading', (lng, ns, msg) => {
  console.error('i18n failed loading:', { lng, ns, msg });
});

i18nInstance.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  document.documentElement.lang = lng;
});

export default i18nInstance;