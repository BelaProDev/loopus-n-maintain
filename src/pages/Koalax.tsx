import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEmails } from "@/hooks/useEmails";
import { Plus } from "lucide-react";
import EmailTable from "./Koalax/EmailTable";
import EmailDialog from "./Koalax/EmailDialog";

const KOALAX_PASSWORD = "miaou00";

const Koalax = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const {
    emails,
    isLoading,
    createEmail,
    updateEmail,
    deleteEmail,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEmails();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === KOALAX_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const emailData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
    };

    if (editingEmail) {
      updateEmail({ id: editingEmail.ref.id, data: emailData });
    } else {
      createEmail(emailData);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingEmail(null);
  };

  if (!isAuthenticated || 1 === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-64"
          />
          <Button type="submit" className="w-full">
            Access Koalax
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto p-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Email Management</h1>
          <Button onClick={() => {
            setEditingEmail(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Email
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
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
      </div>
      <EmailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEmail={editingEmail}
        onSubmit={handleEmailSubmit}
        isLoading={isCreating || isUpdating}
      />
      <Footer />
    </div>
  );
};

export default Koalax;