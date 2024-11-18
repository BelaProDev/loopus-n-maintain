import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Card } from "@/components/ui/card";
import { Drum } from "lucide-react";
import { initializeAudio } from '@/lib/audio/audioContext';
import { toast } from "sonner";
import DrumTrack from './drums/DrumTrack';

interface DrumStep {
  active: boolean;
  velocity: number;
}

interface DrumTrackData {
  name: string;
  synth: Tone.MembraneSynth | Tone.MetalSynth | Tone.NoiseSynth;
  steps: DrumStep[];
}

const DrumSequencer = ({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) => {
  const [tracks, setTracks] = useState<DrumTrackData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const sequencerRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    const setupDrumSynths = async () => {
      try {
        await initializeAudio();
        
        const kick = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 5,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
        }).toDestination();

        const snare = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
        }).toDestination();

        const hihat = new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 }
        }).toDestination();

        const clap = new Tone.NoiseSynth({
          noise: { type: 'pink' },
          envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }
        }).toDestination();

        setTracks([
          { name: 'Kick', synth: kick, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
          { name: 'Snare', synth: snare, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
          { name: 'HiHat', synth: hihat, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
          { name: 'Clap', synth: clap, steps: Array(16).fill({ active: false, velocity: 0.7 }) }
        ]);

        toast.success("Drum machine initialized");
      } catch (error) {
        console.error('Failed to initialize drum synths:', error);
        toast.error("Failed to initialize drum machine");
      }
    };

    setupDrumSynths();
    return () => tracks.forEach(track => track.synth.dispose());
  }, []);

  useEffect(() => {
    if (!tracks.length) return;

    const seq = new Tone.Sequence((time, step) => {
      setCurrentStep(step);
      tracks.forEach(track => {
        if (track.steps[step].active) {
          const velocity = track.steps[step].velocity;
          if (track.name === 'Kick') {
            (track.synth as Tone.MembraneSynth).triggerAttackRelease('C1', '8n', time, velocity);
          } else if (track.name === 'HiHat') {
            (track.synth as Tone.MetalSynth).triggerAttackRelease('32n', time, velocity);
          } else {
            (track.synth as Tone.NoiseSynth).triggerAttackRelease('16n', time, velocity);
          }
        }
      });
    }, [...Array(16).keys()], "16n");

    sequencerRef.current = seq;
    Tone.Transport.bpm.value = bpm;

    if (isPlaying) {
      seq.start();
    } else {
      seq.stop();
    }

    return () => {
      seq.dispose();
    };
  }, [isPlaying, tracks, bpm]);

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    setTracks(prev => prev.map((track, i) => 
      i === trackIndex 
        ? {
            ...track,
            steps: track.steps.map((step, j) => 
              j === stepIndex ? { ...step, active: !step.active } : step
            )
          }
        : track
    ));
  };

  const updateVelocity = (trackIndex: number, stepIndex: number, velocity: number) => {
    setTracks(prev => prev.map((track, i) => 
      i === trackIndex 
        ? {
            ...track,
            steps: track.steps.map((step, j) => 
              j === stepIndex ? { ...step, velocity } : step
            )
          }
        : track
    ));
  };

  return (
    <Card className="p-6 space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Drum className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Drum Matrix</h3>
      </div>

      <div className="space-y-4">
        {tracks.map((track, trackIndex) => (
          <DrumTrack
            key={track.name}
            name={track.name}
            steps={track.steps}
            currentStep={currentStep}
            onStepToggle={(stepIndex) => toggleStep(trackIndex, stepIndex)}
            onVelocityChange={(stepIndex, velocity) => updateVelocity(trackIndex, stepIndex, velocity)}
          />
        ))}
      </div>
    </Card>
  );
};

export default DrumSequencer;