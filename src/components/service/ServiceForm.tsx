import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import ValidatedInput from "@/components/form/ValidatedInput";
import { validateFormInput } from "@/lib/formValidation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Issue {
  id: string;
  label: string;
}

interface ServiceFormProps {
  title?: string;
  service: string;
  isAuthenticated?: boolean;
  commonIssues: Issue[];
}

const ServiceForm = ({ title, service, isAuthenticated, commonIssues }: ServiceFormProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateFormInput(formData.name, formData.email, formData.message);
    
    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => {
        toast({
          title: "Validation Error",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          service,
          selectedIssues
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast({
        title: "Success",
        description: "Message sent successfully. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
      setSelectedIssues([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 border border-[#2e5984] border-solid">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ValidatedInput
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          maxLength={50}
          className="border border-[#2e5984] border-solid p-0.5"
        />
        <ValidatedInput
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="border border-[#2e5984] border-solid p-0.5"
        />
        <div className="space-y-2">
          <Label>Common Issues</Label>
          <div className="grid gap-2">
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
          </div>
        </div>
        <ValidatedInput
          id="message"
          name="message"
          label="Message"
          value={formData.message}
          onChange={handleInputChange}
          required
          maxLength={500}
          isTextarea
          className="border border-[#2e5984] border-solid p-0.5"
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
};

export default ServiceForm;