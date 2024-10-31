import { useTranslation } from 'react-i18next';
import { 
  getCurrentLanguage, 
  changeLanguage, 
  translateWithFallback,
  formatTranslatedDate,
  translateWithVariables
} from '@/lib/i18n/translationUtils';

export const useTranslations = () => {
  const { t } = useTranslation();

  return {
    t,
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    translateWithFallback,
    formatTranslatedDate,
    translateWithVariables
  };
};