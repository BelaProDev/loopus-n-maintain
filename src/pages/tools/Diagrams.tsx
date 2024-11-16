import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, GitFork, GitMerge } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Diagrams = () => {
  const { t } = useTranslation(["tools"]);

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
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
              >
                <GitBranch className="h-8 w-8" />
                <span>Flow Diagrams</span>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
              >
                <GitFork className="h-8 w-8" />
                <span>System Architecture</span>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
              >
                <GitMerge className="h-8 w-8" />
                <span>Process Flows</span>
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diagrams;