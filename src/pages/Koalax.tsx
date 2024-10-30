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
import { ScrollArea } from "@/components/ui/scroll-area";

const KOALAX_PASSWORD = "miaou00";

const Koalax = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const bypAuthenticated = true;
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

  if (!bypAuthenticated) {
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
      <div className="container mx-auto p-4 md:p-8 flex-1">
        <Tabs defaultValue="emails" className="space-y-4">
          <ScrollArea className="w-full">
            <TabsList className="w-full flex flex-nowrap overflow-x-auto justify-start md:justify-center p-1 mb-2">
              <TabsTrigger value="emails" className="whitespace-nowrap">
                <Mail className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Email Management</span>
                <span className="sm:hidden">Emails</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="whitespace-nowrap">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Content Management</span>
                <span className="sm:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="whitespace-nowrap">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Site Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="whitespace-nowrap">
                <Building2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Business</span>
                <span className="sm:hidden">Business</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="whitespace-nowrap">
                <Folder className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Documents</span>
                <span className="sm:hidden">Docs</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="emails">
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
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>
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