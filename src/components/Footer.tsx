import { Home, Settings, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2E5984] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Emergency Contact</h3>
            <div className="flex items-center space-x-2">
              <a href="tel:1-800-MAINTAIN" className="hover:underline">
                1-800-MAINTAIN
              </a>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/koalax">
                <Settings className="h-4 w-4 mr-2" />
                Koalax Admin
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>

          <div className="text-sm text-gray-300">
            © 2024 MaintenancePro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;