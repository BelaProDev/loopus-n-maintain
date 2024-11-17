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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [steps, setSteps] = useState(Array(8).fill(Array(4).fill({ active: false, note: 'C4' })));

  const synthRef = useRef<Tone.Synth | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await initializeAudio();
        
        const synth = new Tone.Synth({
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 1
          }
        });

        const analyser = new Tone.Analyser('waveform', 128);
        synth.connect(analyser);
        synth.toDestination();
        
        synthRef.current = synth;
        analyserRef.current = analyser;
        setIsAudioInitialized(true);
        toast.success("Audio initialized successfully");

      } catch (error) {
        console.error('Audio setup failed:', error);
        toast.error("Failed to initialize audio");
      }
    };

    setupAudio();

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (analyserRef.current) {
        analyserRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const updateVisualizer = () => {
      if (analyserRef.current) {
        const data = analyserRef.current.getValue();
        setAudioData(Array.from(data as Float32Array));
      }
      requestAnimationFrame(updateVisualizer);
    };
    
    if (isAudioInitialized) {
      updateVisualizer();
    }
  }, [isAudioInitialized]);

  const handleInitAudio = async () => {
    await initializeAudio();
  };

  const handlePlayStop = () => {
    if (!isAudioInitialized) {
      toast.error("Please initialize audio first");
      return;
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  };

  const onStepToggle = (stepIndex: number, rowIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex][rowIndex].active = !newSteps[stepIndex][rowIndex].active;
    setSteps(newSteps);
  };

  const onNoteChange = (stepIndex: number, rowIndex: number, note: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex][rowIndex].note = note;
    setSteps(newSteps);
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
        onStepToggle={onStepToggle}
        onNoteChange={onNoteChange}
        effectParams={{
          filterFreq: 1000,
          filterRes: 1,
          delayTime: 0.3,
          delayFeedback: 0.3,
          reverbMix: 0.3,
          distortion: 0,
          phaserFreq: 0.5,
          flangerDepth: 0.5
        }}
        updateEffects={() => {}}
        onStartRecording={() => setIsRecording(true)}
        onStopRecording={async () => {
          setIsRecording(false);
          return "recording-stopped";
        }}
        isRecording={isRecording}
      />

      <EffectProcessor
        synth={synthRef.current}
        effectParams={{
          filterFreq: 1000,
          filterRes: 1,
          delayTime: 0.3,
          delayFeedback: 0.3,
          reverbMix: 0.3,
          distortion: 0,
          phaserFreq: 0.5,
          flangerDepth: 0.5
        }}
      />
    </Card>
  );
};

export default Synthesizer;