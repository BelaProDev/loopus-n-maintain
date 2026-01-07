import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { name: "home", path: "/" },
  { name: "services", path: "/services" },
  { name: "tools", path: "/tools" },
  { name: "docs", path: "/docs" },
];

const Header = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  const { t } = useTranslation(["common", "auth"]);
  const location = useLocation();

  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      {isOffline && (
        <div className="bg-destructive/10 text-destructive text-center py-1 text-sm">
          {t("common:status.offline", "You are currently offline")}
        </div>
      )}
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <span className="text-xl font-semibold hidden sm:block">
              <span className="gradient-text">Loopus</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "nav-link-active" : ""}`}
              >
                {t(`common:nav.${link.name}`, link.name)}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Auth button - Desktop */}
            <div className="hidden md:block">
              {isLoading ? (
                <Button variant="ghost" size="sm" disabled>
                  <span className="animate-pulse">...</span>
                </Button>
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-24 truncate">
                        {user?.email?.split("@")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("auth:signOut", "Sign Out")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <Link to="/login" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    {t("auth:signIn", "Sign In")}
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col h-full pt-8">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          to={link.path}
                          className={`px-4 py-3 rounded-lg transition-colors ${
                            isActive(link.path)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          {t(`common:nav.${link.name}`, link.name)}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  <div className="mt-auto pb-8">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          {user?.email}
                        </div>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={signOut}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            {t("auth:signOut", "Sign Out")}
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Button className="w-full" asChild>
                          <Link to="/login">
                            <LogIn className="h-4 w-4 mr-2" />
                            {t("auth:signIn", "Sign In")}
                          </Link>
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
