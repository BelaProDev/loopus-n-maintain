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
  TestTube2
} from "lucide-react";

import OverviewTab from "./Documentation/OverviewTab";
import FeaturesTab from "./Documentation/FeaturesTab";
import AdminTab from "./Documentation/AdminTab";
import TechnicalTab from "./Documentation/TechnicalTab";
import TestResults from "./Documentation/TestResults";

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
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                <span className="hidden sm:inline">Technical</span>
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <TestTube2 className="h-4 w-4" />
                <span className="hidden sm:inline">Tests</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="features">
                <FeaturesTab />
              </TabsContent>

              <TabsContent value="admin">
                <AdminTab />
              </TabsContent>

              <TabsContent value="technical">
                <TechnicalTab />
              </TabsContent>

              <TabsContent value="tests">
                <TestResults />
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