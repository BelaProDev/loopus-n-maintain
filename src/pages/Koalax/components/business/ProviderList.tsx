import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Provider } from "@/types/business";
import ProviderDialog from "./ProviderDialog";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ProviderList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation(["admin", "common"]);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: businessQueries.getProviders
  });

  if (isLoading) return <div className="text-gray-700">{t("common:common.loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setEditingProvider(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:business.providers.add")}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900">{t("admin:business.providers.name")}</TableHead>
              <TableHead className="text-gray-900">{t("admin:business.providers.service")}</TableHead>
              <TableHead className="text-gray-900">{t("admin:business.providers.status")}</TableHead>
              <TableHead className="text-right text-gray-900">{t("common:common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider: Provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium text-gray-900">{provider.name}</TableCell>
                <TableCell className="capitalize text-gray-700">{t(`services:${provider.service}.title`)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    provider.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.availability ? t("admin:business.providers.available") : t("admin:business.providers.unavailable")}
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
                      toast({
                        title: t("common:common.success"),
                        description: t("admin:business.providers.deleteSuccess")
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProviderDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProvider={editingProvider}
        onSubmit={() => {
          setIsDialogOpen(false);
        }}
        isLoading={false}
      />
    </div>
  );
};

export default ProviderList;