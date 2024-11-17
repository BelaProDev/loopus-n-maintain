import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { AudioWaveform } from "lucide-react";

interface EnvelopeControlsProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  onAttackChange: (value: number) => void;
  onDecayChange: (value: number) => void;
  onSustainChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
}

const EnvelopeControls = ({
  attack,
  decay,
  sustain,
  release,
  onAttackChange,
  onDecayChange,
  onSustainChange,
  onReleaseChange
}: EnvelopeControlsProps) => {
  return (
    <div className="space-y-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <div className="flex items-center gap-2">
        <AudioWaveform className="h-5 w-5" />
        <h4 className="font-semibold">Envelope</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Attack: {attack.toFixed(2)}s</Label>
          <Slider
            value={[attack]}
            min={0}
            max={2}
            step={0.01}
            onValueChange={([value]) => onAttackChange(value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Decay: {decay.toFixed(2)}s</Label>
          <Slider
            value={[decay]}
            min={0}
            max={2}
            step={0.01}
            onValueChange={([value]) => onDecayChange(value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Sustain: {sustain.toFixed(2)}</Label>
          <Slider
            value={[sustain]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => onSustainChange(value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Release: {release.toFixed(2)}s</Label>
          <Slider
            value={[release]}
            min={0}
            max={5}
            step={0.01}
            onValueChange={([value]) => onReleaseChange(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EnvelopeControls;