import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Music, Play, Pause, Square, Mic, Volume2, VolumeX,
  ArrowLeft, Waves, Radio, Disc, Settings, Download
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AudioStudio = () => {
  const { t } = useTranslation(["tools"]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [bpm, setBpm] = useState([120]);
  const [waveform, setWaveform] = useState<"sine" | "square" | "sawtooth" | "triangle">("sine");
  const [frequency, setFrequency] = useState([440]);
  const [attack, setAttack] = useState([0.1]);
  const [decay, setDecay] = useState([0.3]);
  const [sustain, setSustain] = useState([0.7]);
  const [release, setRelease] = useState([0.5]);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [delayEnabled, setDelayEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Drum sequencer state
  const [drumPattern, setDrumPattern] = useState<boolean[][]>([
    Array(16).fill(false), // Kick
    Array(16).fill(false), // Snare
    Array(16).fill(false), // Hi-hat
    Array(16).fill(false), // Clap
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const drumNames = ["Kick", "Snare", "Hi-hat", "Clap"];

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const startOscillator = () => {
    initAudio();
    if (audioContextRef.current && gainNodeRef.current) {
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = waveform;
      oscillatorRef.current.frequency.setValueAtTime(frequency[0], audioContextRef.current.currentTime);
      oscillatorRef.current.connect(gainNodeRef.current);
      
      // Apply ADSR envelope
      const now = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setValueAtTime(0, now);
      gainNodeRef.current.gain.linearRampToValueAtTime((volume[0] / 100) * (isMuted ? 0 : 1), now + attack[0]);
      gainNodeRef.current.gain.linearRampToValueAtTime((volume[0] / 100) * sustain[0] * (isMuted ? 0 : 1), now + attack[0] + decay[0]);
      
      oscillatorRef.current.start();
      setIsPlaying(true);
      drawWaveform();
    }
  };

  const stopOscillator = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.linearRampToValueAtTime(0, now + release[0]);
      setTimeout(() => {
        oscillatorRef.current?.stop();
        oscillatorRef.current = null;
        setIsPlaying(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }, release[0] * 1000);
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current?.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'hsl(var(--background))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        const hue = (i / bufferLength) * 120 + 200;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  const toggleDrumStep = (drumIndex: number, stepIndex: number) => {
    const newPattern = [...drumPattern];
    newPattern[drumIndex] = [...newPattern[drumIndex]];
    newPattern[drumIndex][stepIndex] = !newPattern[drumIndex][stepIndex];
    setDrumPattern(newPattern);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? "Recording stopped" : "Recording started");
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.type = waveform;
    }
  }, [waveform]);

  useEffect(() => {
    if (oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequency[0], audioContextRef.current.currentTime);
    }
  }, [frequency]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        (volume[0] / 100) * (isMuted ? 0 : 1),
        audioContextRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tools">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Music className="h-8 w-8 text-primary" />
              Audio Studio
            </h1>
            <p className="text-muted-foreground">Create and mix audio with professional tools</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <Tabs defaultValue="synth" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="synth" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Synthesizer
            </TabsTrigger>
            <TabsTrigger value="drums" className="flex items-center gap-2">
              <Disc className="h-4 w-4" />
              Drum Machine
            </TabsTrigger>
            <TabsTrigger value="recorder" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Recorder
            </TabsTrigger>
          </TabsList>

          {/* Synthesizer Tab */}
          <TabsContent value="synth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Oscillator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5" />
                    Oscillator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Waveform</Label>
                    <Select value={waveform} onValueChange={(v: any) => setWaveform(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sine">Sine</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="sawtooth">Sawtooth</SelectItem>
                        <SelectItem value="triangle">Triangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Frequency</Label>
                      <span className="text-sm text-muted-foreground">{frequency[0]} Hz</span>
                    </div>
                    <Slider
                      value={frequency}
                      onValueChange={setFrequency}
                      min={20}
                      max={2000}
                      step={1}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={isPlaying ? stopOscillator : startOscillator}
                      variant={isPlaying ? "destructive" : "default"}
                    >
                      {isPlaying ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isPlaying ? "Stop" : "Play"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ADSR Envelope */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    ADSR Envelope
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Attack</Label>
                      <span className="text-sm text-muted-foreground">{attack[0].toFixed(2)}s</span>
                    </div>
                    <Slider value={attack} onValueChange={setAttack} min={0} max={2} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Decay</Label>
                      <span className="text-sm text-muted-foreground">{decay[0].toFixed(2)}s</span>
                    </div>
                    <Slider value={decay} onValueChange={setDecay} min={0} max={2} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Sustain</Label>
                      <span className="text-sm text-muted-foreground">{Math.round(sustain[0] * 100)}%</span>
                    </div>
                    <Slider value={sustain} onValueChange={setSustain} min={0} max={1} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Release</Label>
                      <span className="text-sm text-muted-foreground">{release[0].toFixed(2)}s</span>
                    </div>
                    <Slider value={release} onValueChange={setRelease} min={0} max={3} step={0.01} />
                  </div>
                </CardContent>
              </Card>

              {/* Effects & Volume */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Volume</Label>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      min={0}
                      max={100}
                      disabled={isMuted}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Reverb</Label>
                      <Switch checked={reverbEnabled} onCheckedChange={setReverbEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Delay</Label>
                      <Switch checked={delayEnabled} onCheckedChange={setDelayEnabled} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visualizer */}
            <Card>
              <CardHeader>
                <CardTitle>Frequency Visualizer</CardTitle>
              </CardHeader>
              <CardContent>
                <canvas 
                  ref={canvasRef} 
                  width={800} 
                  height={200} 
                  className="w-full rounded-lg bg-background border"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drum Machine Tab */}
          <TabsContent value="drums" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Drum Sequencer</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label>BPM</Label>
                      <span className="font-mono text-lg font-bold">{bpm[0]}</span>
                    </div>
                    <Slider
                      value={bpm}
                      onValueChange={setBpm}
                      min={60}
                      max={200}
                      className="w-32"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drumPattern.map((row, drumIndex) => (
                    <div key={drumIndex} className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium text-right">
                        {drumNames[drumIndex]}
                      </div>
                      <div className="flex gap-1">
                        {row.map((active, stepIndex) => (
                          <motion.button
                            key={stepIndex}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleDrumStep(drumIndex, stepIndex)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${
                              active 
                                ? 'bg-primary border-primary' 
                                : 'bg-muted/50 border-border hover:border-primary/50'
                            } ${currentStep === stepIndex ? 'ring-2 ring-primary ring-offset-2' : ''} ${
                              stepIndex % 4 === 0 ? 'ml-2' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <Button size="lg" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setDrumPattern(drumPattern.map(() => Array(16).fill(false)))}>
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recorder Tab */}
          <TabsContent value="recorder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Audio Recorder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className={`w-32 h-32 rounded-full flex items-center justify-center ${
                      isRecording ? 'bg-red-500' : 'bg-muted'
                    }`}
                  >
                    <Mic className={`h-12 w-12 ${isRecording ? 'text-white' : 'text-muted-foreground'}`} />
                  </motion.div>

                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      variant={isRecording ? "destructive" : "default"}
                      onClick={handleRecord}
                    >
                      {isRecording ? <Square className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  </div>

                  <p className="text-muted-foreground text-center max-w-md">
                    Click the button above to start recording audio from your microphone. 
                    Recordings will be saved and can be exported in various formats.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AudioStudio;