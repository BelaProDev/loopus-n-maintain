import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Volume2, Music2, Waves } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ShaderVisualizer from './ShaderVisualizer';

const Synthesizer = () => {
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    const analyser = new Tone.Analyser('waveform', 128);
    newSynth.connect(analyser);
    
    setSynth(newSynth);
    analyserRef.current = analyser;

    return () => {
      newSynth.dispose();
      analyser.dispose();
    };
  }, []);

  useEffect(() => {
    if (!analyserRef.current) return;

    const updateVisualizer = () => {
      if (analyserRef.current) {
        setAudioData([...analyserRef.current.getValue()]);
      }
      requestAnimationFrame(updateVisualizer);
    };

    const frameId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleNotePress = (note: string) => {
    if (synth) {
      synth.triggerAttackRelease(note, "8n");
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 200);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    if (synth) {
      synth.volume.value = values[0];
    }
  };

  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  const startAudioContext = async () => {
    try {
      await Tone.start();
      toast({
        title: "Synthesizer Ready",
        description: "Audio context started successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not start audio context",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Music2 className="h-5 w-5" />
          Synthesizer
        </h3>
        <Button onClick={startAudioContext} variant="outline">
          Initialize Audio
        </Button>
      </div>

      <ShaderVisualizer audioData={audioData} />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Volume2 className="h-5 w-5" />
          <Slider
            defaultValue={[0]}
            max={0}
            min={-60}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {notes.map((note) => (
            <Button
              key={note}
              variant={isPlaying ? "default" : "outline"}
              className="h-16 w-full transition-all"
              onClick={() => handleNotePress(note)}
            >
              {note}
            </Button>
          ))}
        </div>

        <div className="flex justify-center">
          <Waves className={`h-6 w-6 ${isPlaying ? 'text-primary animate-pulse' : ''}`} />
        </div>
      </div>
    </Card>
  );
};

export default Synthesizer;