import { Card } from "@/components/ui/card";
import { Music, Mic, Speaker } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Audio = () => {
  const { t } = useTranslation(["tools"]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t("audio.title")}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("audio.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <Music className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Audio Editor</h3>
                <p className="text-gray-600 text-center">Edit and enhance audio files</p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <Mic className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Voice Recorder</h3>
                <p className="text-gray-600 text-center">Record high-quality audio</p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <Speaker className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Sound Library</h3>
                <p className="text-gray-600 text-center">Access sound effects and music</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Audio;