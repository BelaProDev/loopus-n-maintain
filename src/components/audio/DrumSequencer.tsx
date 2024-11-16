import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drum } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { initializeAudio } from '@/lib/audio/audioContext';

interface DrumStep {
  active: boolean;
  velocity: number;
}

interface DrumTrack {
  name: string;
  synth: Tone.MembraneSynth | Tone.MetalSynth | Tone.NoiseSynth;
  steps: DrumStep[];
}

const DrumSequencer = ({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) => {
  const [tracks, setTracks] = useState<DrumTrack[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const sequencerRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    const setupDrumSynths = async () => {
      await initializeAudio();
      
      const kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 5,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
        }
      }).toDestination();

      const snare = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.2
        }
      }).toDestination();

      const hihat = new Tone.MetalSynth({
        frequency: 200,
        envelope: {
          attack: 0.001,
          decay: 0.1,
          release: 0.01
        },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).toDestination();

      const clap = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: {
          attack: 0.001,
          decay: 0.3,
          sustain: 0,
          release: 0.1
        }
      }).toDestination();

      setTracks([
        { name: 'Kick', synth: kick, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
        { name: 'Snare', synth: snare, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
        { name: 'HiHat', synth: hihat, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
        { name: 'Clap', synth: clap, steps: Array(16).fill({ active: false, velocity: 0.7 }) }
      ]);
    };

    setupDrumSynths();

    return () => {
      tracks.forEach(track => track.synth.dispose());
    };
  }, []);

  useEffect(() => {
    const seq = new Tone.Sequence(
      (time, step) => {
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
      },
      [...Array(16).keys()],
      "16n"
    );

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
    const newTracks = [...tracks];
    newTracks[trackIndex].steps[stepIndex].active = !newTracks[trackIndex].steps[stepIndex].active;
    setTracks(newTracks);
  };

  const updateVelocity = (trackIndex: number, stepIndex: number, velocity: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].steps[stepIndex].velocity = velocity;
    setTracks(newTracks);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Drum className="h-5 w-5" />
          Drum Matrix
        </h3>
      </div>

      <div className="space-y-4">
        {tracks.map((track, trackIndex) => (
          <div key={track.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-20 font-medium">{track.name}</span>
              <div className="grid grid-cols-16 gap-1 flex-1">
                {track.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="relative group">
                    <Button
                      variant={step.active ? "default" : "outline"}
                      size="sm"
                      className={`w-full h-8 p-0 ${currentStep === stepIndex ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => toggleStep(trackIndex, stepIndex)}
                    >
                      <div
                        className="w-full h-full bg-primary/50"
                        style={{
                          opacity: step.active ? step.velocity : 0.3
                        }}
                      />
                    </Button>
                    <div className="absolute left-0 -bottom-20 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Card className="p-2">
                        <Slider
                          value={[step.velocity]}
                          min={0}
                          max={1}
                          step={0.01}
                          orientation="vertical"
                          className="h-16"
                          onValueChange={([value]) => updateVelocity(trackIndex, stepIndex, value)}
                        />
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DrumSequencer;