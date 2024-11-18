import { useTranslation } from 'react-i18next';
import { 
  getCurrentLanguage, 
  changeLanguage, 
  translateWithFallback,
  formatTranslatedDate,
  translateWithVariables,
  ensureNamespace
} from '@/lib/i18n/translationUtils';

export const useTranslations = (namespaces: string[] = ['common']) => {
  const { t, i18n } = useTranslation(namespaces);

  const translate = (key: string, variables?: Record<string, string | number>) => {
    const namespacedKey = ensureNamespace(key);
    return variables ? t(namespacedKey, variables) : t(namespacedKey);
  };

  return {
    t: translate,
    i18n,
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    translateWithFallback: (key: string, fallback: string) => 
      translateWithFallback(key, namespaces[0], fallback),
    formatTranslatedDate,
    translateWithVariables: (key: string, variables: Record<string, string | number>) =>
      translateWithVariables(key, namespaces[0], variables)
  };
};