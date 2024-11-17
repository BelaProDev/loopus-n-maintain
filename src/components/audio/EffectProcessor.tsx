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
  const effects = useRef({
    filter: new Tone.Filter(),
    delay: new Tone.FeedbackDelay(),
    reverb: new Tone.Reverb(),
    distortion: new Tone.Distortion(),
    phaser: new Tone.Phaser(),
    flanger: new Tone.FeedbackDelay()
  });

  useEffect(() => {
    if (!synth) return;

    // Connect effects chain
    synth.chain(
      effects.current.flanger,
      effects.current.phaser,
      effects.current.distortion,
      effects.current.reverb,
      effects.current.delay,
      effects.current.filter,
      Tone.Destination
    );

    return () => {
      Object.values(effects.current).forEach(effect => {
        effect.dispose();
      });
    };
  }, [synth]);

  useEffect(() => {
    // Update effect parameters
    effects.current.filter.frequency.value = effectParams.filterFreq;
    effects.current.filter.Q.value = effectParams.filterRes;
    effects.current.delay.delayTime.value = effectParams.delayTime;
    effects.current.delay.feedback.value = effectParams.delayFeedback;
    effects.current.reverb.wet.value = effectParams.reverbMix;
    effects.current.distortion.distortion = effectParams.distortion / 100;
    effects.current.phaser.frequency.value = effectParams.phaserFreq;
    effects.current.flanger.delayTime.value = 0.005;
    effects.current.flanger.feedback.value = effectParams.flangerDepth;
  }, [effectParams]);

  return null;
};

export default EffectProcessor;