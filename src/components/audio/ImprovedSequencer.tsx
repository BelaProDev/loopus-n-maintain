import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Step {
  active: boolean;
  note: string;
  velocity: number;
}

interface ImprovedSequencerProps {
  steps: Step[][];
  currentStep: number;
  onStepToggle: (stepIndex: number, rowIndex: number) => void;
  onVelocityChange: (stepIndex: number, rowIndex: number, velocity: number) => void;
  onNoteChange: (stepIndex: number, rowIndex: number, note: string) => void;
}

const ImprovedSequencer = ({
  steps,
  currentStep,
  onStepToggle,
  onVelocityChange,
  onNoteChange
}: ImprovedSequencerProps) => {
  return (
    <Card className="p-6 space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 mb-4">
        <Music2 className="h-5 w-5" />
        <h4 className="font-semibold">Step Sequencer</h4>
      </div>

      <div className="grid grid-cols-8 gap-4">
        {steps.map((stepRow, stepIndex) => (
          <div key={stepIndex} className="space-y-2">
            {stepRow.map((step, rowIndex) => (
              <div
                key={`${stepIndex}-${rowIndex}`}
                className="relative group space-y-2"
              >
                <Button
                  variant={step.active ? "default" : "outline"}
                  className={cn(
                    "w-full h-12 transition-all relative overflow-hidden",
                    currentStep === stepIndex && "ring-2 ring-primary animate-pulse",
                    step.active && "bg-primary hover:bg-primary/90"
                  )}
                  onClick={() => onStepToggle(stepIndex, rowIndex)}
                >
                  <div
                    className="absolute bottom-0 left-0 w-full bg-primary/20"
                    style={{ height: `${step.velocity * 100}%` }}
                  />
                  <span className="relative z-10">{step.note}</span>
                </Button>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Slider
                    value={[step.velocity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => onVelocityChange(stepIndex, rowIndex, value)}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImprovedSequencer;