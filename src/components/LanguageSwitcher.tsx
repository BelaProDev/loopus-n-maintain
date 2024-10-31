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
        <Button variant="ghost" size="icon">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang}
            onClick={() => handleLanguageChange(lang)}
          >
            {t(`language.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;