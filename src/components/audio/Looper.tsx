import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Music4, AudioLines } from "lucide-react";

interface LooperProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

const Looper = ({ onStartRecording, onStopRecording, isRecording }: LooperProps) => {
  const [loops, setLoops] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Music4 className="h-5 w-5" />
        <h4 className="font-semibold">Looper</h4>
      </div>

      <div className="flex gap-2">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? onStopRecording : onStartRecording}
        >
          <AudioLines className="h-4 w-4 mr-2" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {loops.map((loop, index) => (
          <div key={index} className="p-2 border rounded">
            <audio controls src={loop} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Looper;