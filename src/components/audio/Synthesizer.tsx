import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music2, Waves } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShaderVisualizer from './ShaderVisualizer';
import StepSequencer from './StepSequencer';
import EffectChain from './EffectChain';
import Looper from './Looper';

interface Step {
  active: boolean;
  note: string;
}

const Synthesizer = () => {
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
  const [reverbMix, setReverbMix] = useState(0.3);
  const [distortion, setDistortion] = useState(0);
  
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const sequencerRef = useRef<Tone.Sequence | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const distortionRef = useRef<Tone.Distortion | null>(null);
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const { toast } = useToast();

  const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];

  useEffect(() => {
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: oscillatorType }
    }).toDestination();
    
    const filter = new Tone.Filter(filterFreq, "lowpass").toDestination();
    const delay = new Tone.FeedbackDelay(delayTime, delayFeedback).toDestination();
    const reverb = new Tone.Reverb({ decay: 2, wet: reverbMix }).toDestination();
    const distortionEffect = new Tone.Distortion(distortion).toDestination();
    const analyser = new Tone.Analyser('waveform', 128);
    const recorder = new Tone.Recorder();
    
    newSynth.chain(filter, delay, reverb, distortionEffect, analyser);
    
    setSynth(newSynth);
    filterRef.current = filter;
    delayRef.current = delay;
    reverbRef.current = reverb;
    distortionRef.current = distortionEffect;
    analyserRef.current = analyser;
    recorderRef.current = recorder;

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
      reverb.dispose();
      distortionEffect.dispose();
      analyser.dispose();
      recorder.dispose();
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

  const startRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Your loop is being recorded"
      });
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const recording = await recorderRef.current.stop();
      const url = URL.createObjectURL(recording);
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your loop has been saved"
      });
      return url;
    }
  };

  const updateEffects = {
    filter: (freq: number) => {
      if (filterRef.current) {
        filterRef.current.frequency.value = freq;
        setFilterFreq(freq);
      }
    },
    delay: (time: number, feedback: number) => {
      if (delayRef.current) {
        delayRef.current.delayTime.value = time;
        delayRef.current.feedback.value = feedback;
        setDelayTime(time);
        setDelayFeedback(feedback);
      }
    },
    reverb: (mix: number) => {
      if (reverbRef.current) {
        reverbRef.current.wet.value = mix;
        setReverbMix(mix);
      }
    },
    distortion: (amount: number) => {
      if (distortionRef.current) {
        distortionRef.current.distortion = amount;
        setDistortion(amount);
      }
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
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="looper">Looper</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sequencer">
          <StepSequencer
            steps={steps}
            currentStep={currentStep}
            onStepToggle={(stepIndex, rowIndex) => {
              const newSteps = [...steps];
              newSteps[stepIndex][rowIndex] = {
                ...newSteps[stepIndex][rowIndex],
                active: !newSteps[stepIndex][rowIndex].active
              };
              setSteps(newSteps);
            }}
            onNoteChange={(stepIndex, rowIndex, note) => {
              const newSteps = [...steps];
              newSteps[stepIndex][rowIndex] = {
                ...newSteps[stepIndex][rowIndex],
                note
              };
              setSteps(newSteps);
            }}
            notes={notes}
          />
        </TabsContent>

        <TabsContent value="effects">
          <EffectChain
            filterFreq={filterFreq}
            filterRes={filterRes}
            delayTime={delayTime}
            delayFeedback={delayFeedback}
            reverbMix={reverbMix}
            distortion={distortion}
            onFilterChange={updateEffects.filter}
            onDelayChange={updateEffects.delay}
            onReverbChange={updateEffects.reverb}
            onDistortionChange={updateEffects.distortion}
          />
        </TabsContent>

        <TabsContent value="looper">
          <Looper
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            isRecording={isRecording}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Waves className={`h-6 w-6 ${isPlaying ? 'text-primary animate-pulse' : ''}`} />
      </div>
    </Card>
  );
};

export default Synthesizer;