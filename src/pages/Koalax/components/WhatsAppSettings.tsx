import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { settingsQueries } from "@/lib/fauna/settingsQueries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WhatsAppNumbers } from "@/lib/fauna/types";

const SERVICES = ["electrics", "plumbing", "ironwork", "woodwork", "architecture"] as const;
type ServiceType = typeof SERVICES[number];

const WhatsAppSettings = () => {
  const { t } = useTranslation(["settings"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<WhatsAppNumbers>();

  const { data: numbers } = useQuery({
    queryKey: ['whatsapp-numbers'],
    queryFn: settingsQueries.getWhatsAppNumbers
  });

  useEffect(() => {
    if (numbers) {
      reset(numbers);
    }
  }, [numbers, reset]);

  const updateMutation = useMutation({
    mutationFn: settingsQueries.updateWhatsAppNumbers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-numbers'] });
      toast({
        title: t("whatsapp.updateSuccess"),
      });
    },
    onError: () => {
      toast({
        title: t("whatsapp.updateError"),
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: WhatsAppNumbers) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <div key={service} className="space-y-2">
            <Label htmlFor={service}>
              {t(`services:${service}.title`)} WhatsApp
            </Label>
            <Input
              id={service}
              {...register(service)}
              placeholder={t("whatsapp.placeholder", { service: t(`services:${service}.title`) })}
            />
          </div>
        ))}
      </div>
      <Button type="submit" disabled={updateMutation.isPending}>
        {t("whatsapp.update")}
      </Button>
    </form>
  );
};

export default WhatsAppSettings;