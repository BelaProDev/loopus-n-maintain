import { Mail, Phone, Github, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["common"]);
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Electrical", path: "/services/electrical" },
    { name: "Plumbing", path: "/services/plumbing" },
    { name: "Ironwork", path: "/services/ironwork" },
    { name: "Woodwork", path: "/services/woodwork" },
    { name: "Architecture", path: "/services/architecture" },
  ];

  const tools = [
    { name: "Documents", path: "/tools/documents" },
    { name: "Analytics", path: "/tools/analytics" },
    { name: "Invoicing", path: "/tools/invoicing" },
    { name: "Chat", path: "/tools/chat" },
  ];

  return (
    <footer className="bg-card border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-xl font-bold text-white">L</span>
              </div>
              <span className="text-xl font-semibold">
                <span className="gradient-text">Loopus</span> & Maintain
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional building maintenance services with modern digital tools for efficient project management.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t("common:nav.services", "Services")}</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">{t("common:nav.tools", "Tools")}</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.path}>
                  <Link
                    to={tool.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t("common:nav.contact", "Contact")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+32489127067"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +32 489 12 70 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:pro.belalawson@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  pro.belalawson@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/BelaProDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  BelaProDev
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Loopus & Maintain. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
