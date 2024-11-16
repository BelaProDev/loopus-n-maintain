import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music2, Waves } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShaderVisualizer from './ShaderVisualizer';
import StepSequencer from './StepSequencer';
import EffectChain from './EffectChain';
import Looper from './Looper';
import BPMControl from './BPMControl';

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
      Array(4).fill(null).map(() => ({ active: false, note: 'C4' }))
    )
  );
  const [currentStep, setCurrentStep] = useState(0);
  
  // Effect parameters
  const [filterFreq, setFilterFreq] = useState(1000);
  const [filterRes, setFilterRes] = useState(1);
  const [delayTime, setDelayTime] = useState(0.3);
  const [delayFeedback, setDelayFeedback] = useState(0.3);
  const [reverbMix, setReverbMix] = useState(0.3);
  const [distortion, setDistortion] = useState(0);
  const [phaserFreq, setPhaserFreq] = useState(0.5);
  const [flangerDepth, setFlangerDepth] = useState(0.5);

  // Effect nodes
  const filterRef = useRef<Tone.Filter | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const distortionRef = useRef<Tone.Distortion | null>(null);
  const phaserRef = useRef<Tone.Phaser | null>(null);
  const flangerRef = useRef<Tone.FeedbackDelay | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const sequencerRef = useRef<Tone.Sequence | null>(null);

  const handleBPMChange = (newBpm: number) => {
    setBpm(newBpm);
    Tone.Transport.bpm.value = newBpm;
  };

  useEffect(() => {
    const newSynth = new Tone.PolySynth().toDestination();
    const filter = new Tone.Filter(filterFreq, "lowpass");
    const delay = new Tone.FeedbackDelay(delayTime, delayFeedback);
    const reverb = new Tone.Reverb({ decay: 2, wet: reverbMix });
    const distortionEffect = new Tone.Distortion(distortion);
    const phaser = new Tone.Phaser({
      frequency: phaserFreq,
      octaves: 3,
      baseFrequency: 1000
    });
    const flanger = new Tone.FeedbackDelay({
      delayTime: 0.005,
      feedback: flangerDepth
    });
    const analyser = new Tone.Analyser('waveform', 128);
    const recorder = new Tone.Recorder();

    // Chain effects
    newSynth.chain(
      filter,
      delay,
      reverb,
      distortionEffect,
      phaser,
      flanger,
      analyser,
      Tone.Destination
    );

    setSynth(newSynth);
    filterRef.current = filter;
    delayRef.current = delay;
    reverbRef.current = reverb;
    distortionRef.current = distortionEffect;
    phaserRef.current = phaser;
    flangerRef.current = flanger;
    analyserRef.current = analyser;
    recorderRef.current = recorder;

    const seq = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        steps[step].forEach((stepData) => {
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
      phaser.dispose();
      flanger.dispose();
      analyser.dispose();
      recorder.dispose();
      seq.dispose();
    };
  }, []);

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
    },
    phaser: (freq: number) => {
      if (phaserRef.current) {
        phaserRef.current.frequency.value = freq;
        setPhaserFreq(freq);
      }
    },
    flanger: (depth: number) => {
      if (flangerRef.current) {
        flangerRef.current.feedback.value = depth;
        setFlangerDepth(depth);
      }
    }
  };

  const startRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const recording = await recorderRef.current.stop();
      const url = URL.createObjectURL(recording);
      setIsRecording(false);
      toast.success("Recording stopped");
      return url;
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
          <Button onClick={() => {
            if (sequencerRef.current) {
              if (isPlaying) {
                sequencerRef.current.stop();
                Tone.Transport.stop();
              } else {
                Tone.start();
                sequencerRef.current.start();
                Tone.Transport.start();
              }
              setIsPlaying(!isPlaying);
            }
          }} variant={isPlaying ? "default" : "outline"}>
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </div>
      </div>

      <BPMControl bpm={bpm} onBPMChange={handleBPMChange} />

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
              newSteps[stepIndex][rowIndex].active = !newSteps[stepIndex][rowIndex].active;
              setSteps(newSteps);
            }}
            onNoteChange={(stepIndex, rowIndex, note) => {
              const newSteps = [...steps];
              newSteps[stepIndex][rowIndex].note = note;
              setSteps(newSteps);
            }}
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
            phaserFreq={phaserFreq}
            flangerDepth={flangerDepth}
            onFilterChange={updateEffects.filter}
            onDelayChange={updateEffects.delay}
            onReverbChange={updateEffects.reverb}
            onDistortionChange={updateEffects.distortion}
            onPhaserChange={updateEffects.phaser}
            onFlangerChange={updateEffects.flanger}
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
