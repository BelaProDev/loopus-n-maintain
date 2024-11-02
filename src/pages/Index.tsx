import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const services = [
  {
    icon: Zap,
    title: "electrical",
    description: "electrical.description",
    path: "/electrics",
  },
  {
    icon: Wrench,
    title: "plumbing",
    description: "plumbing.description",
    path: "/plumbing",
  },
  {
    icon: Building2,
    title: "ironwork",
    description: "ironwork.description",
    path: "/ironwork",
  },
  {
    icon: Hammer,
    title: "woodworking",
    description: "woodworking.description",
    path: "/woodwork",
  },
  {
    icon: PencilRuler,
    title: "architecture",
    description: "architecture.description",
    path: "/architecture",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("services");

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1">
        <div id="hero" className="bg-[#2E5984] text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl flex flex-col gap-6">
              <h1 className="text-3xl md:text-5xl font-bold">
                {t("app.name")}
              </h1>
              {!isAuthenticated && (
                <>
                  <p className="text-lg md:text-xl">
                    {t("auth.welcome")}
                  </p>
                  <Button 
                    onClick={() => navigate("/login")}
                    size="lg" 
                    className="bg-white text-[#2E5984] hover:bg-gray-100 w-full sm:w-auto"
                  >
                    {t("auth.signIn")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div id="services" className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[#2E5984]">
            {t("nav.services")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <service.icon className="h-8 w-8 text-[#2E5984] flex-shrink-0" />
                    <CardTitle className="flex-1">{t(`${service.title}.title`)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-gray-600 mb-4 flex-1">{t(`${service.title}.description`)}</p>
                  <Button 
                    onClick={() => navigate(service.path)}
                    variant="outline" 
                    className="w-full mt-auto"
                  >
                    {t("common.learnMore")}
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