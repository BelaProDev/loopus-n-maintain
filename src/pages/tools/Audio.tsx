import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load audio components to improve initial page load
const AudioStudio = () => {
  const { t } = useTranslation(["tools"]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("audio.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("audio.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Audio Studio</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Our audio studio is currently under maintenance. We're working to bring you an improved experience soon!
              </p>

              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AudioStudio;