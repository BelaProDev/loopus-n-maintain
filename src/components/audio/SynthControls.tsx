import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music2, Save, Upload, Download } from "lucide-react";
import BPMControl from './BPMControl';
import StepSequencer from './StepSequencer';
import EffectChain from './EffectChain';
import Looper from './Looper';
import DrumSequencer from './DrumSequencer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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
  const handleSaveProject = () => {
    // Save project logic would go here
    toast.success("Project saved successfully");
  };

  const handleLoadProject = () => {
    // Load project logic would go here
    toast.success("Project loaded successfully");
  };

  const handleExportAudio = () => {
    // Export audio logic would go here
    toast.success("Audio exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <BPMControl bpm={bpm} onBPMChange={onBPMChange} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveProject}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadProject}>
            <Upload className="w-4 h-4 mr-2" />
            Load
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportAudio}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <DrumSequencer bpm={bpm} isPlaying={isPlaying} />

      <Tabs defaultValue="sequencer" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="sequencer">Sequencer</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="looper">Looper</TabsTrigger>
          <TabsTrigger value="mixer">Mixer</TabsTrigger>
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

        <TabsContent value="mixer">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Master Output</h3>
              <div className="space-y-2">
                <input type="range" className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-inf</span>
                  <span>0dB</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Synth</h3>
              <div className="space-y-2">
                <input type="range" className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-inf</span>
                  <span>0dB</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Drums</h3>
              <div className="space-y-2">
                <input type="range" className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-inf</span>
                  <span>0dB</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-2">Effects</h3>
              <div className="space-y-2">
                <input type="range" className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-inf</span>
                  <span>0dB</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SynthControls;