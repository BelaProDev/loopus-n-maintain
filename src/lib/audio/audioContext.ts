import * as Tone from 'tone';

let audioContext: AudioContext | null = null;

export const getAudioContext = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    await Tone.start();
    Tone.setContext(audioContext);
  }
  return audioContext;
};

export const initializeAudio = async () => {
  const context = await getAudioContext();
  if (context.state !== 'running') {
    await context.resume();
  }
  await Tone.loaded();
  return context;
};

export const disposeAudioContext = () => {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
};

export const createBufferLoader = async (url: string) => {
  const context = await getAudioContext();
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await context.decodeAudioData(arrayBuffer);
};