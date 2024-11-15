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
  const { t } = useTranslation(["common", "admin"]);

  const { data: links, isLoading } = useQuery({
    queryKey: ['navigation-links'],
    queryFn: settingsQueries.getNavigationLinks
  });

  const updateMutation = useMutation({
    mutationFn: settingsQueries.updateNavigationLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-links'] });
      toast({
        title: t("common:common.success"),
        description: t("admin:navigationUpdateSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("common:common.error"),
        description: t("admin:navigationUpdateError"),
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

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="label">{t("admin:navigationLabel")}</Label>
            <Input
              id="label"
              name="label"
              placeholder={t("admin:navigationLabelPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">{t("admin:navigationUrl")}</Label>
            <Input
              id="url"
              name="url"
              placeholder={t("admin:navigationUrlPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t("admin:navigationLocation")}</Label>
            <Select name="location" defaultValue="header">
              <SelectTrigger>
                <SelectValue placeholder={t("admin:navigationLocationPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">{t("admin:navigationLocationHeader")}</SelectItem>
                <SelectItem value="footer">{t("admin:navigationLocationFooter")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={updateMutation.isPending}>
          {t("admin:navigationAdd")}
        </Button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">{t("admin:navigationCurrentLinks")}</h3>
        <div className="space-y-2">
          {links?.map((link, index) => (
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