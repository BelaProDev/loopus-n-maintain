import i18n from 'i18next';

export const getCurrentLanguage = () => {
  return localStorage.getItem('language') || i18n.language;
};

export const changeLanguage = async (lang: string) => {
  localStorage.setItem('language', lang);
  await i18n.changeLanguage(lang);
};

export const getAvailableLanguages = () => ['en', 'es', 'fr'];

export const translateWithFallback = (key: string, fallback: string = '') => {
  const translation = i18n.t(key);
  return translation === key ? fallback : translation;
};

export const formatTranslatedDate = (date: Date) => {
  return new Intl.DateTimeFormat(getCurrentLanguage()).format(date);
};

export const translateWithVariables = (
  key: string, 
  variables: Record<string, string | number>
) => {
  return i18n.t(key, variables);
};