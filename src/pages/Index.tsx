import { Button } from "@/components/ui/button";
import { FileText, GitBranch, BarChart, Music, FileCheck, MessageCircle, Activity, Database, Server, Cog, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import ServiceCard from "@/components/home/ServiceCard";
import ToolCard from "@/components/home/ToolCard";

const tools = [
  {
    icon: FileText,
    title: "documents",
    path: "/documents",
    gradient: "from-blue-500 to-cyan-500",
    bgClass: "bg-gradient-cool"
  },
  {
    icon: GitBranch,
    title: "diagrams",
    path: "/diagrams",
    gradient: "from-purple-500 to-pink-500",
    bgClass: "bg-gradient-elegant"
  },
  {
    icon: BarChart,
    title: "analytics",
    path: "/analytics",
    gradient: "from-green-500 to-emerald-500",
    bgClass: "bg-gradient-primary"
  },
  {
    icon: Music,
    title: "audio",
    path: "/audio",
    gradient: "from-orange-500 to-red-500",
    bgClass: "bg-gradient-warm"
  },
  {
    icon: FileCheck,
    title: "invoicing",
    path: "/invoicing",
    gradient: "from-violet-500 to-purple-500",
    bgClass: "bg-gradient-secondary"
  },
  {
    icon: MessageCircle,
    title: "chat",
    path: "/chat",
    gradient: "from-indigo-500 to-blue-500",
    bgClass: "bg-gradient-social"
  }
];

const services = [
  {
    icon: Activity,
    title: "electrical",
    path: "/electrics",
    gradient: "from-yellow-500 to-amber-500",
    bgClass: "bg-gradient-warning"
  },
  {
    icon: Database,
    title: "plumbing",
    path: "/plumbing",
    gradient: "from-blue-500 to-cyan-500",
    bgClass: "bg-gradient-info"
  },
  {
    icon: Server,
    title: "ironwork",
    path: "/ironwork",
    gradient: "from-red-500 to-rose-500",
    bgClass: "bg-gradient-danger"
  },
  {
    icon: Cog,
    title: "woodwork",
    path: "/woodwork",
    gradient: "from-orange-500 to-amber-500",
    bgClass: "bg-gradient-warning"
  },
  {
    icon: Settings,
    title: "architecture",
    path: "/architecture",
    gradient: "from-purple-500 to-violet-500",
    bgClass: "bg-gradient-purple"
  }
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
              <h1 className="text-4xl md:text-6xl font-bold font-serif">
                {t("app.name")}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {t("app.description")}
              </p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient animate-fade-in font-serif">
            {t("services:title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient animate-fade-in font-serif">
            {t("tools:title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;