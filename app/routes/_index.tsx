import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/auth";
import { useToast } from "~/components/ui/use-toast";
import texts from "~/data/website-texts.json";
import { ServiceCard } from "~/components/services/ServiceCard";
import { HeroSection } from "~/components/home/HeroSection";
import { StlViewer } from "~/components/StlViewer";
import { Layout } from "~/components/Layout";
import { services } from "~/lib/services";

export const meta: MetaFunction = () => {
  return [
    { title: "Loopus & Maintain" },
    { name: "description", content: texts.home.hero.subtitle },
  ];
};

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
    <Layout>
      <HeroSection isAuthenticated={isAuthenticated} onSignIn={() => navigate("/login")} />
      
      <section aria-labelledby="services-title" className="container mx-auto px-4 py-16">
        <h2 
          id="services-title" 
          className="text-3xl font-bold text-center mb-12 text-[#2E5984] font-['Playfair_Display']"
        >
          {texts.home.services.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.path}
              service={service}
              onLearnMore={() => navigate(service.path)}
            />
          ))}
        </div>
      </section>

      <StlViewer />
    </Layout>
  );
}