import * as Tone from 'tone';

export const initializeAudio = async () => {
  try {
    await Tone.start();
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }
    await Tone.loaded();
    return Tone.context;
  } catch (error) {
    console.error('Failed to initialize audio context:', error);
    throw error;
  }
};

export const createAudioBuffer = async (url: string) => {
  try {
    return await Tone.Buffer.fromUrl(url);
  } catch (error) {
    console.error('Failed to load audio buffer:', error);
    throw error;
  }
};