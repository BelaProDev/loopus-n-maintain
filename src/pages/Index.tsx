import { Button } from "@/components/ui/button";
import { FileText, GitBranch, BarChart, Music, FileCheck, MessageCircle, Activity, Database, Server, Cog, Settings, Home, Mail, BookOpen, FolderOpen, Image } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const allLinks = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Activity, label: "Electrics", path: "/electrics" },
  { icon: Database, label: "Plumbing", path: "/plumbing" },
  { icon: Server, label: "Ironwork", path: "/ironwork" },
  { icon: Cog, label: "Woodwork", path: "/woodwork" },
  { icon: Settings, label: "Architecture", path: "/architecture" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: GitBranch, label: "Diagrams", path: "/diagrams" },
  { icon: BarChart, label: "Analytics", path: "/analytics" },
  { icon: Music, label: "Audio", path: "/audio" },
  { icon: FileCheck, label: "Invoicing", path: "/invoicing" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Image, label: "Photo Gallery", path: "/photo-gallery" },
  { icon: BookOpen, label: "Documentation", path: "/docs" },
  { icon: FolderOpen, label: "Dropbox Explorer", path: "/dropbox-explorer" },
  { icon: Settings, label: "Admin", path: "/koalax" },
  { icon: Mail, label: "Email Management", path: "/koalax/emails" }
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation(["common", "tools", "auth", "services"]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-primary text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl flex flex-col gap-6 animate-fade-in">
              <img 
                src="/forest-lidar.png" 
                alt="Forest Lidar Logo" 
                className="h-16 w-auto border-[3px] border-primary rounded-lg mb-4"
              />
              {!isAuthenticated && (
                <Link to="/login">
                  <Button 
                    size="lg" 
                    className="glass-morphism hover:bg-white/30 transition-colors w-full sm:w-auto"
                  >
                    {t("auth:signIn")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mb-16 bg-white/50 dark:bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-8 text-center">TOOLS AND FEATURES</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all group"
                  >
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 mr-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;