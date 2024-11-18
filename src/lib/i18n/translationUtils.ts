import i18n from 'i18next';

export const getCurrentLanguage = () => {
  return localStorage.getItem('i18nextLng') || i18n.language;
};

export const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.lang = lang;
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

export const getAvailableLanguages = () => ['en', 'es', 'fr'];

export const translateWithFallback = (key: string, namespace: string, fallback: string = '') => {
  const translation = i18n.t(key, { ns: namespace });
  if (translation === key) {
    console.warn(`Missing translation for key: ${key} in namespace: ${namespace}`);
    return fallback;
  }
  return translation;
};

export const formatTranslatedDate = (date: Date) => {
  return new Intl.DateTimeFormat(getCurrentLanguage()).format(date);
};

export const translateWithVariables = (
  key: string, 
  namespace: string,
  variables: Record<string, string | number>
) => {
  const translation = i18n.t(key, { ns: namespace, ...variables });
  if (translation === key) {
    console.warn(`Missing translation for key: ${key} in namespace: ${namespace}`);
  }
  return translation;
};

export const ensureNamespace = (key: string, defaultNs: string = 'common') => {
  if (!key.includes(':')) {
    console.warn(`Translation key missing namespace: ${key}, using default namespace: ${defaultNs}`);
    return `${defaultNs}:${key}`;
  }
  return key;
};