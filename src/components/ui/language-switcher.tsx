import { Button } from "./button";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'nl', name: 'NL' },
    { code: 'es', name: 'ES' },
  ];

  return (
    <div className="flex space-x-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={i18n.language === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => i18n.changeLanguage(lang.code)}
          className="px-3 py-1"
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;