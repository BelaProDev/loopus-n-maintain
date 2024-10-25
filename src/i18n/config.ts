import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { commonTranslations } from './translations/common';
import { serviceTranslations } from './translations/services';

const resources = {
  en: {
    translation: {
      ...commonTranslations.en,
      ...serviceTranslations.en,
    },
  },
  fr: {
    translation: {
      ...commonTranslations.fr,
      ...serviceTranslations.fr,
    },
  },
  nl: {
    translation: {
      ...commonTranslations.nl,
      ...serviceTranslations.nl,
    },
  },
  es: {
    translation: {
      ...commonTranslations.es,
      ...serviceTranslations.es,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;