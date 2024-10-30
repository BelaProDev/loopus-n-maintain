import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEmails } from "@/hooks/useEmails";
import { Plus, Mail, Settings, FileText, Building2, Folder } from "lucide-react";
import EmailTable from "./Koalax/EmailTable";
import EmailDialog from "./Koalax/EmailDialog";
import ContentEditor from "./Koalax/ContentEditor";
import SiteSettings from "./Koalax/SiteSettings";
import BusinessManagement from "./Koalax/components/BusinessManagement";
import DocumentManager from "./Koalax/components/DocumentManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseInit from "./Koalax/DatabaseInit";
import KoalaxAuth from "./Koalax/KoalaxAuth";

const Koalax = () => {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const {
    emails,
    createEmail,
    updateEmail,
    deleteEmail,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEmails();

  const handleEmailSubmit = (e: React.FormEvent) => {
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
      updateEmail({ id: editingEmail.ref.id, data: emailData });
    } else {
      if (!emailData.password) {
        toast({
          title: "Error",
          description: "Password is required for new email accounts",
          variant: "destructive",
        });
        return;
      }
      createEmail(emailData);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingEmail(null);
  };

  if (!isDbInitialized) {
    return <DatabaseInit onInitialized={() => setIsDbInitialized(true)} />;
  }

  if (!isAuthenticated) {
    return <KoalaxAuth onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto p-8 flex-1">
        <Tabs defaultValue="emails" className="space-y-4">
          <TabsList>
            <TabsTrigger value="emails">
              <Mail className="w-4 h-4 mr-2" />
              Email Management
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Site Settings
            </TabsTrigger>
            <TabsTrigger value="business">
              <Building2 className="w-4 h-4 mr-2" />
              Business
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Folder className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emails">
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
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Content Management</h1>
              <ContentEditor />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>

          <TabsContent value="business">
            <BusinessManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManager />
          </TabsContent>
        </Tabs>
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