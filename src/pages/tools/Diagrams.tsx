import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Network, Database, Computer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemArchitectureEditor from "./diagrams/SystemArchitectureEditor";

const tools = [
  {
    icon: Server,
    title: "System Architecture",
    description: "Design system architectures with drag-and-drop components",
  },
  {
    icon: Network,
    title: "Network Diagram",
    description: "Map out network infrastructure and connections",
  },
  {
    icon: Database,
    title: "Database Schema",
    description: "Create and visualize database relationships",
  },
  {
    icon: Computer,
    title: "Component Diagram",
    description: "Design software component interactions",
  },
];

const Diagrams = () => {
  const { t } = useTranslation(["tools"]);
  const [selectedTool, setSelectedTool] = useState("system-architecture");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gradient animate-fade-in">
              {t("diagrams.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("diagrams.description")}
            </p>
          </div>

          <Tabs value={selectedTool} onValueChange={setSelectedTool}>
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <TabsTrigger
                  key={tool.title.toLowerCase().replace(/\s+/g, "-")}
                  value={tool.title.toLowerCase().replace(/\s+/g, "-")}
                  className="w-full"
                >
                  <div className="flex flex-col items-center gap-2 p-4">
                    <tool.icon className="h-8 w-8" />
                    <span className="font-medium">{tool.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="system-architecture" className="mt-8">
              <Card className="p-6">
                <SystemArchitectureEditor />
              </Card>
            </TabsContent>

            {["network-diagram", "database-schema", "component-diagram"].map((tool) => (
              <TabsContent key={tool} value={tool} className="mt-8">
                <Card className="p-6">
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p className="text-gray-600">
                      This diagram type will be available in the next update.
                    </p>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diagrams;