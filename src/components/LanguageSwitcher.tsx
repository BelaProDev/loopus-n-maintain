import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useToast } from "./ui/use-toast";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' }
  ];

  const handleLanguageChange = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);
      toast({
        title: t('common.languageChanged'),
        description: t('common.languageChangeSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.languageChangeError'),
        variant: "destructive"
      });
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
          <span className="sr-only">{t("common.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, label }) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="cursor-pointer"
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;