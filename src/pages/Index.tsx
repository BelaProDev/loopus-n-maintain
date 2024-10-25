import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { animations } from "@/lib/animations";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const services = [
    {
      icon: Zap,
      title: t('electrical_services'),
      description: t('electrical_description'),
      path: "/electrics",
    },
    {
      icon: Wrench,
      title: t('plumbing_services'),
      description: t('plumbing_description'),
      path: "/plumbing",
    },
    {
      icon: Building2,
      title: t('ironwork_services'),
      description: t('ironwork_description'),
      path: "/ironwork",
    },
    {
      icon: Hammer,
      title: t('woodwork_services'),
      description: t('woodwork_description'),
      path: "/woodwork",
    },
    {
      icon: PencilRuler,
      title: t('architecture_services'),
      description: t('architecture_description'),
      path: "/architecture",
    },
  ];

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
                <div className={`${animations.fadeInSlide} delay-200`}>
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
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <service.icon className="h-8 w-8 text-[#2E5984]" />
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
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