import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { AudioWaveform } from "lucide-react";

interface OscillatorControlsProps {
  type: string;
  frequency: number;
  detune: number;
  onTypeChange: (value: string) => void;
  onFrequencyChange: (value: number) => void;
  onDetuneChange: (value: number) => void;
}

const OscillatorControls = ({
  type,
  frequency,
  detune,
  onTypeChange,
  onFrequencyChange,
  onDetuneChange
}: OscillatorControlsProps) => {
  return (
    <div className="space-y-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <div className="flex items-center gap-2">
        <AudioWaveform className="h-5 w-5" />
        <h4 className="font-semibold">Oscillator</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Waveform</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select waveform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sine">Sine</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="sawtooth">Sawtooth</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Frequency: {frequency}Hz</Label>
          <Slider
            value={[frequency]}
            min={20}
            max={2000}
            step={1}
            onValueChange={([value]) => onFrequencyChange(value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Detune: {detune}</Label>
          <Slider
            value={[detune]}
            min={-100}
            max={100}
            step={1}
            onValueChange={([value]) => onDetuneChange(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default OscillatorControls;