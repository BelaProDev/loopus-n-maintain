import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Music4, AudioLines, Play, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Loop {
  id: string;
  url: string;
  name: string;
}

interface LooperProps {
  onStartRecording: () => void;
  onStopRecording: () => Promise<string>;
  isRecording: boolean;
}

const Looper = ({ onStartRecording, onStopRecording, isRecording }: LooperProps) => {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [playingLoops, setPlayingLoops] = useState<Set<string>>(new Set());

  const handleStopRecording = async () => {
    try {
      const audioUrl = await onStopRecording();
      const newLoop: Loop = {
        id: Date.now().toString(),
        url: audioUrl,
        name: `Loop ${loops.length + 1}`
      };
      setLoops([...loops, newLoop]);
      toast.success("Loop recorded successfully!");
    } catch (error) {
      toast.error("Failed to save recording");
    }
  };

  const toggleLoop = (loop: Loop) => {
    const audio = new Audio(loop.url);
    if (playingLoops.has(loop.id)) {
      setPlayingLoops(prev => {
        const next = new Set(prev);
        next.delete(loop.id);
        return next;
      });
    } else {
      audio.loop = true;
      audio.play();
      setPlayingLoops(prev => new Set([...prev, loop.id]));
    }
  };

  const deleteLoop = (loopId: string) => {
    setLoops(loops.filter(loop => loop.id !== loopId));
    setPlayingLoops(prev => {
      const next = new Set(prev);
      next.delete(loopId);
      return next;
    });
  };

  return (
    <div className="space-y-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Music4 className="h-5 w-5" />
        <h4 className="font-semibold">Loop Station</h4>
      </div>

      <div className="flex gap-2">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? handleStopRecording : onStartRecording}
          className="w-full"
        >
          <AudioLines className="h-4 w-4 mr-2" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loops.map((loop) => (
          <div key={loop.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{loop.name}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleLoop(loop)}
                >
                  {playingLoops.has(loop.id) ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteLoop(loop.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <audio controls src={loop.url} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Looper;