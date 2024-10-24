import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { styles } from "@/lib/styles";
import ServiceForm from "@/components/service/ServiceForm";

interface ServiceLayoutProps {
  title: string;
  description: string;
  commonIssues: { id: string; label: string }[];
  faqs: { question: string; answer: string }[];
}

const ServiceLayout = ({ title, description, commonIssues, faqs }: ServiceLayoutProps) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getWhatsAppNumber = (service: string) => {
    const envVar = `app_whatss_${service.toLowerCase()}`;
    return import.meta.env[envVar] || "";
  };

  const handleWhatsAppContact = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const service = title.split(" ")[0].toLowerCase();
    const whatsappNumber = getWhatsAppNumber(service);
    const issues = selectedIssues
      .map(id => commonIssues.find(issue => issue.id === id)?.label)
      .join(", ");
    const message = `Hello, I need help with the following issues: ${issues}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        {!isAuthenticated && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>Please log in to access all features and services.</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div id="overview" className={styles.glassEffect}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>

          <div id="service-options" className={styles.serviceGrid}>
            <Card id="quick-help" className={styles.woodTexture}>
              <h2 className={styles.subtitle}>Quick Help</h2>
              <div className={styles.formGroup}>
                {commonIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={issue.id}
                      checked={selectedIssues.includes(issue.id)}
                      onCheckedChange={(checked) => {
                        setSelectedIssues(checked
                          ? [...selectedIssues, issue.id]
                          : selectedIssues.filter(i => i !== issue.id)
                        );
                      }}
                    />
                    <Label htmlFor={issue.id}>{issue.label}</Label>
                  </div>
                ))}
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact via WhatsApp
                </Button>
              </div>
            </Card>

            <ServiceForm title={title} isAuthenticated={isAuthenticated} />
          </div>

          <div id="faq" className={styles.faqContainer}>
            <h2 className={styles.subtitle}>Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLayout;
