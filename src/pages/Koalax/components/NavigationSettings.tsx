import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavigationLink } from "@/lib/fauna/types";
import { settingsQueries } from "@/lib/fauna/settingsQueries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const NavigationSettings = () => {
  const { t } = useTranslation(["admin"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newLink, setNewLink] = useState<Omit<NavigationLink, 'id'>>({
    label: "",
    url: "",
    location: "header"
  });

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['navigation-links'],
    queryFn: settingsQueries.getNavigationLinks
  });

  const createMutation = useMutation({
    mutationFn: settingsQueries.createNavigationLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-links'] });
      toast({
        title: t("common:common.success"),
        description: t("navigation.createSuccess")
      });
      setNewLink({ label: "", url: "", location: "header" });
    },
    onError: () => {
      toast({
        title: t("common:common.error"),
        description: t("navigation.createError"),
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, link }: { id: string; link: Omit<NavigationLink, 'id'> }) => 
      settingsQueries.updateNavigationLink(id, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-links'] });
      toast({
        title: t("common:common.success"),
        description: t("navigation.updateSuccess")
      });
    },
    onError: () => {
      toast({
        title: t("common:common.error"),
        description: t("navigation.updateError"),
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: settingsQueries.deleteNavigationLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-links'] });
      toast({
        title: t("common:common.success"),
        description: t("navigation.deleteSuccess")
      });
    },
    onError: () => {
      toast({
        title: t("common:common.error"),
        description: t("navigation.deleteError"),
        variant: "destructive"
      });
    }
  });

  const handleAddLink = () => {
    if (!newLink.label || !newLink.url) {
      toast({
        title: t("common:common.error"),
        description: t("common:common.required"),
        variant: "destructive"
      });
      return;
    }
    createMutation.mutate(newLink);
  };

  if (isLoading) return <div>{t("common:common.loading")}</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("navigation.current")}</h3>
        {links.map((link) => (
          <div key={link.id} className="flex gap-2 items-center">
            <Input
              value={link.label}
              onChange={(e) => {
                updateMutation.mutate({
                  id: link.id!,
                  link: { ...link, label: e.target.value }
                });
              }}
              placeholder={t("navigation.labelPlaceholder")}
            />
            <Input
              value={link.url}
              onChange={(e) => {
                updateMutation.mutate({
                  id: link.id!,
                  link: { ...link, url: e.target.value }
                });
              }}
              placeholder={t("navigation.urlPlaceholder")}
            />
            <Select
              value={link.location}
              onValueChange={(value: 'header' | 'footer') => {
                updateMutation.mutate({
                  id: link.id!,
                  link: { ...link, location: value }
                });
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">{t("navigation.header")}</SelectItem>
                <SelectItem value="footer">{t("navigation.footer")}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => link.id && deleteMutation.mutate(link.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("navigation.addNew")}</h3>
        <div className="flex gap-2 items-center">
          <Input
            value={newLink.label}
            onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
            placeholder={t("navigation.labelPlaceholder")}
          />
          <Input
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder={t("navigation.urlPlaceholder")}
          />
          <Select
            value={newLink.location}
            onValueChange={(value: 'header' | 'footer') => 
              setNewLink({ ...newLink, location: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">{t("navigation.header")}</SelectItem>
              <SelectItem value="footer">{t("navigation.footer")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddLink}>
            {t("navigation.add")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationSettings;