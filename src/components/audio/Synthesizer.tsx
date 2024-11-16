import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Waves } from "lucide-react";
import { toast } from "sonner";
import ShaderVisualizer from './ShaderVisualizer';
import SynthControls from './SynthControls';
import EffectProcessor from './EffectProcessor';
import { initializeAudio } from '@/lib/audio/audioContext';

interface Step {
  active: boolean;
  note: string;
  velocity: number;
}

const Synthesizer = () => {
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  const [bpm, setBpm] = useState(120);
  const [steps, setSteps] = useState<Step[][]>(
    Array(8).fill(null).map(() => 
      Array(4).fill(null).map(() => ({ active: false, note: 'C4', velocity: 0.7 }))
    )
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  // Effect parameters
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

  useEffect(() => {
    const setupAudio = async () => {
      await initializeAudio();
      const newSynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      });
      
      const analyser = new Tone.Analyser('waveform', 128);
      newSynth.connect(analyser);
      
      setSynth(newSynth);
      analyserRef.current = analyser;

      return () => {
        newSynth.dispose();
        analyser.dispose();
      };
    };

    setupAudio();
  }, []);

  useEffect(() => {
    if (!synth) return;

    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        steps[step].forEach((stepData) => {
          if (stepData.active) {
            synth.triggerAttackRelease(
              stepData.note,
              "8n",
              time,
              stepData.velocity
            );
          }
        });
      },
      [...Array(8).keys()],
      "8n"
    );

    sequencerRef.current = seq;
    Tone.Transport.bpm.value = bpm;

    return () => {
      seq.dispose();
    };
  }, [synth, steps, bpm]);

  useEffect(() => {
    if (!analyserRef.current) return;

    const updateVisualizer = () => {
      if (analyserRef.current) {
        const data = Array.from(analyserRef.current.getValue() as Float32Array);
        setAudioData(data);
      }
      requestAnimationFrame(updateVisualizer);
    };

    const frameId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handlePlayStop = async () => {
    try {
      if (!isPlaying) {
        await initializeAudio();
        if (sequencerRef.current) {
          sequencerRef.current.start();
          Tone.Transport.start();
        }
      } else {
        if (sequencerRef.current) {
          sequencerRef.current.stop();
          Tone.Transport.stop();
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      toast.error("Failed to start audio");
    }
  };

  const handleStepToggle = (stepIndex: number, rowIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex][rowIndex].active = !newSteps[stepIndex][rowIndex].active;
    setSteps(newSteps);
  };

  const handleNoteChange = (stepIndex: number, rowIndex: number, note: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex][rowIndex].note = note;
    setSteps(newSteps);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Recording logic here
  };

  const stopRecording = async () => {
    setIsRecording(false);
    return "recording-stopped";
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Music2 className="h-5 w-5" />
          Advanced Synthesizer
        </h3>
        <Button onClick={handlePlayStop} variant={isPlaying ? "default" : "outline"}>
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>

      <ShaderVisualizer audioData={audioData} />

      <SynthControls
        bpm={bpm}
        isPlaying={isPlaying}
        onBPMChange={setBpm}
        steps={steps}
        currentStep={currentStep}
        onStepToggle={handleStepToggle}
        onNoteChange={handleNoteChange}
        effectParams={effectParams}
        updateEffects={setEffectParams}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        isRecording={isRecording}
      />

      <EffectProcessor
        synth={synth}
        effectParams={effectParams}
      />

      <div className="flex justify-center">
        <Waves className={`h-6 w-6 ${isPlaying ? 'text-primary animate-pulse' : ''}`} />
      </div>
    </Card>
  );
};

export default Synthesizer;