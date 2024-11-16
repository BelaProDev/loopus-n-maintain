import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface EffectChainProps {
  filterFreq: number;
  filterRes: number;
  delayTime: number;
  delayFeedback: number;
  reverbMix: number;
  distortion: number;
  phaserFreq: number;
  flangerDepth: number;
  onFilterChange: (freq: number) => void;
  onDelayChange: (time: number, feedback: number) => void;
  onReverbChange: (mix: number) => void;
  onDistortionChange: (amount: number) => void;
  onPhaserChange: (freq: number) => void;
  onFlangerChange: (depth: number) => void;
}

const EffectChain = ({
  filterFreq,
  filterRes,
  delayTime,
  delayFeedback,
  reverbMix,
  distortion,
  phaserFreq,
  flangerDepth,
  onFilterChange,
  onDelayChange,
  onReverbChange,
  onDistortionChange,
  onPhaserChange,
  onFlangerChange
}: EffectChainProps) => {
  const EffectControl = ({ label, value, onChange, min, max, step, unit = "" }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {value.toFixed(2)}{unit}
      </Label>
      <Slider
        defaultValue={[value]}
        max={max}
        min={min}
        step={step}
        onValueChange={([value]) => onChange(value)}
        className="my-2"
      />
    </div>
  );

  return (
    <div className="space-y-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-5 w-5" />
        <h4 className="font-semibold">Effect Chain</h4>
      </div>
      
      <EffectControl
        label="Filter Frequency"
        value={filterFreq}
        onChange={onFilterChange}
        min={20}
        max={20000}
        step={1}
        unit="Hz"
      />

      <EffectControl
        label="Delay Time"
        value={delayTime}
        onChange={(value) => onDelayChange(value, delayFeedback)}
        min={0}
        max={2}
        step={0.01}
        unit="s"
      />

      <EffectControl
        label="Delay Feedback"
        value={delayFeedback}
        onChange={(value) => onDelayChange(delayTime, value)}
        min={0}
        max={0.95}
        step={0.01}
      />

      <EffectControl
        label="Reverb Mix"
        value={reverbMix}
        onChange={onReverbChange}
        min={0}
        max={1}
        step={0.01}
      />

      <EffectControl
        label="Distortion"
        value={distortion}
        onChange={onDistortionChange}
        min={0}
        max={100}
        step={0.1}
      />

      <EffectControl
        label="Phaser Frequency"
        value={phaserFreq}
        onChange={onPhaserChange}
        min={0.1}
        max={10}
        step={0.1}
        unit="Hz"
      />

      <EffectControl
        label="Flanger Depth"
        value={flangerDepth}
        onChange={onFlangerChange}
        min={0}
        max={1}
        step={0.01}
      />
    </div>
  );
};

export default EffectChain;