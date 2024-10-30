import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEmails } from "@/hooks/useEmails";
import EmailTable from "../../EmailTable";
import EmailDialog from "../../EmailDialog";

const EmailManagement = () => {
  const [editingEmail, setEditingEmail] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    emails,
    createEmail,
    updateEmail,
    deleteEmail,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEmails();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const emailData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      password: formData.get("password") as string || undefined,
    };

    if (editingEmail) {
      if (!emailData.password) {
        delete emailData.password;
      }
      await updateEmail({ id: editingEmail.ref.id, data: emailData });
    } else {
      if (!emailData.password) {
        return;
      }
      await createEmail(emailData);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingEmail(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Email Management</h1>
        <Button onClick={() => {
          setEditingEmail(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Email
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <EmailTable
          emails={emails}
          onEdit={(email) => {
            setEditingEmail(email);
            setIsDialogOpen(true);
          }}
          onDelete={deleteEmail}
          isDeleting={isDeleting}
        />
      </div>

      <EmailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEmail={editingEmail}
        onSubmit={handleEmailSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default EmailManagement;