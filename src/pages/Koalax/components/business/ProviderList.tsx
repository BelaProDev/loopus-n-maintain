import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Provider } from "@/types/business";
import ProviderDialog from "./ProviderDialog";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ProviderList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: businessQueries.getProviders
  });

  const createMutation = useMutation({
    mutationFn: businessQueries.createProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast({ title: t("common.success"), description: t("admin.providers.addSuccess") });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        title: t("common.error"), 
        description: t("admin.providers.addError"), 
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const providerData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as Provider["service"],
      availability: true,
    };

    createMutation.mutate(providerData);
  };

  if (isLoading) return <div>{t("common.loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("admin.providers.title")}</h2>
        <Button onClick={() => {
          setEditingProvider(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          {t("admin.providers.add")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.providers.name")}</TableHead>
            <TableHead>{t("admin.providers.service")}</TableHead>
            <TableHead>{t("admin.providers.rating")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers?.map((provider: Provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.name}</TableCell>
              <TableCell className="capitalize">{provider.service}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {provider.rating || t("common.na")}
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  provider.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {provider.availability ? t("admin.providers.available") : t("admin.providers.unavailable")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingProvider(provider);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement delete functionality
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProviderDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProvider={editingProvider}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default ProviderList;