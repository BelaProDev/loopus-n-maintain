import { Menu, WifiOff, LogOut, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const maintenanceFields = [
  { name: "Electrics", path: "/electrics" },
  { name: "Plumbing", path: "/plumbing" },
  { name: "Ironwork", path: "/ironwork" },
  { name: "Woodwork", path: "/woodwork" },
  { name: "Architecture", path: "/architecture" },
];

const Header = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <header className="border-b shadow-lg relative bg-[#F5F1EA]">
      {isOffline && (
        <Badge 
          variant="destructive" 
          className="absolute top-2 right-2 md:right-4 flex items-center gap-1 z-50 font-semibold"
        >
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      )}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
            <div className="flex-shrink-0">
              <img 
                src="/forest-lidar.png" 
                alt={t('app.name')}
                className="h-8 w-auto object-contain border border-[#2e5984] border-solid p-0.5"
              />
            </div>
            <span className="text-[#2E5984]">{t('app.name')}</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden md:flex items-center flex-wrap gap-4">
              {maintenanceFields.map((field) => (
                <Link
                  key={field.name}
                  to={field.path}
                  className="text-[#2E5984] hover:text-[#4A90E2] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E5984] focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  {t(`services.${field.name.toLowerCase()}.title`)}
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex items-center gap-2 text-[#2E5984] hover:text-[#4A90E2] ml-4"
                >
                  <LogOut className="h-4 w-4" />
                  {t('auth.signOut')}
                </Button>
              )}
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#2E5984] hover:bg-[#2E5984]/10 focus:ring-2 focus:ring-[#2E5984]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#F5F1EA] border-l border-[#2E5984]/20">
              <div className="flex flex-col space-y-4 mt-8">
                {maintenanceFields.map((field) => (
                  <Link
                    key={field.name}
                    to={field.path}
                    className="text-lg text-[#2E5984] hover:text-[#4A90E2] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E5984] rounded-md px-2 py-1"
                  >
                    {t(`services.${field.name.toLowerCase()}.title`)}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="flex items-center gap-2 text-[#2E5984] hover:text-[#4A90E2] mt-4"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.signOut')}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;