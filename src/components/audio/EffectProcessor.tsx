import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

interface EffectProcessorProps {
  synth: Tone.PolySynth | null;
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

    // Initialize effects with larger buffer sizes
    filterRef.current = new Tone.Filter({
      frequency: effectParams.filterFreq,
      Q: effectParams.filterRes,
      type: "lowpass",
      rolloff: -24
    }).toDestination();

    delayRef.current = new Tone.FeedbackDelay({
      delayTime: effectParams.delayTime,
      feedback: effectParams.delayFeedback,
      maxDelay: 4
    }).connect(filterRef.current);

    reverbRef.current = new Tone.Reverb({
      decay: 2,
      wet: effectParams.reverbMix,
      preDelay: 0.1
    }).connect(delayRef.current);

    distortionRef.current = new Tone.Distortion({
      distortion: effectParams.distortion / 100,
      oversample: "4x"
    }).connect(reverbRef.current);

    phaserRef.current = new Tone.Phaser({
      frequency: effectParams.phaserFreq,
      octaves: 3,
      baseFrequency: 1000
    }).connect(distortionRef.current);

    flangerRef.current = new Tone.FeedbackDelay({
      delayTime: 0.005,
      feedback: effectParams.flangerDepth,
      maxDelay: 0.02
    }).connect(phaserRef.current);

    // Connect synth to effect chain
    synth.chain(
      flangerRef.current,
      phaserRef.current,
      distortionRef.current,
      reverbRef.current,
      delayRef.current,
      filterRef.current,
      Tone.Destination
    );

    return () => {
      [filterRef, delayRef, reverbRef, distortionRef, phaserRef, flangerRef].forEach(ref => {
        ref.current?.dispose();
      });
    };
  }, [synth]);

  return null;
};

export default EffectProcessor;