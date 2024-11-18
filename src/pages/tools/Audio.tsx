import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SynthesizerCore from "@/components/audio/synth/SynthesizerCore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DrumSequencer from "@/components/audio/DrumSequencer";
import { useState } from "react";
import BackToHome from "@/components/BackToHome";

const AudioStudio = () => {
  const { t } = useTranslation(["tools"]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BackToHome />
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{t("audio.title")}</h1>
              <p className="text-lg text-muted-foreground">
                {t("audio.description")}
              </p>
            </div>
            <Music className="h-8 w-8 text-primary" />
          </div>

          <Tabs defaultValue="synth" className="space-y-4">
            <TabsList>
              <TabsTrigger value="synth">Synthesizer</TabsTrigger>
              <TabsTrigger value="drums">Drum Machine</TabsTrigger>
            </TabsList>

            <TabsContent value="synth">
              <SynthesizerCore />
            </TabsContent>

            <TabsContent value="drums">
              <DrumSequencer bpm={bpm} isPlaying={isPlaying} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AudioStudio;