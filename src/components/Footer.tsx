import { Home, Settings, Mail, Phone, Github, BookOpen, FolderOpen, MessageCircle, Image } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["common"]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 backdrop-blur-lg text-card-foreground mt-auto border-t border-border/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start glass-panel p-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 gradient-heading">
              {t("nav.contact")}
            </h3>
            <div className="flex flex-col space-y-4">
              <a 
                href="tel:+32489127067" 
                className="hover:text-primary flex items-center transition-colors group"
                aria-label={t("nav.contact")}
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 mr-3">
                  <Phone className="h-4 w-4" />
                </div>
                +32 489 12 70 67
              </a>
              <a 
                href="mailto:pro.belalawson@gmail.com" 
                className="hover:text-primary flex items-center transition-colors group"
                aria-label={t("nav.contact")}
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 mr-3">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="break-all">pro.belalawson@gmail.com</span>
              </a>
              <a 
                href="https://github.com/BelaProDev/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary flex items-center transition-colors group"
                aria-label={t("nav.contact")}
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 mr-3">
                  <Github className="h-4 w-4" />
                </div>
                BelaProDev
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2 glass-panel p-6">
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link to="/" className="flex items-center justify-start w-full">
                <Home className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("nav.home")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link to="/admin" className="flex items-center justify-start w-full">
                <Settings className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("nav.admin")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link to="/docs" className="flex items-center justify-start w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("nav.docs")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link to="/dropbox-explorer" className="flex items-center justify-start w-full">
                <FolderOpen className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("nav.dropbox")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link to="/tools/chat" className="flex items-center justify-start w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("nav.chat")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link to="/tools/photo-gallery" className="flex items-center justify-start w-full">
                <Image className="h-4 w-4 mr-2" />
                <span className="text-sm">{t("nav.gallery")}</span>
              </Link>
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-right glass-panel p-6">
            <Link 
              to="https://github.com/BelaProDev/loopus-n-maintain#readme"
              className="hover:text-primary transition-colors"
              aria-label={t("nav.docs")}
            >
              © {currentYear} {t("app.name")}
              <br />
              {t("nav.docs")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;