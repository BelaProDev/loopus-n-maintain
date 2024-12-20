import { useState } from "react";
import { useEmails, Email } from "@/hooks/useEmails";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import EmailDialog from "../../EmailDialog";
import EmailTable from "../../EmailTable";
import { Loader2 } from "lucide-react";

const EmailManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<Email | null>(null);
  const { t } = useTranslation(["admin", "common"]);
  
  const {
    emails,
    isLoading,
    createEmail,
    updateEmail,
    deleteEmail,
    isCreating,
    isUpdating,
    isDeleting
  } = useEmails();

  const handleAdd = () => {
    setEditingEmail(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (email: Email) => {
    setEditingEmail(email);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteEmail(id);
  };

  const handleSubmit = async (formData: FormData) => {
    const emailData = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      password: formData.get('password') as string
    };

    if (editingEmail) {
      await updateEmail({ id: editingEmail.ref.id, data: emailData });
    } else {
      await createEmail(emailData);
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-[#1A1F2C] p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#9b87f5]">{t("admin:email.title")}</h2>
        <Button 
          onClick={handleAdd}
          className="bg-[#7E69AB] hover:bg-[#6E59A5] text-white"
        >
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
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default EmailManagement;