import { Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2E5984] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Emergency Contact</h3>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <a href="tel:1-800-MAINTAIN" className="hover:underline">
                1-800-MAINTAIN
              </a>
            </div>
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