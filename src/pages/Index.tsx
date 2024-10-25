import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { animations } from "@/lib/animations";

const services = [
  {
    icon: Zap,
    title: "Electrics",
    description: "Professional electrical maintenance and repairs",
    path: "/electrics",
  },
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Expert plumbing solutions and maintenance",
    path: "/plumbing",
  },
  {
    icon: Building2,
    title: "Ironwork",
    description: "Structural and decorative ironwork services",
    path: "/ironwork",
  },
  {
    icon: Hammer,
    title: "Woodwork",
    description: "Custom woodworking and carpentry services",
    path: "/woodwork",
  },
  {
    icon: PencilRuler,
    title: "Architecture",
    description: "Architectural design, planning and other services",
    path: "/architecture",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1">
        <div id="hero" className={`bg-[#2E5984] text-white py-16 ${animations.fadeIn}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${animations.fadeInSlide}`}>
                {t('welcome')}
              </h1>
              {!isAuthenticated && (
                <div className={animations.fadeInSlide}>
                  <p className="text-xl mb-8">
                    {t('welcomeMessage')}
                  </p>
                  <Button 
                    onClick={() => navigate("/login")}
                    size="lg" 
                    className={`bg-white text-[#2E5984] hover:bg-gray-100 ${animations.buttonHover}`}
                  >
                    {t('signIn')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="services" className={`container mx-auto px-4 py-16 ${animations.fadeIn}`}>
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2E5984]">
            {t('ourServices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.title} 
                className={`border-none shadow-lg ${animations.cardHover} ${animations.fadeInSlide}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <service.icon className="h-8 w-8 text-[#2E5984]" />
                    <CardTitle>{t(service.title.toLowerCase())}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{t(`${service.title.toLowerCase()}_description`)}</p>
                  <Button 
                    onClick={() => navigate(service.path)}
                    variant="outline" 
                    className={`w-full ${animations.buttonHover}`}
                  >
                    {t('learnMore')}
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