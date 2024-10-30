import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DocumentManager from "./Koalax/components/DocumentManager";
import BusinessManagement from "./Koalax/components/BusinessManagement";
import SiteSettings from "./Koalax/SiteSettings";
import EmailList from "./Koalax/EmailList";
import KoalaxAuth from "./Koalax/KoalaxAuth";
import { useSession } from "@/hooks/useSession";
import { useEmails } from "@/hooks/useEmails";

const Koalax = () => {
  const { sessionChecked, isAuthenticated } = useSession();
  const [activeTab, setActiveTab] = useState("documents");
  const { emails, updateEmail, deleteEmail, isDeleting } = useEmails();

  if (!isAuthenticated) {
    return <KoalaxAuth onAuthenticate={() => {}} />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-4xl font-bold">Koalax Admin</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card className="p-6">
            <DocumentManager />
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <BusinessManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SiteSettings />
        </TabsContent>

        <TabsContent value="emails">
          <Card className="p-6">
            <EmailList 
              emails={emails || []}
              onEdit={(email) => updateEmail(email)}
              onDelete={(id) => deleteEmail(id)}
              isDeleting={isDeleting}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Koalax;