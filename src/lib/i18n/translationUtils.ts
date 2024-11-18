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
  return translation === key ? fallback : translation;
};

export const formatTranslatedDate = (date: Date) => {
  return new Intl.DateTimeFormat(getCurrentLanguage()).format(date);
};

export const translateWithVariables = (
  key: string, 
  namespace: string,
  variables: Record<string, string | number>
) => {
  return i18n.t(key, { ns: namespace, ...variables });
};

export const ensureNamespace = (key: string, defaultNs: string = 'common') => {
  return key.includes(':') ? key : `${defaultNs}:${key}`;
};