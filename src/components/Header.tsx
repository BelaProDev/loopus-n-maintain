import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const tools = [
  { name: "documents", path: "/documents" },
  { name: "diagrams", path: "/diagrams" },
  { name: "analytics", path: "/analytics" },
  { name: "audio", path: "/audio" },
  { name: "invoicing", path: "/invoicing" },
];

const Header = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation(["common"]);

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
    <header className="border-b shadow-lg relative bg-background">
      {isOffline && (
        <Badge 
          variant="destructive" 
          className="absolute top-2 right-2 md:right-4 flex items-center gap-1 z-50"
        >
          Offline
        </Badge>
      )}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
            <span>Digital Toolbox</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden md:flex items-center flex-wrap gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="nav-link"
                >
                  {t(`tools:${tool.name}.title`)}
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  onClick={logout}
                  variant="outline"
                  className="ml-4"
                >
                  {t("auth:signOut")}
                </Button>
              )}
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    className="nav-link text-lg"
                  >
                    {t(`tools:${tool.name}.title`)}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="mt-4"
                  >
                    {t("auth:signOut")}
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