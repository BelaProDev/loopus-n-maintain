import { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drum, Waveform } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface DrumStep {
  active: boolean;
  velocity: number;
}

interface DrumTrack {
  name: string;
  sound: string;
  steps: DrumStep[];
}

const DrumSequencer = ({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) => {
  const [tracks, setTracks] = useState<DrumTrack[]>([
    { name: 'Kick', sound: 'C1', steps: Array(16).fill({ active: false, velocity: 0.7 }) },
    { name: 'Snare', sound: 'D1', steps: Array(16).fill({ active: false, velocity: 0.7 }) },
    { name: 'HiHat', sound: 'F#1', steps: Array(16).fill({ active: false, velocity: 0.7 }) },
    { name: 'Clap', sound: 'E1', steps: Array(16).fill({ active: false, velocity: 0.7 }) }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [drumSynth] = useState(() => new Tone.MembraneSynth().toDestination());
  const [noiseSynth] = useState(() => new Tone.NoiseSynth().toDestination());

  useEffect(() => {
    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        tracks.forEach(track => {
          if (track.steps[step].active) {
            if (track.name === 'HiHat') {
              noiseSynth.triggerAttackRelease('16n', time, track.steps[step].velocity);
            } else {
              drumSynth.triggerAttackRelease(track.sound, '16n', time, track.steps[step].velocity);
            }
          }
        });
      },
      [...Array(16).keys()],
      '16n'
    );

    if (isPlaying) {
      seq.start(0);
    } else {
      seq.stop();
    }

    return () => {
      seq.dispose();
    };
  }, [isPlaying, tracks, drumSynth, noiseSynth]);

  const generateRandomPattern = () => {
    setTracks(tracks.map(track => ({
      ...track,
      steps: track.steps.map(() => ({
        active: Math.random() > 0.7,
        velocity: 0.5 + Math.random() * 0.5
      }))
    })));
    toast.success("Generated random drum pattern");
  };

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].steps[stepIndex].active = !newTracks[trackIndex].steps[stepIndex].active;
    setTracks(newTracks);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Drum className="h-5 w-5" />
          Drum Matrix
        </h3>
        <Button onClick={generateRandomPattern} variant="outline">
          Random Pattern
        </Button>
      </div>

      <div className="space-y-4">
        {tracks.map((track, trackIndex) => (
          <div key={track.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-20 font-medium">{track.name}</span>
              <div className="grid grid-cols-16 gap-1 flex-1">
                {track.steps.map((step, stepIndex) => (
                  <Button
                    key={stepIndex}
                    variant={step.active ? "default" : "outline"}
                    size="sm"
                    className={`w-full h-8 p-0 ${currentStep === stepIndex ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => toggleStep(trackIndex, stepIndex)}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        opacity: step.active ? step.velocity : 0.3
                      }}
                    />
                  </Button>
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