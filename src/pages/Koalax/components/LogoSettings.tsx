import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const LogoSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["common", "admin"]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      // TODO: Implement API endpoint
      toast({
        title: t("common:common.success"),
        description: t("admin:logo.uploadSuccess"),
      });
    } catch (error) {
      toast({
        title: t("common:common.error"),
        description: t("admin:logo.uploadError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Label htmlFor="logo">{t("admin:logo.upload")}</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
        />
        <p className="text-sm text-muted-foreground">
          {t("admin:logo.sizeRecommendation")}
        </p>
      </div>
    </Card>
  );
};

export default LogoSettings;