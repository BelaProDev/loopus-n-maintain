import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ShaderVisualizer from './ShaderVisualizer';
import TransportControls from './TransportControls';
import SynthHeader from './SynthHeader';
import { initializeAudio } from '@/lib/audio/audioContext';
import OscillatorControls from './synth/OscillatorControls';
import EnvelopeControls from './synth/EnvelopeControls';
import FilterControls from './synth/FilterControls';

const Synthesizer = () => {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  
  // Oscillator state
  const [oscillatorType, setOscillatorType] = useState('sine');
  const [oscillatorFreq, setOscillatorFreq] = useState(440);
  const [oscillatorDetune, setOscillatorDetune] = useState(0);
  
  // Envelope state
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(1);
  
  // Filter state
  const [filterType, setFilterType] = useState('lowpass');
  const [filterFreq, setFilterFreq] = useState(1000);
  const [filterRes, setFilterRes] = useState(1);

  const synthRef = useRef<Tone.Synth | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await initializeAudio();
        
        const synth = new Tone.Synth({
          oscillator: {
            type: oscillatorType as Tone.ToneOscillatorType,
            frequency: oscillatorFreq,
            detune: oscillatorDetune
          },
          envelope: {
            attack,
            decay,
            sustain,
            release
          }
        });

        const filter = new Tone.Filter({
          type: filterType as Tone.BiquadFilterType,
          frequency: filterFreq,
          Q: filterRes
        });

        const analyser = new Tone.Analyser('waveform', 128);
        
        synth.chain(filter, analyser, Tone.Destination);
        
        synthRef.current = synth;
        filterRef.current = filter;
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
      if (filterRef.current) {
        filterRef.current.dispose();
      }
      if (analyserRef.current) {
        analyserRef.current.dispose();
      }
    };
  }, []);

  // Update synth parameters when controls change
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.set({
        oscillator: {
          type: oscillatorType,
          frequency: oscillatorFreq,
          detune: oscillatorDetune
        },
        envelope: {
          attack,
          decay,
          sustain,
          release
        }
      });
    }
  }, [oscillatorType, oscillatorFreq, oscillatorDetune, attack, decay, sustain, release]);

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.set({
        type: filterType,
        frequency: filterFreq,
        Q: filterRes
      });
    }
  }, [filterType, filterFreq, filterRes]);

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
      synthRef.current?.triggerAttack(oscillatorFreq);
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OscillatorControls
          type={oscillatorType}
          frequency={oscillatorFreq}
          detune={oscillatorDetune}
          onTypeChange={setOscillatorType}
          onFrequencyChange={setOscillatorFreq}
          onDetuneChange={setOscillatorDetune}
        />
        
        <EnvelopeControls
          attack={attack}
          decay={decay}
          sustain={sustain}
          release={release}
          onAttackChange={setAttack}
          onDecayChange={setDecay}
          onSustainChange={setSustain}
          onReleaseChange={setRelease}
        />
        
        <FilterControls
          type={filterType}
          frequency={filterFreq}
          resonance={filterRes}
          onTypeChange={setFilterType}
          onFrequencyChange={setFilterFreq}
          onResonanceChange={setFilterRes}
        />
      </div>
    </Card>
  );
};

export default Synthesizer;