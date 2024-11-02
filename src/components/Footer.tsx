import { Home, Settings, Mail, Phone, Github, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["common"]);

  return (
    <footer className="bg-[#2E5984] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between md:items-start">
          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">{t("common:common.contact")}</h3>
            <div className="flex flex-col space-y-3">
              <a 
                href="tel:+32489127067" 
                className="hover:underline flex items-center hover:text-gray-200 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                +32 489 12 70 67
              </a>
              <a 
                href="mailto:pro.belalawson@gmail.com" 
                className="hover:underline flex items-center hover:text-gray-200 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                pro.belalawson@gmail.com
              </a>
              <a 
                href="https://github.com/BelaProDev/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline flex items-center hover:text-gray-200 transition-colors"
              >
                <Github className="h-4 w-4 mr-2" />
                BelaProDev
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center">
            <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
              <Link to="/" className="flex items-center justify-center">
                <Home className="h-4 w-4 mr-2" />
                {t("common:nav.home")}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
              <Link to="/koalax" className="flex items-center justify-center">
                <Settings className="h-4 w-4 mr-2" />
                {t("common:nav.admin")}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
              <Link to="/docs" className="flex items-center justify-center">
                <BookOpen className="h-4 w-4 mr-2" />
                {t("common:nav.docs")}
              </Link>
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-300 text-center md:text-right">
            <Link 
              to="https://github.com/BelaProDev/loopus-n-maintain#readme"
              className="hover:text-white transition-colors"
            >
              © 2024 {t("common:app.name")}. {t("common:nav.docs")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;