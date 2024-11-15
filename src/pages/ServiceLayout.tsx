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
import { useTranslation } from "react-i18next";
import FAQSection from "@/components/service/FAQSection";
import { ContactMessage } from "@/lib/fauna/types";

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
  const { t } = useTranslation(["common", "services", "auth"]);

  const { data: whatsappNumbers } = useQuery({
    queryKey: ['whatsapp-numbers'],
    queryFn: settingsQueries.getWhatsAppNumbers
  });

  const handleWhatsAppContact = () => {
    if (!isAuthenticated) {
      toast({
        title: t("auth:auth.required"),
        description: t("auth:auth.required"),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const service = title.toLowerCase();
    const whatsappNumber = whatsappNumbers?.[service as keyof typeof whatsappNumbers] || "";
    const issues = selectedIssues
      .map(id => commonIssues.find(issue => issue.id === id)?.label)
      .join(", ");
    const message = t("services:whatsapp.message", { issues });
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const serviceType = title.toLowerCase() as ContactMessage['service'];

  return (
    <div className={styles.container}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {!isAuthenticated && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-4">
              <span>{t("auth:auth.required")}</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                {t("auth:auth.signIn")}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="glass-effect rounded-lg p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#2E5984] mb-4">
            {t(`services:${serviceType}.title`)}
          </h1>
          <p className="text-base md:text-lg text-gray-700">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 wood-texture">
            <h2 className="text-2xl font-serif text-[#2E5984] mb-6">
              {t("services:quickHelp")}
            </h2>
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
                {t("services:whatsapp.contact")}
              </Button>
            </div>
          </Card>

          <ServiceForm service={serviceType} />
        </div>

        <FAQSection faqs={faqs} />
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLayout;