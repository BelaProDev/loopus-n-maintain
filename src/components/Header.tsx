import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useQuery } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/fauna/settingsQueries";

const tools = [
  { name: "documents", path: "/tools/documents", icon: "📄" },
  { name: "diagrams", path: "/tools/diagrams", icon: "📊" },
  { name: "analytics", path: "/tools/analytics", icon: "📈" },
  { name: "audio", path: "/tools/audio", icon: "🎵" },
  { name: "business", path: "/admin/business", icon: "💼" }
];

const Header = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation(["common", "tools", "auth"]);

  const { data: logo, isError } = useQuery({
    queryKey: ['site-logo'],
    queryFn: settingsQueries.getLogo,
    retry: false,
    meta: {
      errorBoundary: false // This is the correct way to disable error boundary in v5
    }
  });

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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border/40">
      {isOffline && (
        <Badge 
          variant="destructive" 
          className="absolute top-2 right-2 md:right-4 flex items-center gap-1 z-50 animate-pulse"
        >
          {t("common:status.offline")}
        </Badge>
      )}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {!isError && logo ? (
              <img 
                src={`data:image/png;base64,${logo}`}
                alt="Site Logo" 
                className="h-8 w-auto border-[3px] border-primary rounded-lg"
              />
            ) : (
              <img 
                src="/forest-lidar.png" 
                alt="Forest Lidar Logo" 
                className="h-8 w-auto border-[3px] border-primary rounded-lg"
              />
            )}
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
                  <span className="text-lg">{tool.icon}</span>
                  <span className="ml-2">{t(`tools:${tool.name}.title`)}</span>
                </Link>
              ))}
              {isAuthenticated ? (
                <Button
                  onClick={logout}
                  variant="outline"
                  className="gradient-border"
                >
                  {t("auth:signOut")}
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="gradient-border"
                >
                  <Link to="/login">
                    {t("auth:signIn")}
                  </Link>
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
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    className="flex items-center gap-2 p-2 hover:bg-accent/10 rounded-md transition-colors"
                  >
                    <span>{tool.icon}</span>
                    {t(`tools:${tool.name}.title`)}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="mt-4"
                  >
                    {t("auth:signOut")}
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4"
                  >
                    <Link to="/login">
                      {t("auth:signIn")}
                    </Link>
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