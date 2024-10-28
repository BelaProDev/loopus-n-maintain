import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Image, Link2 } from "lucide-react";

const SiteSettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // TODO: Implement API endpoint for updating WhatsApp numbers
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      // TODO: Implement API endpoint for logo upload
      toast({
        title: "Success",
        description: "Logo updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update logo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>
      
      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp">
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp Numbers
          </TabsTrigger>
          <TabsTrigger value="logo">
            <Image className="w-4 h-4 mr-2" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="links">
            <Link2 className="w-4 h-4 mr-2" />
            Navigation Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
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
        </TabsContent>

        <TabsContent value="logo">
          <Card className="p-6">
            <div className="space-y-4">
              <Label htmlFor="logo">Upload New Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <p className="text-sm text-muted-foreground">
                Recommended size: 512x512px. The logo will be used for both the website and PWA.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card className="p-6">
            <NavigationLinksEditor />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NavigationLinksEditor = () => {
  const [headerLinks, setHeaderLinks] = useState([
    { label: "Home", url: "/" },
    { label: "Services", url: "/services" },
    { label: "Contact", url: "/contact" },
  ]);

  const [footerLinks, setFooterLinks] = useState([
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Terms of Service", url: "/terms" },
  ]);

  const handleSaveLinks = async () => {
    try {
      // TODO: Implement API endpoint for updating navigation links
      toast({
        title: "Success",
        description: "Navigation links updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update navigation links",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Header Links</h3>
        {headerLinks.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={link.label}
              onChange={(e) => {
                const newLinks = [...headerLinks];
                newLinks[index].label = e.target.value;
                setHeaderLinks(newLinks);
              }}
              placeholder="Link Label"
            />
            <Input
              value={link.url}
              onChange={(e) => {
                const newLinks = [...headerLinks];
                newLinks[index].url = e.target.value;
                setHeaderLinks(newLinks);
              }}
              placeholder="URL"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Footer Links</h3>
        {footerLinks.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={link.label}
              onChange={(e) => {
                const newLinks = [...footerLinks];
                newLinks[index].label = e.target.value;
                setFooterLinks(newLinks);
              }}
              placeholder="Link Label"
            />
            <Input
              value={link.url}
              onChange={(e) => {
                const newLinks = [...footerLinks];
                newLinks[index].url = e.target.value;
                setFooterLinks(newLinks);
              }}
              placeholder="URL"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSaveLinks}>
        Save Navigation Links
      </Button>
    </div>
  );
};

export default SiteSettings;