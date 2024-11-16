import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music2 } from "lucide-react";
import BPMControl from './BPMControl';
import StepSequencer from './StepSequencer';
import EffectChain from './EffectChain';
import Looper from './Looper';
import DrumSequencer from './DrumSequencer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SynthControlsProps {
  bpm: number;
  isPlaying: boolean;
  onBPMChange: (newBpm: number) => void;
  steps: any[];
  currentStep: number;
  onStepToggle: (stepIndex: number, rowIndex: number) => void;
  onNoteChange: (stepIndex: number, rowIndex: number, note: string) => void;
  effectParams: any;
  updateEffects: any;
  onStartRecording: () => void;
  onStopRecording: () => Promise<string>;
  isRecording: boolean;
}

const SynthControls = ({
  bpm,
  isPlaying,
  onBPMChange,
  steps,
  currentStep,
  onStepToggle,
  onNoteChange,
  effectParams,
  updateEffects,
  onStartRecording,
  onStopRecording,
  isRecording
}: SynthControlsProps) => {
  return (
    <div className="space-y-6">
      <BPMControl bpm={bpm} onBPMChange={onBPMChange} />

      <DrumSequencer bpm={bpm} isPlaying={isPlaying} />

      <Tabs defaultValue="sequencer">
        <TabsList>
          <TabsTrigger value="sequencer">Sequencer</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="looper">Looper</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sequencer">
          <StepSequencer
            steps={steps}
            currentStep={currentStep}
            onStepToggle={onStepToggle}
            onNoteChange={onNoteChange}
          />
        </TabsContent>

        <TabsContent value="effects">
          <EffectChain {...effectParams} {...updateEffects} />
        </TabsContent>

        <TabsContent value="looper">
          <Looper
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            isRecording={isRecording}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SynthControls;