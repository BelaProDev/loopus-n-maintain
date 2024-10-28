import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const WhatsAppSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWhatsAppUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const numbers = {
      electrics: formData.get("electrics"),
      plumbing: formData.get("plumbing"),
      ironwork: formData.get("ironwork"),
      woodwork: formData.get("woodwork"),
      architecture: formData.get("architecture"),
    };

    try {
      // TODO: Implement API endpoint
      toast({
        title: "Success",
        description: "WhatsApp numbers updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update WhatsApp numbers",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleWhatsAppUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["electrics", "plumbing", "ironwork", "woodwork", "architecture"].map((service) => (
            <div key={service} className="space-y-2">
              <Label htmlFor={service} className="capitalize">
                {service} WhatsApp
              </Label>
              <Input
                id={service}
                name={service}
                type="tel"
                placeholder={`Enter ${service} WhatsApp number`}
                defaultValue={import.meta.env[`VITE_WHATSAPP_${service.toUpperCase()}`]}
              />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Update WhatsApp Numbers
        </Button>
      </form>
    </Card>
  );
};

export default WhatsAppSettings;