import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ShaderVisualizer from './ShaderVisualizer';
import SynthControls from './SynthControls';
import EffectProcessor from './EffectProcessor';
import TransportControls from './TransportControls';
import SynthHeader from './SynthHeader';
import { initializeAudio } from '@/lib/audio/audioContext';

const Synthesizer = () => {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [steps, setSteps] = useState(
    Array(8).fill(null).map(() => 
      Array(4).fill(null).map(() => ({ active: false, note: 'C4', velocity: 0.7 }))
    )
  );

  const [effectParams, setEffectParams] = useState({
    filterFreq: 1000,
    filterRes: 1,
    delayTime: 0.3,
    delayFeedback: 0.3,
    reverbMix: 0.3,
    distortion: 0,
    phaserFreq: 0.5,
    flangerDepth: 0.5
  });

  const analyserRef = useRef<Tone.Analyser | null>(null);
  const sequencerRef = useRef<Tone.Sequence | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const setupAudio = async () => {
    try {
      await initializeAudio();
      
      const newSynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).toDestination();
      
      const analyser = new Tone.Analyser('waveform', 128);
      newSynth.connect(analyser);
      
      setSynth(newSynth);
      analyserRef.current = analyser;
      setIsAudioInitialized(true);

      // Start animation frame for visualizer
      const updateVisualizer = () => {
        if (analyserRef.current) {
          const data = analyserRef.current.getValue();
          // Convert Float32Array to regular number array
          setAudioData(Array.from(data instanceof Float32Array ? data : []));
        }
        requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

    } catch (error) {
      console.error('Audio setup failed:', error);
      toast.error("Failed to initialize audio");
    }
  };

  const handleInitAudio = async () => {
    await setupAudio();
  };

  const handlePlayStop = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isAudioInitialized) {
    return (
      <Card className="p-6 space-y-4">
        <SynthHeader />
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-center text-muted-foreground">
            Click the button below to initialize audio
          </p>
          <Button onClick={handleInitAudio}>
            Initialize Audio
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <SynthHeader />
      <ShaderVisualizer audioData={audioData} />
      <TransportControls isPlaying={isPlaying} onPlayStop={handlePlayStop} />
      
      <SynthControls
        bpm={bpm}
        isPlaying={isPlaying}
        onBPMChange={setBpm}
        steps={steps}
        currentStep={currentStep}
        onStepToggle={(stepIndex, rowIndex) => {
          const newSteps = [...steps];
          newSteps[stepIndex][rowIndex].active = !newSteps[stepIndex][rowIndex].active;
          setSteps(newSteps);
        }}
        onNoteChange={(stepIndex, rowIndex, note) => {
          const newSteps = [...steps];
          newSteps[stepIndex][rowIndex].note = note;
          setSteps(newSteps);
        }}
        effectParams={effectParams}
        updateEffects={setEffectParams}
        onStartRecording={() => setIsRecording(true)}
        onStopRecording={async () => {
          setIsRecording(false);
          return "recording-stopped";
        }}
        isRecording={isRecording}
      />

      <EffectProcessor
        synth={synth}
        effectParams={effectParams}
      />
    </Card>
  );
};

export default Synthesizer;