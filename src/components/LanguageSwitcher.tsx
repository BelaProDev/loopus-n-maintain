import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Languages } from "lucide-react";
import { changeLanguage, getAvailableLanguages } from '@/lib/i18n/translationUtils';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const languages = getAvailableLanguages();

  const handleLanguageChange = async (lng: string) => {
    await changeLanguage(lng);
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
          <span className="sr-only">{t("common.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className="cursor-pointer"
          >
            {t(`language.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;