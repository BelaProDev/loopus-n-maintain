import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

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

  useEffect(() => {
    if (!synth) return;

    // Create basic effects
    const filter = new Tone.Filter(effectParams.filterFreq, "lowpass").toDestination();
    const delay = new Tone.FeedbackDelay(effectParams.delayTime, effectParams.delayFeedback).toDestination();

    // Simple chain
    synth.chain(filter, delay, Tone.Destination);

    filterRef.current = filter;
    delayRef.current = delay;

    return () => {
      filter.dispose();
      delay.dispose();
    };
  }, [synth]);

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.frequency.value = effectParams.filterFreq;
    }
    if (delayRef.current) {
      delayRef.current.delayTime.value = effectParams.delayTime;
      delayRef.current.feedback.value = effectParams.delayFeedback;
    }
  }, [effectParams]);

  return null;
};

export default EffectProcessor;