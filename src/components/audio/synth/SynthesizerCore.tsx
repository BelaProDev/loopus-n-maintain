import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { toast } from "sonner";
import { initializeAudio } from '@/lib/audio/audioContext';
import { Card } from "@/components/ui/card";
import SynthHeader from '../SynthHeader';
import SynthControls from './SynthControls';
import ShaderVisualizer from '../ShaderVisualizer';
import TransportControls from '../TransportControls';

const SynthesizerCore = () => {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  const synthRef = useRef<Tone.Synth | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await initializeAudio();
        const synth = new Tone.Synth().toDestination();
        const analyser = new Tone.Analyser('waveform', 128);
        
        synth.chain(analyser, Tone.Destination);
        
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

  const handlePlayStop = () => {
    if (!isAudioInitialized) {
      toast.error("Please initialize audio first");
      return;
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      synthRef.current?.triggerAttack(440);
    } else {
      synthRef.current?.triggerRelease();
    }
  };

  if (!isAudioInitialized) {
    return (
      <Card className="p-6 space-y-4">
        <SynthHeader />
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-center text-muted-foreground">
            Click the button below to initialize audio
          </p>
          <button onClick={() => initializeAudio()}>
            Initialize Audio
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <SynthHeader />
      <ShaderVisualizer audioData={audioData} />
      <TransportControls isPlaying={isPlaying} onPlayStop={handlePlayStop} />
      <SynthControls synth={synthRef.current} />
    </Card>
  );
};

export default SynthesizerCore;