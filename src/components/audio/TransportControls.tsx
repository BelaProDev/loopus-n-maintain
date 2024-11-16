import { Button } from "@/components/ui/button";
import { Waves } from "lucide-react";

interface TransportControlsProps {
  isPlaying: boolean;
  onPlayStop: () => void;
}

const TransportControls = ({ isPlaying, onPlayStop }: TransportControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onPlayStop} variant={isPlaying ? "default" : "outline"}>
        {isPlaying ? "Stop" : "Play"}
      </Button>
      <Waves className={`h-6 w-6 ${isPlaying ? 'text-primary animate-pulse' : ''}`} />
    </div>
  );
};

export default TransportControls;