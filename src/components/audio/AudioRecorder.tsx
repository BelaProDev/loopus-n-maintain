import { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Play, Square, Save } from "lucide-react";
import { toast } from "sonner";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
      
      toast.success("Recording Started");
    } catch (err) {
      toast.error("Could not access microphone");
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
      toast.success("Recording saved successfully");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Audio Recorder
          </h3>
        </div>
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
          <div className="mt-4">
            <audio controls className="w-full">
              <source src={audioURL} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AudioRecorder;