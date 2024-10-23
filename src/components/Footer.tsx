import { Home, Settings, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2E5984] text-white mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">Emergency Contact</h2>
            <div className="flex items-center space-x-2">
              <a 
                href="tel:1-800-MAINTAIN" 
                className="hover:underline"
                aria-label="Call emergency maintenance at 1-800-MAINTAIN"
              >
                1-800-MAINTAIN
              </a>
            </div>
          </div>
          
          <nav aria-label="Footer navigation">
            <ul className="flex space-x-4 list-none p-0">
              <li>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                    Home
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/koalax">
                    <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                    Loopus Admin
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  Help
                </Button>
              </li>
            </ul>
          </nav>

          <div className="text-sm text-gray-300">
            © 2024 Loopus&Maintain. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;