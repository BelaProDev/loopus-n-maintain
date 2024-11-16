import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FolderPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDropboxManager } from "@/hooks/useDropboxManager";
import { useToast } from "@/components/ui/use-toast";

const Documents = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();
  const { isAuthenticated } = useDropboxManager("/");
  const { toast } = useToast();

  const handleNavigate = (path: string) => {
    if (!isAuthenticated && path.includes('dropbox')) {
      toast({
        title: "Authentication Required",
        description: "Please connect to Dropbox first",
        variant: "destructive"
      });
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("documents.title")}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("documents.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => handleNavigate("/dropbox-explorer")}
              >
                <Upload className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Upload Documents</span>
                <p className="text-sm text-muted-foreground">
                  Securely store and manage your files
                </p>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => handleNavigate("/dropbox-explorer")}
              >
                <Download className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Access Documents</span>
                <p className="text-sm text-muted-foreground">
                  View and download your stored files
                </p>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => handleNavigate("/dropbox-explorer")}
              >
                <FolderPlus className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Manage Files</span>
                <p className="text-sm text-muted-foreground">
                  Organize and categorize your documents
                </p>
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documents;