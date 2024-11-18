import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DrumPadProps {
  active: boolean;
  velocity: number;
  isCurrentStep: boolean;
  onClick: () => void;
  onVelocityChange: (velocity: number) => void;
}

const DrumPad = ({ active, velocity, isCurrentStep, onClick, onVelocityChange }: DrumPadProps) => {
  return (
    <div className="relative group">
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-full h-8 p-0 transition-all",
          isCurrentStep && "ring-2 ring-primary animate-pulse"
        )}
        onClick={onClick}
      >
        <div
          className="absolute inset-0 bg-primary/50 transition-all"
          style={{
            opacity: active ? velocity : 0.1,
            transform: `scaleY(${velocity})`
          }}
        />
      </Button>
    </div>
  );
};

export default DrumPad;