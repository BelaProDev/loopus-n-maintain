import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Languages } from "lucide-react";
import { toast } from "sonner";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation(['common']);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' }
  ];

  const handleLanguageChange = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      
      // Force reload all namespaces to ensure fresh translations
      await i18n.reloadResources(
        lng, 
        ['common', 'services', 'admin', 'auth', 'docs', 'ui', 'app', 'settings', 'tools']
      );

      localStorage.setItem('i18nextLng', lng);
      document.documentElement.lang = lng;

      toast.success(t('common:languageChanged', { 
        lng: languages.find(l => l.code === lng)?.label 
      }));
    } catch (error) {
      console.error('Language change error:', error);
      toast.error(t('common:languageChangeError'));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-[#2E5984] hover:bg-[#2E5984]/10"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t("common:language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, label }) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`cursor-pointer ${i18n.language === code ? 'font-bold' : ''}`}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;