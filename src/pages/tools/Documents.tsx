import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FolderPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();

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
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/dropbox-explorer")}
              >
                <Upload className="h-8 w-8" />
                <span>Upload Documents</span>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/koalax/documents")}
              >
                <Download className="h-8 w-8" />
                <span>Access Documents</span>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/koalax/business")}
              >
                <FolderPlus className="h-8 w-8" />
                <span>Manage Files</span>
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