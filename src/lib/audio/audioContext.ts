import * as Tone from 'tone';

let audioContext: AudioContext | null = null;

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    Tone.setContext(audioContext);
  }
  return audioContext;
};

export const initializeAudio = async () => {
  const context = getAudioContext();
  if (context.state !== 'running') {
    await context.resume();
  }
  await Tone.start();
  return context;
};

export const createBufferLoader = async (url: string) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await Tone.context.decodeAudioData(arrayBuffer);
};