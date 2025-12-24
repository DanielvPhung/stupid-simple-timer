export const playBeep = () => {
  const AudioContext =
    window.AudioContext || (window as any).webkitAudioContext;

  const ctx = new AudioContext();

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";      // clean beep
  oscillator.frequency.value = 880; // Hz (A5)

  gain.gain.value = 0.05; // volume (keep low)

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();

  // stop after 150ms
  oscillator.stop(ctx.currentTime + 0.15);

  oscillator.onended = () => {
    ctx.close();
  };
};

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};