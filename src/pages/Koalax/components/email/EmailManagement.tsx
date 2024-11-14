import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailQueries } from "@/lib/fauna/emailQueries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import EmailDialog from "../../EmailDialog";
import EmailTable from "../../EmailTable";
import type { Email } from "@/hooks/useEmails";
import type { EmailData } from "@/lib/fauna/types";

const EmailManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<Email | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation(["admin"]);

  const { data: emails, isLoading: isLoadingEmails } = useQuery({
    queryKey: ['emails'],
    queryFn: emailQueries.getAllEmails
  });

  const createEmailMutation = useMutation({
    mutationFn: (data: EmailData) => emailQueries.createEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ description: t("admin:email.addSuccess") });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        description: t("admin:email.addError"),
        variant: "destructive" 
      });
    }
  });

  const updateEmailMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailData> }) => 
      emailQueries.updateEmail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ description: t("admin:email.updateSuccess") });
      setIsDialogOpen(false);
      setEditingEmail(null);
    },
    onError: () => {
      toast({ 
        description: t("admin:email.updateError"),
        variant: "destructive" 
      });
    }
  });

  const deleteEmailMutation = useMutation({
    mutationFn: (id: string) => emailQueries.deleteEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({ description: t("admin:email.deleteSuccess") });
    },
    onError: () => {
      toast({ 
        description: t("admin:email.deleteError"),
        variant: "destructive" 
      });
    }
  });

  const handleAdd = () => {
    setEditingEmail(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (email: Email) => {
    setEditingEmail(email);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteEmailMutation.mutateAsync(id);
  };

  const handleSave = async (data: EmailData) => {
    if (editingEmail) {
      await updateEmailMutation.mutateAsync({ 
        id: editingEmail.ref.id, 
        data 
      });
    } else {
      await createEmailMutation.mutateAsync(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("admin:email.title")}</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {t("admin:email.add")}
        </Button>
      </div>

      <EmailTable
        emails={emails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EmailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEmail={editingEmail}
        onSubmit={handleSave}
        isLoading={createEmailMutation.isPending || updateEmailMutation.isPending}
      />
    </div>
  );
};

export default EmailManagement;