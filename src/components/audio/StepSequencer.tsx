import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step {
  active: boolean;
  note: string;
}

interface StepSequencerProps {
  steps: Step[][];
  currentStep: number;
  onStepToggle: (stepIndex: number, rowIndex: number) => void;
  onNoteChange: (stepIndex: number, rowIndex: number, note: string) => void;
}

const StepSequencer = ({ steps, currentStep, onStepToggle, onNoteChange }: StepSequencerProps) => {
  // Generate notes from C0 to C7
  const generateNotes = () => {
    const notes = [];
    const octaves = ['0', '1', '2', '3', '4', '5', '6', '7'];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    for (const octave of octaves) {
      for (const note of noteNames) {
        notes.push(`${note}${octave}`);
      }
    }
    return notes;
  };

  const notes = generateNotes();

  return (
    <div className="space-y-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Music2 className="h-5 w-5" />
        <h4 className="font-semibold">Step Sequencer</h4>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {steps.map((stepRow, stepIndex) => (
          <div key={stepIndex} className="space-y-2">
            {stepRow.map((step, rowIndex) => (
              <div key={`${stepIndex}-${rowIndex}`} className="relative group">
                <Button
                  variant={step.active ? "default" : "outline"}
                  className={`w-full h-12 transition-all ${
                    currentStep === stepIndex ? 'ring-2 ring-primary animate-pulse' : ''
                  } ${step.active ? 'bg-primary hover:bg-primary/90' : ''}`}
                  onClick={() => onStepToggle(stepIndex, rowIndex)}
                >
                  {step.note}
                </Button>
                <div className="absolute -right-1 -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Select
                    value={step.note}
                    onValueChange={(value) => onNoteChange(stepIndex, rowIndex, value)}
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue placeholder="Note" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {notes.map(note => (
                        <SelectItem key={note} value={note} className="text-xs">
                          {note}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSequencer;