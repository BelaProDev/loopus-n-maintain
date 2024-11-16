import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Clock8 } from "lucide-react";

interface BPMControlProps {
  bpm: number;
  onBPMChange: (newBpm: number) => void;
}

const BPMControl = ({ bpm, onBPMChange }: BPMControlProps) => {
  const incrementBPM = (amount: number) => {
    const newBpm = Math.min(Math.max(bpm + amount, 40), 240);
    onBPMChange(newBpm);
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <Clock8 className="h-5 w-5" />
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => incrementBPM(-1)}
      >
        -
      </Button>
      <div className="flex-1">
        <Slider
          value={[bpm]}
          min={40}
          max={240}
          step={1}
          onValueChange={([value]) => onBPMChange(value)}
          className="w-full"
        />
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => incrementBPM(1)}
      >
        +
      </Button>
      <span className="min-w-[4rem] text-center font-mono">
        {bpm} BPM
      </span>
    </div>
  );
};

export default BPMControl;