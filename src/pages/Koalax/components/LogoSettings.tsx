import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const LogoSettings = () => {
  const { toast } = useToast();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      // TODO: Implement API endpoint
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
  );
};

export default LogoSettings;