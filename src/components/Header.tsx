import { Menu, WifiOff } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

const maintenanceFields = [
  { name: "Electrics", path: "/electrics" },
  { name: "Plumbing", path: "/plumbing" },
  { name: "Ironwork", path: "/ironwork" },
  { name: "Woodwork", path: "/woodwork" },
  { name: "Architecture", path: "/architecture" },
];

const Header = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
    <header className="border-b shadow-lg relative bg-[#F5F1EA]" role="banner">
      {isOffline && (
        <div 
          role="alert"
          aria-live="polite"
          className="absolute top-2 right-2 md:right-4 z-50"
        >
          <Badge 
            variant="destructive" 
            className="flex items-center gap-1 font-semibold"
          >
            <WifiOff className="h-3 w-3" aria-hidden="true" />
            Offline
          </Badge>
        </div>
      )}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between relative z-10" aria-label="Main navigation">
          <Link 
            to="/" 
            className="text-2xl font-['Playfair_Display'] font-bold text-primary flex items-center gap-2"
            aria-label="Loopus&Maintain Home"
          >
            <img 
              src="/forest-lidar.png" 
              alt=""
              className="h-12 w-auto object-contain"
              aria-hidden="true"
            />
            <span className="text-[#2E5984]">Loopus&Maintain</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 list-none p-0">
            {maintenanceFields.map((field) => (
              <li key={field.name}>
                <Link
                  to={field.path}
                  className="text-[#2E5984] hover:text-[#4A90E2] font-['Playfair_Display'] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E5984] focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  {field.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#2E5984] hover:bg-[#2E5984]/10 focus:ring-2 focus:ring-[#2E5984]"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#F5F1EA] border-l border-[#2E5984]/20">
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col space-y-4 mt-8 list-none p-0">
                  {maintenanceFields.map((field) => (
                    <li key={field.name}>
                      <Link
                        to={field.path}
                        className="text-lg text-[#2E5984] hover:text-[#4A90E2] font-['Playfair_Display'] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E5984] rounded-md px-2 py-1"
                      >
                        {field.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;