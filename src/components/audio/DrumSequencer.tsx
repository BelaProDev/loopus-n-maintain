import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drum, AudioWaveform } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { initializeAudio } from '@/lib/audio/audioContext';

interface DrumStep {
  active: boolean;
  velocity: number;
}

interface DrumTrack {
  name: string;
  sound: string;
  buffer: AudioBuffer | null;
  steps: DrumStep[];
}

const DrumSequencer = ({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) => {
  const [tracks, setTracks] = useState<DrumTrack[]>([
    { name: 'Kick', sound: '/drums/kick.wav', buffer: null, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
    { name: 'Snare', sound: '/drums/snare.wav', buffer: null, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
    { name: 'HiHat', sound: '/drums/hihat.wav', buffer: null, steps: Array(16).fill({ active: false, velocity: 0.7 }) },
    { name: 'Clap', sound: '/drums/clap.wav', buffer: null, steps: Array(16).fill({ active: false, velocity: 0.7 }) }
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const playerRefs = useRef<Map<string, Tone.Player>>(new Map());
  const sequencerRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    const loadSamples = async () => {
      try {
        await initializeAudio();
        
        const newTracks = [...tracks];
        for (let track of newTracks) {
          const player = new Tone.Player({
            url: track.sound,
            onload: () => {
              console.log(`Loaded ${track.name}`);
            },
            onerror: (error) => {
              console.error(`Error loading ${track.name}:`, error);
            }
          }).toDestination();
          
          playerRefs.current.set(track.name, player);
        }
        
        setTracks(newTracks);
      } catch (error) {
        toast.error("Failed to load drum samples");
      }
    };

    loadSamples();

    return () => {
      playerRefs.current.forEach(player => player.dispose());
      playerRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        tracks.forEach(track => {
          const player = playerRefs.current.get(track.name);
          if (player && track.steps[step].active) {
            player.volume.value = Tone.gainToDb(track.steps[step].velocity);
            player.start(time);
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