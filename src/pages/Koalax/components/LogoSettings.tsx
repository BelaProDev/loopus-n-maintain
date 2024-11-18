import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const LogoSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["settings"]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      // TODO: Implement API endpoint
      toast({
        title: t("logo.uploadSuccess"),
      });
    } catch (error) {
      toast({
        title: t("logo.uploadError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="logo">{t("logo.upload")}</Label>
      <Input
        id="logo"
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
      />
      <p className="text-sm text-muted-foreground">
        {t("logo.sizeRecommendation")}
      </p>
    </div>
  );
};

export default LogoSettings;