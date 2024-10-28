import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const NavigationSettings = () => {
  const { toast } = useToast();
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
      // TODO: Implement API endpoint
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

export default NavigationSettings;