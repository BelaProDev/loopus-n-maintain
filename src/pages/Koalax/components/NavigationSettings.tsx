import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/fauna/settingsQueries";
import { useTranslation } from "react-i18next";
import { NavigationLink } from "@/lib/fauna/types";

const NavigationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation(["settings", "ui"]);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['navigation-links'],
    queryFn: settingsQueries.getNavigationLinks
  });

  const updateMutation = useMutation({
    mutationFn: settingsQueries.updateNavigationLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-links'] });
      toast({
        title: t("ui:status.success"),
        description: t("settings:navigation.updateSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("ui:status.error"),
        description: t("settings:navigation.updateError"),
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLink: NavigationLink = {
      label: formData.get("label") as string,
      url: formData.get("url") as string,
      location: formData.get("location") as "header" | "footer",
    };
    updateMutation.mutate(newLink);
  };

  if (isLoading) return <div>{t("ui:status.loading")}</div>;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="label">{t("settings:navigation.label")}</Label>
            <Input
              id="label"
              name="label"
              placeholder={t("settings:navigation.label")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">{t("settings:navigation.url")}</Label>
            <Input
              id="url"
              name="url"
              placeholder={t("settings:navigation.url")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t("settings:navigation.location.title")}</Label>
            <Select name="location" defaultValue="header">
              <SelectTrigger>
                <SelectValue placeholder={t("settings:navigation.location.title")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">{t("settings:navigation.location.header")}</SelectItem>
                <SelectItem value="footer">{t("settings:navigation.location.footer")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={updateMutation.isPending}>
          {t("settings:navigation.add")}
        </Button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">{t("settings:navigation.title")}</h3>
        <div className="space-y-2">
          {Array.isArray(links) && links.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{link.label}</span>
                <span className="text-gray-500 ml-2">({link.url})</span>
              </div>
              <span className="text-sm text-gray-500">{link.location}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NavigationSettings;