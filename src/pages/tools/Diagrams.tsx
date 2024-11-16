import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, GitFork, GitMerge } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const Diagrams = () => {
  const { t } = useTranslation(["tools"]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const { toast } = useToast();

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    toast({
      title: "Coming Soon",
      description: `The ${tool} tool will be available in the next update`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("diagrams.title")}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("diagrams.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => handleToolSelect("Flow Diagrams")}
              >
                <GitBranch className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Flow Diagrams</span>
                <p className="text-sm text-muted-foreground">
                  Create detailed process flows
                </p>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => handleToolSelect("System Architecture")}
              >
                <GitFork className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>System Architecture</span>
                <p className="text-sm text-muted-foreground">
                  Design system architectures
                </p>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => handleToolSelect("Process Flows")}
              >
                <GitMerge className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Process Flows</span>
                <p className="text-sm text-muted-foreground">
                  Map out business processes
                </p>
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
          </DialogHeader>
          <p>The {selectedTool} tool will be available in the next update.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Diagrams;