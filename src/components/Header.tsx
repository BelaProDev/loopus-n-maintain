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
        <nav className="flex items-center justify-between relative z-10">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <div>
              <img 
                src="/forest-lidar.png" 
                alt="Loopus&Maintain" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="text-[#2E5984]">Loopus&Maintain</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {maintenanceFields.map((field) => (
              <Link
                key={field.name}
                to={field.path}
                className="text-[#2E5984] hover:text-[#4A90E2] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E5984] focus:ring-offset-2 rounded-md px-2 py-1"
              >
                {field.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
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
                    {field.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;