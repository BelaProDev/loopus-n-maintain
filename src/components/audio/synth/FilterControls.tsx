import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Waves } from "lucide-react";

interface FilterControlsProps {
  type: string;
  frequency: number;
  resonance: number;
  onTypeChange: (value: string) => void;
  onFrequencyChange: (value: number) => void;
  onResonanceChange: (value: number) => void;
}

const FilterControls = ({
  type,
  frequency,
  resonance,
  onTypeChange,
  onFrequencyChange,
  onResonanceChange
}: FilterControlsProps) => {
  return (
    <div className="space-y-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <div className="flex items-center gap-2">
        <Waves className="h-5 w-5" />
        <h4 className="font-semibold">Filter</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowpass">Low Pass</SelectItem>
              <SelectItem value="highpass">High Pass</SelectItem>
              <SelectItem value="bandpass">Band Pass</SelectItem>
              <SelectItem value="notch">Notch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Frequency: {frequency}Hz</Label>
          <Slider
            value={[frequency]}
            min={20}
            max={20000}
            step={1}
            onValueChange={([value]) => onFrequencyChange(value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Resonance: {resonance}</Label>
          <Slider
            value={[resonance]}
            min={0}
            max={20}
            step={0.1}
            onValueChange={([value]) => onResonanceChange(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;