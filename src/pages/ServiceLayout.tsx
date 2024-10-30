import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { styles } from "@/lib/styles";
import ServiceForm from "@/components/service/ServiceForm";
import { useQuery } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/fauna/settingsQueries";

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

  const { data: whatsappNumbers } = useQuery({
    queryKey: ['whatsapp-numbers'],
    queryFn: settingsQueries.getWhatsAppNumbers
  });

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
    const whatsappNumber = whatsappNumbers?.[service as keyof typeof whatsappNumbers] || "";
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
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {!isAuthenticated && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-4">
              <span>Please log in to access all features and services.</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="glass-effect rounded-lg p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#2E5984] mb-4">{title}</h1>
          <p className="text-base md:text-lg text-gray-700">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 wood-texture">
            <h2 className="text-2xl font-serif text-[#2E5984] mb-6">Quick Help</h2>
            <div className="space-y-4">
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

        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2E5984] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-effect p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-[#2E5984] mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLayout;