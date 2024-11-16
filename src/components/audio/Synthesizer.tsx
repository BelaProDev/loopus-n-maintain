import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ShaderVisualizer from './ShaderVisualizer';
import SynthControls from './SynthControls';
import EffectProcessor from './EffectProcessor';
import TransportControls from './TransportControls';
import SynthHeader from './SynthHeader';
import { initializeAudio } from '@/lib/audio/audioContext';

const Synthesizer = () => {
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

      // Start animation frame for visualizer
      const updateVisualizer = () => {
        if (analyserRef.current) {
          const data = analyserRef.current.getValue();
          // Ensure we're working with a Float32Array and convert it to a regular array
          if (data instanceof Float32Array) {
            const normalizedData = Array.from(data).map(value => 
              // Normalize values to be between -1 and 1
              Math.max(-1, Math.min(1, value))
            );
            setAudioData(normalizedData);
          }
        }
        requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();
    };

    setupAudio();
    return () => {
      synth?.dispose();
      analyserRef.current?.dispose();
    };
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
  };

  const stopRecording = async () => {
    setIsRecording(false);
    return "recording-stopped";
  };

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
    </Card>
  );
};

export default Synthesizer;
