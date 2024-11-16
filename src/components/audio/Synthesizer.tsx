import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Volume2, Music2, Waves, Waveform } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShaderVisualizer from './ShaderVisualizer';

interface Step {
  active: boolean;
  note: string;
}

const Synthesizer = () => {
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(128).fill(0));
  const [bpm, setBpm] = useState(120);
  const [steps, setSteps] = useState<Step[][]>(
    Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ active: false, note: 'C4' }))
    )
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [oscillatorType, setOscillatorType] = useState<"sine" | "square" | "sawtooth" | "triangle">("sine");
  const [filterFreq, setFilterFreq] = useState(1000);
  const [filterRes, setFilterRes] = useState(1);
  const [delayTime, setDelayTime] = useState(0.3);
  const [delayFeedback, setDelayFeedback] = useState(0.3);
  
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const sequencerRef = useRef<Tone.Sequence | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const { toast } = useToast();

  const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];

  useEffect(() => {
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: oscillatorType
      }
    }).toDestination();
    
    const filter = new Tone.Filter(filterFreq, "lowpass").toDestination();
    const delay = new Tone.FeedbackDelay(delayTime, delayFeedback).toDestination();
    const analyser = new Tone.Analyser('waveform', 128);
    
    newSynth.connect(filter);
    filter.connect(delay);
    delay.connect(analyser);
    
    setSynth(newSynth);
    filterRef.current = filter;
    delayRef.current = delay;
    analyserRef.current = analyser;

    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        steps[step].forEach((stepData, row) => {
          if (stepData.active) {
            newSynth.triggerAttackRelease(stepData.note, "8n", time);
          }
        });
      },
      [...Array(8).keys()],
      "8n"
    );

    sequencerRef.current = seq;
    Tone.Transport.bpm.value = bpm;

    return () => {
      newSynth.dispose();
      filter.dispose();
      delay.dispose();
      analyser.dispose();
      seq.dispose();
    };
  }, [oscillatorType, bpm]);

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

  const toggleStep = (stepIndex: number, rowIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex][rowIndex] = {
      ...newSteps[stepIndex][rowIndex],
      active: !newSteps[stepIndex][rowIndex].active
    };
    setSteps(newSteps);
  };

  const updateStepNote = (stepIndex: number, rowIndex: number, note: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex][rowIndex] = {
      ...newSteps[stepIndex][rowIndex],
      note
    };
    setSteps(newSteps);
  };

  const togglePlay = async () => {
    await Tone.start();
    if (sequencerRef.current) {
      if (isPlaying) {
        sequencerRef.current.stop();
        Tone.Transport.stop();
      } else {
        sequencerRef.current.start();
        Tone.Transport.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateFilter = (freq: number) => {
    if (filterRef.current) {
      filterRef.current.frequency.value = freq;
      setFilterFreq(freq);
    }
  };

  const updateDelay = (time: number, feedback: number) => {
    if (delayRef.current) {
      delayRef.current.delayTime.value = time;
      delayRef.current.feedback.value = feedback;
      setDelayTime(time);
      setDelayFeedback(feedback);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Music2 className="h-5 w-5" />
          Advanced Synthesizer
        </h3>
        <div className="flex gap-2">
          <Button onClick={togglePlay} variant={isPlaying ? "default" : "outline"}>
            {isPlaying ? "Stop" : "Play"}
          </Button>
          <Button onClick={() => setBpm(bpm + 5)} variant="outline">BPM: {bpm}</Button>
        </div>
      </div>

      <ShaderVisualizer audioData={audioData} />

      <Tabs defaultValue="sequencer">
        <TabsList>
          <TabsTrigger value="sequencer">Sequencer</TabsTrigger>
          <TabsTrigger value="params">Parameters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sequencer" className="space-y-4">
          <div className="grid grid-cols-8 gap-1">
            {steps.map((stepRow, stepIndex) => (
              <div key={stepIndex} className="space-y-1">
                {stepRow.map((step, rowIndex) => (
                  <div key={`${stepIndex}-${rowIndex}`} className="relative">
                    <Button
                      variant={step.active ? "default" : "outline"}
                      className={`w-full h-12 ${currentStep === stepIndex ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => toggleStep(stepIndex, rowIndex)}
                    >
                      {step.note}
                    </Button>
                    <select
                      className="absolute -right-1 -bottom-1 text-xs bg-background border rounded"
                      value={step.note}
                      onChange={(e) => updateStepNote(stepIndex, rowIndex, e.target.value)}
                    >
                      {notes.map(note => (
                        <option key={note} value={note}>{note}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="params" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Oscillator Type</h4>
              <div className="flex gap-2">
                {(['sine', 'square', 'sawtooth', 'triangle'] as const).map(type => (
                  <Button
                    key={type}
                    variant={oscillatorType === type ? "default" : "outline"}
                    onClick={() => setOscillatorType(type)}
                    className="flex-1"
                  >
                    <Waveform className="h-4 w-4 mr-2" />
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Filter Frequency</h4>
              <Slider
                defaultValue={[filterFreq]}
                max={20000}
                min={20}
                step={1}
                onValueChange={([value]) => updateFilter(value)}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Delay Time</h4>
              <Slider
                defaultValue={[delayTime]}
                max={1}
                min={0}
                step={0.01}
                onValueChange={([value]) => updateDelay(value, delayFeedback)}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Delay Feedback</h4>
              <Slider
                defaultValue={[delayFeedback]}
                max={0.9}
                min={0}
                step={0.01}
                onValueChange={([value]) => updateDelay(delayTime, value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Waves className={`h-6 w-6 ${isPlaying ? 'text-primary animate-pulse' : ''}`} />
      </div>
    </Card>
  );
};

export default Synthesizer;