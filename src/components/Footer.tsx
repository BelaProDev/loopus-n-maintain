import { Home, Settings, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2E5984] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">{t('contact')}</h3>
            <div className="flex flex-col items-start space-y-2">
              <a href="mailto:pro.belalawson@gmail.com" className="hover:underline flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                pro.belalawson@gmail.com
              </a>
              <a href="tel:+32489127067" className="hover:underline flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +32 489 12 70 67
              </a>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                {t('home')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/koalax">
                <Settings className="h-4 w-4 mr-2" />
                {t('loopusAdmin')}
              </Link>
            </Button>
          </div>

          <div className="text-sm text-gray-300">
            <Link to="https://github.com/BelaProDev/loopus-n-maintain#readme">
              © 2024 Loopus&Maintain. {t('docs')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;