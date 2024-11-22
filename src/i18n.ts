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
    ns: ['core', 'services', 'admin', 'auth', 'docs', 'ui', 'app', 'settings', 'tools'],
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
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    },
    returnNull: false,
    returnEmptyString: false,
    returnObjects: false
  });

i18nInstance.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18nInstance;