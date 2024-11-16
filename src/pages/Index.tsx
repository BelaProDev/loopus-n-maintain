import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, GitBranch, BarChart, Music, FileCheck, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

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

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation(["common", "tools", "auth"]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-primary text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl flex flex-col gap-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold">
                {t("common:app.name")}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {t("common:app.description")}
              </p>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate("/login")}
                  size="lg" 
                  className="glass-morphism hover:bg-white/30 transition-colors w-full sm:w-auto"
                >
                  {t("auth:signIn")}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient animate-fade-in">
            {t("common:nav.tools")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Card 
                key={tool.title} 
                className={`group hover:shadow-xl transition-all duration-300 border-none overflow-hidden relative animate-scale-up ${tool.bgClass} bg-opacity-5`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="flex-1">{t(`tools:${tool.title}.title`)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">
                    {t(`tools:${tool.title}.description`)}
                  </p>
                  <Button 
                    onClick={() => navigate(tool.path)}
                    variant="outline" 
                    className="w-full group-hover:border-primary/50 transition-colors"
                  >
                    {t("common:common.learnMore")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
