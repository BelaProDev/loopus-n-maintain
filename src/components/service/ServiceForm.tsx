import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/hooks/useServices";

interface ServiceFormProps {
  title: string;
  commonIssues: { id: string; label: string }[];
}

export function ServiceForm({ title, commonIssues }: ServiceFormProps) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createService, isCreating } = useServices();

  const getWhatsAppNumber = (service: string) => {
    const envVar = `app_whatss_${service.toLowerCase()}`;
    return import.meta.env[envVar] || "";
  };

  const handleWhatsAppContact = () => {
    if (!isAuthenticated) {
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
      navigate("/login");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    createService({
      type: title.toLowerCase(),
      description: formData.get('message') as string,
      status: 'pending',
      contact: {
        name: formData.get('name'),
        email: formData.get('email'),
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <section aria-labelledby="quick-help-title">
          <h2 id="quick-help-title" className="text-xl font-semibold mb-4">Quick Help</h2>
          <fieldset className="space-y-4">
            <legend className="sr-only">Common Issues</legend>
            <ul className="space-y-2">
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
          >
            <Phone className="mr-2 h-4 w-4" />
            Contact via WhatsApp
          </Button>
        </section>
      </Card>

      <Card className="p-6">
        <section aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="text-xl font-semibold mb-4">Contact Form</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required />
            </div>
            <Button type="submit" disabled={isCreating} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {isCreating ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </section>
      </Card>
    </div>
  );
}