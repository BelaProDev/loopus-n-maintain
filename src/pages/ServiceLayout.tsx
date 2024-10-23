import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ServiceForm } from "@/components/service/ServiceForm";
import { ServiceFAQ } from "@/components/service/ServiceFAQ";

interface ServiceLayoutProps {
  title: string;
  description: string;
  commonIssues: { id: string; label: string }[];
  faqs: { question: string; answer: string }[];
}

const ServiceLayout = ({ title, description, commonIssues, faqs }: ServiceLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main id="service-content" className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated && (
          <Alert variant="destructive" className="mb-6" role="alert">
            <AlertDescription className="flex items-center justify-between">
              <span>Please log in to access all features and services.</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <section aria-labelledby="service-title" className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h1 id="service-title" className="text-3xl font-serif text-[#2E5984] mb-4">{title}</h1>
          <p className="text-gray-700 mb-8">{description}</p>

          <ServiceForm title={title} commonIssues={commonIssues} />
          <ServiceFAQ faqs={faqs} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLayout;