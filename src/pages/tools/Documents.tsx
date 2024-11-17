import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSearch, Image } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Documents = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();
  const { toast } = useToast();

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => navigate("/dropbox-explorer")}
              >
                <FileSearch className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Dropbox Lens</span>
                <p className="text-sm text-muted-foreground">
                  Advanced document search and management
                </p>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Button 
                variant="outline" 
                className="w-full h-32 flex flex-col items-center justify-center gap-2 group"
                onClick={() => navigate("/photo-gallery")}
              >
                <Image className="h-8 w-8 group-hover:text-primary transition-colors" />
                <span>Photo/Video Gallery</span>
                <p className="text-sm text-muted-foreground">
                  Manage and view your media files
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