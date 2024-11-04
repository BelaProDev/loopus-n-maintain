import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book, 
  Sparkles, 
  Settings, 
  Code2 
} from "lucide-react";

const Documentation = () => {
  const { t } = useTranslation(["docs"]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-4 md:p-8">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
            <Book className="h-8 w-8" />
            {t("docs:title")}
          </h1>
          
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Technical
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">{t("docs:overview.title")}</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t("docs:overview.description")}
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <h2 className="text-2xl font-semibold">{t("docs:features.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Core Features</h3>
                    <ul className="space-y-3 text-gray-700">
                      {["auth", "email", "content", "business", "documents", "languages"].map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{t(`docs:features.${feature}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Services</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-2">⚡ Electrical Maintenance</li>
                      <li className="flex items-center gap-2">🔧 Plumbing Services</li>
                      <li className="flex items-center gap-2">⚒️ Ironwork Solutions</li>
                      <li className="flex items-center gap-2">🪚 Woodworking</li>
                      <li className="flex items-center gap-2">🏗️ Architectural Consulting</li>
                    </ul>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <h2 className="text-2xl font-semibold">{t("docs:admin.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{t("docs:admin.content.title")}</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        {t("docs:admin.content.edit")}
                      </li>
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        {t("docs:admin.content.offline")}
                      </li>
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{t("docs:admin.business.title")}</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        {t("docs:admin.business.clients")}
                      </li>
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        {t("docs:admin.business.providers")}
                      </li>
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        {t("docs:admin.business.documents")}
                      </li>
                    </ul>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                <h2 className="text-2xl font-semibold">Technical Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">PWA Features</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Offline Functionality
                      </li>
                      <li className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Push Notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Responsive Design
                      </li>
                      <li className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Document Caching
                      </li>
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{t("docs:setup.title")}</h3>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <pre className="overflow-x-auto text-sm">
{`# ${t("docs:setup.env")}
VITE_FAUNA_SECRET_KEY=
VITE_DROPBOX_ACCESS_TOKEN=`}
                      </pre>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;