import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";

interface Step {
  active: boolean;
  note: string;
}

interface StepSequencerProps {
  steps: Step[][];
  currentStep: number;
  onStepToggle: (stepIndex: number, rowIndex: number) => void;
  onNoteChange: (stepIndex: number, rowIndex: number, note: string) => void;
  notes: string[];
}

const StepSequencer = ({ steps, currentStep, onStepToggle, onNoteChange, notes }: StepSequencerProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Music2 className="h-5 w-5" />
        <h4 className="font-semibold">Step Sequencer</h4>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {steps.map((stepRow, stepIndex) => (
          <div key={stepIndex} className="space-y-1">
            {stepRow.map((step, rowIndex) => (
              <div key={`${stepIndex}-${rowIndex}`} className="relative">
                <Button
                  variant={step.active ? "default" : "outline"}
                  className={`w-full h-12 ${currentStep === stepIndex ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => onStepToggle(stepIndex, rowIndex)}
                >
                  {step.note}
                </Button>
                <select
                  className="absolute -right-1 -bottom-1 text-xs bg-background border rounded"
                  value={step.note}
                  onChange={(e) => onNoteChange(stepIndex, rowIndex, e.target.value)}
                >
                  {notes.map(note => (
                    <option key={note} value={note}>{note}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSequencer;