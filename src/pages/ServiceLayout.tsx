import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Send } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { styles } from "@/lib/styles";

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

  const handleContactSubmit = async (e: React.FormEvent) => {
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

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          service: title
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main id="service-content" className={styles.mainContent}>
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

        <section aria-labelledby="service-title" className={styles.glassEffect}>
          <h1 id="service-title" className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>

          <div className={styles.serviceGrid}>
            <Card className={styles.woodTexture}>
              <section aria-labelledby="quick-help-title">
                <h2 id="quick-help-title" className={styles.subtitle}>Quick Help</h2>
                <fieldset className={styles.formGroup}>
                  <legend className="sr-only">Common Issues</legend>
                  <ul className="space-y-2 list-none p-0">
                    {commonIssues.map((issue) => (
                      <li key={issue.id}>
                        <div className="flex items-center space-x-2">
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
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  aria-label="Contact support via WhatsApp"
                >
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  Contact via WhatsApp
                </Button>
              </section>
            </Card>

            <Card className={styles.woodTexture}>
              <section aria-labelledby="contact-form-title">
                <h2 id="contact-form-title" className={styles.subtitle}>Contact Form</h2>
                <form onSubmit={handleContactSubmit} className={styles.formGroup}>
                  <div role="group" aria-labelledby="personal-info">
                    <span id="personal-info" className="sr-only">Personal Information</span>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        required 
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      required 
                      aria-required="true"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                    Send Message
                  </Button>
                </form>
              </section>
            </Card>
          </div>

          <section aria-labelledby="faq-title" className={styles.faqContainer}>
            <h2 id="faq-title" className={styles.subtitle}>Frequently Asked Questions</h2>
            <ul className="space-y-6 list-none p-0">
              {faqs.map((faq, index) => (
                <li key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLayout;