let audio: HTMLAudioElement | null = null;

/**
 * Plays the beep sound.
 * Safe to call multiple times.
 */
export function playBeep(): void {
  try {
    // Reuse the same Audio instance to avoid mobile bugs
    if (!audio) {
      audio = new Audio("/beep.mp3");
      audio.preload = "auto";
    }

    // Restart from beginning every time
    audio.currentTime = 0;

    const playPromise = audio.play();

    // Handle browsers that block autoplay
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // ignored — requires user interaction first
      });
    }
  } catch {
    // no-op
  }
}


export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function vibrateOnce(durationMs: number = 500): void {
  if (!("vibrate" in navigator)) return;

  navigator.vibrate(durationMs);
}