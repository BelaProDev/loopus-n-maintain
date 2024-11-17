import { Home, Settings, Mail, Phone, Github, BookOpen, FolderOpen, MessageCircle, Image } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["common"]);

  return (
    <footer className="bg-[#2E5984] backdrop-blur-lg text-white mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start bg-white/5 p-6 rounded-lg backdrop-blur-md">
            <h3 className="text-xl md:text-2xl font-semibold mb-6">{t("common:nav.contact")}</h3>
            <div className="flex flex-col space-y-4">
              <a 
                href="tel:+32489127067" 
                className="hover:text-white/90 flex items-center transition-colors group"
                aria-label={t("common:contact.phone")}
              >
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 mr-3">
                  <Phone className="h-4 w-4" />
                </div>
                +32 489 12 70 67
              </a>
              <a 
                href="mailto:pro.belalawson@gmail.com" 
                className="hover:text-white/90 flex items-center transition-colors group"
                aria-label={t("common:contact.email")}
              >
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 mr-3">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="break-all">pro.belalawson@gmail.com</span>
              </a>
              <a 
                href="https://github.com/BelaProDev/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white/90 flex items-center transition-colors group"
                aria-label={t("common:contact.github")}
              >
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 mr-3">
                  <Github className="h-4 w-4" />
                </div>
                BelaProDev
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-6 rounded-lg backdrop-blur-md">
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/20">
              <Link to="/" className="flex items-center justify-start w-full">
                <Home className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("common:nav.home")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/20">
              <Link to="/admin" className="flex items-center justify-start w-full">
                <Settings className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("common:nav.admin")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/20">
              <Link to="/docs" className="flex items-center justify-start w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("common:nav.docs")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/20">
              <Link to="/dropbox-explorer" className="flex items-center justify-start w-full">
                <FolderOpen className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("common:nav.dropbox")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/20">
              <Link to="/tools/chat" className="flex items-center justify-start w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("common:nav.chat")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/20">
              <Link to="/tools/photo-gallery" className="flex items-center justify-start w-full">
                <Image className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("common:nav.gallery")}</span>
              </Link>
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white/80 text-center md:text-right bg-white/5 p-6 rounded-lg backdrop-blur-md">
            <Link 
              to="https://github.com/BelaProDev/loopus-n-maintain#readme"
              className="hover:text-white transition-colors"
              aria-label={t("common:nav.docs")}
            >
              © 2024 {t("common:app.name")}
              <br />
              {t("common:nav.docs")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;