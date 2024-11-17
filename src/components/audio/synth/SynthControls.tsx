import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import OscillatorControls from './OscillatorControls';
import EnvelopeControls from './EnvelopeControls';
import FilterControls from './FilterControls';

interface SynthControlsProps {
  synth: Tone.Synth | null;
}

type BasicOscillatorType = "sine" | "square" | "triangle" | "sawtooth";

const SynthControls = ({ synth }: SynthControlsProps) => {
  const [oscillatorType, setOscillatorType] = useState<BasicOscillatorType>("sine");
  const [oscillatorFreq, setOscillatorFreq] = useState(440);
  const [oscillatorDetune, setOscillatorDetune] = useState(0);
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(1);
  const [filterType, setFilterType] = useState<BiquadFilterType>("lowpass");
  const [filterFreq, setFilterFreq] = useState(1000);
  const [filterRes, setFilterRes] = useState(1);

  useEffect(() => {
    if (synth) {
      synth.set({
        oscillator: {
          type: oscillatorType
        } as Partial<Tone.OmniOscillatorOptions>,
        envelope: { 
          attack, 
          decay, 
          sustain, 
          release 
        }
      });
    }
  }, [synth, oscillatorType, attack, decay, sustain, release]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <OscillatorControls
        type={oscillatorType}
        frequency={oscillatorFreq}
        detune={oscillatorDetune}
        onTypeChange={(value) => setOscillatorType(value as BasicOscillatorType)}
        onFrequencyChange={setOscillatorFreq}
        onDetuneChange={setOscillatorDetune}
      />
      
      <EnvelopeControls
        attack={attack}
        decay={decay}
        sustain={sustain}
        release={release}
        onAttackChange={setAttack}
        onDecayChange={setDecay}
        onSustainChange={setSustain}
        onReleaseChange={setRelease}
      />
      
      <FilterControls
        type={filterType}
        frequency={filterFreq}
        resonance={filterRes}
        onTypeChange={(value) => setFilterType(value as BiquadFilterType)}
        onFrequencyChange={setFilterFreq}
        onResonanceChange={setFilterRes}
      />
    </div>
  );
};

export default SynthControls;