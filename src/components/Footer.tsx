import { Home, Settings, Mail, Phone, Github, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2E5984] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <div className="flex flex-col space-y-2">
              <a href="tel:+32489127067" className="hover:underline flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +32 489 12 70 67
              </a>
              <a href="mailto:pro.belalawson@gmail.com" className="hover:underline flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                pro.belalawson@gmail.com
              </a>
              <a 
                href="https://github.com/BelaProDev/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline flex items-center"
              >
                <Github className="h-4 w-4 mr-2" />
                BelaProDev
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
                Loopus Admin
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/docs">
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </Link>
            </Button>
          </div>

          <div className="text-sm text-gray-300">
            <Link to="https://github.com/BelaProDev/loopus-n-maintain#readme">
              © 2024 Loopus&Maintain
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;