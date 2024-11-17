import { Card } from "@/components/ui/card";
import { Server, Network, Database, Computer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemArchitectureEditor from "./diagrams/SystemArchitectureEditor";
import NetworkDiagramEditor from "./diagrams/NetworkDiagramEditor";
import DatabaseSchemaEditor from "./diagrams/DatabaseSchemaEditor";
import ComponentDiagramEditor from "./diagrams/ComponentDiagramEditor";

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

          <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-6">
            <TabsList className="w-full h-auto p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent">
              {tools.map((tool) => (
                <TabsTrigger
                  key={tool.title.toLowerCase().replace(/\s+/g, "-")}
                  value={tool.title.toLowerCase().replace(/\s+/g, "-")}
                  className="w-full p-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex flex-col items-center gap-3">
                    <tool.icon className="h-10 w-10" />
                    <span className="font-medium text-lg">{tool.title}</span>
                    <p className="text-sm text-muted-foreground hidden lg:block">
                      {tool.description}
                    </p>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="system-architecture">
              <Card className="p-0 overflow-hidden">
                <SystemArchitectureEditor />
              </Card>
            </TabsContent>

            <TabsContent value="network-diagram">
              <Card className="p-0 overflow-hidden">
                <NetworkDiagramEditor />
              </Card>
            </TabsContent>

            <TabsContent value="database-schema">
              <Card className="p-0 overflow-hidden">
                <DatabaseSchemaEditor />
              </Card>
            </TabsContent>

            <TabsContent value="component-diagram">
              <Card className="p-0 overflow-hidden">
                <ComponentDiagramEditor />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diagrams;