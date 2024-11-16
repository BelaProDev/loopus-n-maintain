import { Card } from "@/components/ui/card";
import { Music, Mic, Speaker } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { toast } from "sonner";
import Synthesizer from "@/components/audio/Synthesizer";
import AudioRecorder from "@/components/audio/AudioRecorder";

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Synthesizer />
            </div>
            <div className="space-y-6">
              <AudioRecorder />
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Speaker className="h-5 w-5" />
                      Sound Library
                    </h3>
                  </div>
                  <p className="text-center text-gray-600">
                    Browse and use pre-recorded sounds (Coming soon)
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Audio;