import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import DrumPad from "./DrumPad";

interface DrumTrackProps {
  name: string;
  steps: { active: boolean; velocity: number }[];
  currentStep: number;
  onStepToggle: (stepIndex: number) => void;
  onVelocityChange: (stepIndex: number, velocity: number) => void;
}

const DrumTrack = ({ name, steps, currentStep, onStepToggle, onVelocityChange }: DrumTrackProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-20 font-medium">{name}</span>
        <div className="grid grid-cols-16 gap-1 flex-1">
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} className="relative group">
              <DrumPad
                active={step.active}
                velocity={step.velocity}
                isCurrentStep={currentStep === stepIndex}
                onClick={() => onStepToggle(stepIndex)}
                onVelocityChange={(velocity) => onVelocityChange(stepIndex, velocity)}
              />
              <div className="absolute left-0 -bottom-20 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Card className="p-2">
                  <Slider
                    value={[step.velocity]}
                    min={0}
                    max={1}
                    step={0.01}
                    orientation="vertical"
                    className="h-16"
                    onValueChange={([value]) => onVelocityChange(stepIndex, value)}
                  />
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrumTrack;