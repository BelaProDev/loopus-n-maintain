import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Building2, Wrench, Zap, Hammer, PencilRuler } from "lucide-react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/components/ui/use-toast";
import texts from "~/data/website-texts.json";
import StlViewer from "~/components/StlViewer";

export const meta: MetaFunction = () => {
  return [
    { title: "Loopus & Maintain" },
    { name: "description", content: "Professional Maintenance Management" },
  ];
};

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

export default function Index() {
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
      <main id="main-content" className="flex-1">
        <section aria-labelledby="hero-title" className="bg-[#2E5984]/90 backdrop-blur-sm text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 id="hero-title" className="text-4xl md:text-5xl font-bold mb-4">
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
                  aria-label="Sign in to access all features"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="services-title" className="container mx-auto px-4 py-16">
          <h2 id="services-title" className="text-3xl font-bold text-center mb-12 text-[#2E5984]">
            {texts.home.services.title}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
            {services.map((service) => (
              <li key={service.title}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/80">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <service.icon className="h-8 w-8 text-[#2E5984]" aria-hidden="true" />
                      <CardTitle>{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button 
                      onClick={() => navigate(service.path)}
                      variant="outline" 
                      className="w-full"
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <StlViewer />
      </main>
      <Footer />
    </div>
  );
}
