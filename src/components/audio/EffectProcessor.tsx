import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { toast } from "sonner";

interface EffectProcessorProps {
  synth: Tone.Synth | null;
  effectParams: {
    filterFreq: number;
    filterRes: number;
    delayTime: number;
    delayFeedback: number;
    reverbMix: number;
    distortion: number;
    phaserFreq: number;
    flangerDepth: number;
  };
}

const EffectProcessor = ({ synth, effectParams }: EffectProcessorProps) => {
  const filterRef = useRef<Tone.Filter | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const distortionRef = useRef<Tone.Distortion | null>(null);
  const phaserRef = useRef<Tone.Phaser | null>(null);
  const flangerRef = useRef<Tone.FeedbackDelay | null>(null);

  useEffect(() => {
    if (!synth) return;

    try {
      // Create effects chain
      const filter = new Tone.Filter({
        frequency: effectParams.filterFreq,
        Q: effectParams.filterRes,
        type: "lowpass"
      }).toDestination();

      const delay = new Tone.FeedbackDelay({
        delayTime: effectParams.delayTime,
        feedback: effectParams.delayFeedback
      }).connect(filter);

      const reverb = new Tone.Reverb({
        decay: 2,
        wet: effectParams.reverbMix
      }).connect(delay);

      const distortion = new Tone.Distortion({
        distortion: effectParams.distortion / 100,
        wet: 1
      }).connect(reverb);

      const phaser = new Tone.Phaser({
        frequency: effectParams.phaserFreq,
        octaves: 3,
        wet: 1
      }).connect(distortion);

      const flanger = new Tone.FeedbackDelay({
        delayTime: 0.005,
        feedback: effectParams.flangerDepth
      }).connect(phaser);

      // Connect synth to effects chain
      synth.disconnect();
      synth.chain(flanger, Tone.Destination);

      // Store refs
      filterRef.current = filter;
      delayRef.current = delay;
      reverbRef.current = reverb;
      distortionRef.current = distortion;
      phaserRef.current = phaser;
      flangerRef.current = flanger;

      toast.success("Effects initialized");

      return () => {
        filter.dispose();
        delay.dispose();
        reverb.dispose();
        distortion.dispose();
        phaser.dispose();
        flanger.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize effects:', error);
      toast.error("Failed to initialize effects");
    }
  }, [synth]);

  // Update effect parameters when they change
  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.frequency.value = effectParams.filterFreq;
      filterRef.current.Q.value = effectParams.filterRes;
    }
    if (delayRef.current) {
      delayRef.current.delayTime.value = effectParams.delayTime;
      delayRef.current.feedback.value = effectParams.delayFeedback;
    }
    if (reverbRef.current) {
      reverbRef.current.wet.value = effectParams.reverbMix;
    }
    if (distortionRef.current) {
      distortionRef.current.distortion = effectParams.distortion / 100;
    }
    if (phaserRef.current) {
      phaserRef.current.frequency.value = effectParams.phaserFreq;
    }
    if (flangerRef.current) {
      flangerRef.current.feedback.value = effectParams.flangerDepth;
    }
  }, [effectParams]);

  return null;
};

export default EffectProcessor;