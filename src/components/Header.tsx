import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { Link } from "react-router-dom";

const maintenanceFields = [
  { name: "Electrics", path: "/electrics" },
  { name: "Plumbing", path: "/plumbing" },
  { name: "Ironwork", path: "/ironwork" },
  { name: "Woodwork", path: "/woodwork" },
  { name: "Architecture", path: "/architecture" },
];

const Header = () => {
  return (
    <header className="border-b bg-background text-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold text-accent flex items-center gap-2">
            <img src="/forest-lidar.png" alt="CraftCoordination" className="h-8 w-auto" />
            CraftCoordination
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {maintenanceFields.map((field) => (
              <Link
                key={field.name}
                to={field.path}
                className="text-gray-300 hover:text-accent transition-colors"
              >
                {field.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background text-white">
              <div className="flex flex-col space-y-4 mt-8">
                {maintenanceFields.map((field) => (
                  <Link
                    key={field.name}
                    to={field.path}
                    className="text-lg text-gray-300 hover:text-accent transition-colors"
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