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
import { Trash2, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const NavigationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation(["settings", "ui"]);
  const [previewLink, setPreviewLink] = useState<NavigationLink | null>(null);

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
    
    const url = formData.get("url") as string;
    if (!url.startsWith('/') && !url.startsWith('http')) {
      toast({
        title: t("ui:status.error"),
        description: "URL must start with '/' or 'http'",
        variant: "destructive",
      });
      return;
    }

    const newLink: NavigationLink = {
      label: formData.get("label") as string,
      url,
      location: formData.get("location") as "header" | "footer",
    };

    updateMutation.mutate(newLink);
    e.currentTarget.reset();
  };

  const handlePreview = (link: NavigationLink) => {
    setPreviewLink(link);
  };

  const handleDelete = (link: NavigationLink) => {
    // Implement delete functionality when backend supports it
    toast({
      title: t("ui:status.info"),
      description: "Delete functionality coming soon",
    });
  };

  if (isLoading) return <div>{t("ui:status.loading")}</div>;

  return (
    <div className="space-y-6">
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
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">{t("settings:navigation.url")}</Label>
              <Input
                id="url"
                name="url"
                placeholder={t("settings:navigation.url")}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("settings:navigation.location.title")}</Label>
              <Select name="location" defaultValue="header">
                <SelectTrigger className="w-full">
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
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("settings:navigation.title")}</h3>
        <div className="grid gap-4">
          {Array.isArray(links) && links.map((link, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{link.label}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {link.url}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(`settings:navigation.location.${link.location}`)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(link)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Link Preview</DialogTitle>
                      </DialogHeader>
                      <div className="p-4 space-y-2">
                        <p><strong>Label:</strong> {previewLink?.label}</p>
                        <p><strong>URL:</strong> {previewLink?.url}</p>
                        <p><strong>Location:</strong> {previewLink?.location}</p>
                        <div className="mt-4">
                          <a
                            href={previewLink?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Open in new tab
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(link)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSettings;