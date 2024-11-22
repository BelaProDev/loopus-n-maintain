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
  Code2,
  Server,
  Layout,
  Database,
  Globe
} from "lucide-react";

import OverviewTab from "./Documentation/OverviewTab";
import FeaturesTab from "./Documentation/FeaturesTab";
import AdminTab from "./Documentation/AdminTab";
import TechnicalTab from "./Documentation/TechnicalTab";

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
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span className="hidden sm:inline">Architecture</span>
              </TabsTrigger>
              <TabsTrigger value="frontend" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span className="hidden sm:inline">Frontend</span>
              </TabsTrigger>
              <TabsTrigger value="backend" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Backend</span>
              </TabsTrigger>
              <TabsTrigger value="i18n" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">i18n</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                <span className="hidden sm:inline">Technical</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="features">
                <FeaturesTab />
              </TabsContent>

              <TabsContent value="architecture">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Platform Architecture</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Server-Side Rendering with Remix</li>
                    <li>Progressive Web App capabilities</li>
                    <li>Redux for state management</li>
                    <li>Real-time updates and synchronization</li>
                    <li>Mobile-first responsive design</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="frontend">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Frontend Stack</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>React 18 with TypeScript</li>
                    <li>Redux & Redux Toolkit for state management</li>
                    <li>TanStack Query for data fetching</li>
                    <li>Tailwind CSS & shadcn/ui for styling</li>
                    <li>Framer Motion for animations</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="backend">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Backend Services</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Netlify Functions for serverless operations</li>
                    <li>FaunaDB for data persistence</li>
                    <li>Dropbox API integration</li>
                    <li>Email service integration</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="i18n">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Internationalization</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Multi-language support (EN, ES, FR)</li>
                    <li>i18next integration</li>
                    <li>Language detection</li>
                    <li>Translation management</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <AdminTab />
              </TabsContent>

              <TabsContent value="technical">
                <TechnicalTab />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;