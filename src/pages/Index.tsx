import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import texts from "@/data/website-texts.json";

const services = [
  {
    icon: Zap,
    title: texts.home.services.electrics.title,
    description: texts.home.services.electrics.description,
    path: "/electrics",
  },
  {
    icon: Wrench,
    title: texts.home.services.plumbing.title,
    description: texts.home.services.plumbing.description,
    path: "/plumbing",
  },
  {
    icon: Building2,
    title: texts.home.services.ironwork.title,
    description: texts.home.services.ironwork.description,
    path: "/ironwork",
  },
  {
    icon: Hammer,
    title: texts.home.services.woodwork.title,
    description: texts.home.services.woodwork.description,
    path: "/woodwork",
  },
  {
    icon: PencilRuler,
    title: texts.home.services.architecture.title,
    description: texts.home.services.architecture.description,
    path: "/architecture",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        className: "bg-green-500 text-white",
      });
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1">
        <div className="bg-[#2E5984] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {texts.home.hero.title}
              </h1>
              <p className="text-xl mb-8">
                {texts.home.hero.subtitle}
              </p>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate("/login")}
                  size="lg" 
                  className="bg-white text-[#2E5984] hover:bg-gray-100"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2E5984]">
            {texts.home.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
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
                    className="w-full"
                  >
                    Learn More
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