import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsQueries } from "@/lib/fauna/settingsQueries";

const WhatsAppSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: numbers, isLoading } = useQuery({
    queryKey: ['whatsapp-numbers'],
    queryFn: settingsQueries.getWhatsAppNumbers
  });

  const updateMutation = useMutation({
    mutationFn: settingsQueries.updateWhatsAppNumbers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-numbers'] });
      toast({
        title: "Success",
        description: "WhatsApp numbers updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update WhatsApp numbers",
        variant: "destructive",
      });
    }
  });

  const handleWhatsAppUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newNumbers = {
      electrics: formData.get("electrics") as string,
      plumbing: formData.get("plumbing") as string,
      ironwork: formData.get("ironwork") as string,
      woodwork: formData.get("woodwork") as string,
      architecture: formData.get("architecture") as string,
    };
    updateMutation.mutate(newNumbers);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <form onSubmit={handleWhatsAppUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["electrics", "plumbing", "ironwork", "woodwork", "architecture"].map((service) => (
            <div key={service} className="space-y-2">
              <Label htmlFor={service} className="capitalize">
                {service} WhatsApp
              </Label>
              <Input
                id={service}
                name={service}
                type="tel"
                placeholder={`Enter ${service} WhatsApp number`}
                defaultValue={numbers?.[service as keyof typeof numbers]}
              />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={updateMutation.isPending}>
          Update WhatsApp Numbers
        </Button>
      </form>
    </Card>
  );
};

export default WhatsAppSettings;