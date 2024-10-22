import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Send, Home } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated && (
          <Alert className="mb-6">
            <AlertDescription>
              Please <Button variant="link" className="p-0 text-primary" onClick={() => navigate("/login")}>log in</Button> to access all features and services.
            </AlertDescription>
          </Alert>
        )}
        <div className="glass-effect rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-serif text-[#2E5984] mb-4">{title}</h1>
          <p className="text-lg text-gray-700 mb-8">{description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Help Section */}
            <Card className="p-6 wood-texture">
              <h2 className="text-2xl font-serif text-[#2E5984] mb-4">Quick Help</h2>
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

            {/* Contact Form */}
            <Card className="p-6 wood-texture">
              <h2 className="text-2xl font-serif text-[#2E5984] mb-4">Contact Form</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-serif text-[#2E5984] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-effect p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-[#2E5984] mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
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