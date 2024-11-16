import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

interface EffectChainProps {
  filterFreq: number;
  filterRes: number;
  delayTime: number;
  delayFeedback: number;
  reverbMix: number;
  distortion: number;
  onFilterChange: (freq: number) => void;
  onDelayChange: (time: number, feedback: number) => void;
  onReverbChange: (mix: number) => void;
  onDistortionChange: (amount: number) => void;
}

const EffectChain = ({
  filterFreq,
  filterRes,
  delayTime,
  delayFeedback,
  reverbMix,
  distortion,
  onFilterChange,
  onDelayChange,
  onReverbChange,
  onDistortionChange
}: EffectChainProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-5 w-5" />
        <h4 className="font-semibold">Effect Chain</h4>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Filter Frequency</h4>
        <Slider
          defaultValue={[filterFreq]}
          max={20000}
          min={20}
          step={1}
          onValueChange={([value]) => onFilterChange(value)}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Delay Time</h4>
        <Slider
          defaultValue={[delayTime]}
          max={1}
          min={0}
          step={0.01}
          onValueChange={([value]) => onDelayChange(value, delayFeedback)}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Delay Feedback</h4>
        <Slider
          defaultValue={[delayFeedback]}
          max={0.9}
          min={0}
          step={0.01}
          onValueChange={([value]) => onDelayChange(delayTime, value)}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Reverb Mix</h4>
        <Slider
          defaultValue={[reverbMix]}
          max={1}
          min={0}
          step={0.01}
          onValueChange={([value]) => onReverbChange(value)}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Distortion</h4>
        <Slider
          defaultValue={[distortion]}
          max={100}
          min={0}
          step={1}
          onValueChange={([value]) => onDistortionChange(value)}
        />
      </div>
    </div>
  );
};

export default EffectChain;