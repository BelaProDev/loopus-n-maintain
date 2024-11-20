import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/fauna/settingsQueries";

const LogoSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation(["settings"]);
  const queryClient = useQueryClient();

  const logoMutation = useMutation({
    mutationFn: settingsQueries.updateLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-logo'] });
      toast({
        title: t("logo.uploadSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("logo.uploadError"),
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: t("logo.invalidType"),
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      logoMutation.mutate(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="logo">{t("logo.upload")}</Label>
      <Input
        id="logo"
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        disabled={logoMutation.isPending}
      />
      <p className="text-sm text-muted-foreground">
        {t("logo.sizeRecommendation")}
      </p>
    </div>
  );
};

export default LogoSettings;