import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Mic, Speaker, Play, Square, Save } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

const Audio = () => {
  const { t } = useTranslation(["tools"]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Your audio is now being recorded"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const saveRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
      
      toast({
        title: "Success",
        description: "Recording saved successfully"
      });
    }
  };

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
                <h3 className="text-xl font-semibold text-center">Audio Recorder</h3>
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button
                      variant="outline"
                      onClick={startRecording}
                      className="w-12 h-12 rounded-full"
                    >
                      <Play className="h-6 w-6 text-green-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={stopRecording}
                      className="w-12 h-12 rounded-full"
                    >
                      <Square className="h-6 w-6 text-red-500" />
                    </Button>
                  )}
                  {audioURL && (
                    <Button
                      variant="outline"
                      onClick={saveRecording}
                      className="w-12 h-12 rounded-full"
                    >
                      <Save className="h-6 w-6 text-blue-500" />
                    </Button>
                  )}
                </div>
                {audioURL && (
                  <audio controls className="w-full mt-4">
                    <source src={audioURL} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <Mic className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Voice Effects</h3>
                <p className="text-center text-gray-600">Coming soon</p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <Speaker className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-center">Sound Library</h3>
                <p className="text-center text-gray-600">Coming soon</p>
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