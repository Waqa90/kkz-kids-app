/**
 * Kitty Reading — Sound Effects
 * All sounds are generated via Web Audio API (no external files needed).
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

/** Play a short tone burst */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  delay = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration + 0.05);
}

/** Playful "pop" sound when tapping a word */
export function playWordTapSound(): void {
  playTone(880, 0.08, 'sine', 0.25);
  playTone(1100, 0.06, 'sine', 0.15, 0.06);
}

/** Gentle chime when reading a sentence */
export function playSentenceReadSound(): void {
  playTone(523, 0.12, 'sine', 0.2);       // C5
  playTone(659, 0.12, 'sine', 0.2, 0.1);  // E5
  playTone(784, 0.15, 'sine', 0.2, 0.2);  // G5
}

/** Happy "ding" for a correct answer */
export function playCorrectSound(): void {
  playTone(523, 0.1, 'sine', 0.3);        // C5
  playTone(659, 0.1, 'sine', 0.3, 0.1);  // E5
  playTone(784, 0.1, 'sine', 0.3, 0.2);  // G5
  playTone(1047, 0.2, 'sine', 0.3, 0.3); // C6
}

/** Low "buzz" for a wrong answer */
export function playWrongSound(): void {
  playTone(220, 0.15, 'sawtooth', 0.2);
  playTone(196, 0.2, 'sawtooth', 0.15, 0.15);
}

/** Celebratory fanfare for great achievement (perfect or high score) */
export function playAchievementSound(): void {
  // Ascending arpeggio + final chord
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => {
    playTone(freq, 0.18, 'sine', 0.28, i * 0.1);
  });
  // Final sparkle
  playTone(2093, 0.3, 'sine', 0.2, notes.length * 0.1);
  playTone(1760, 0.3, 'sine', 0.15, notes.length * 0.1 + 0.05);
}

/** Encouraging sound for completing quiz (not perfect) */
export function playGoodJobSound(): void {
  playTone(523, 0.12, 'sine', 0.25);
  playTone(659, 0.12, 'sine', 0.25, 0.12);
  playTone(784, 0.2, 'sine', 0.25, 0.24);
}

/** Soft "pop" for number pad taps */
export function playNumberTapSound(): void {
  playTone(660, 0.05, 'sine', 0.18);
}

/** Brighter correct sound for Maths */
export function playMathsCorrectSound(): void {
  playTone(659, 0.08, 'sine', 0.3);
  playTone(880, 0.08, 'sine', 0.3, 0.08);
  playTone(1047, 0.15, 'sine', 0.3, 0.16);
}

/** Fanfare for completing a maths set */
export function playMathsCompleteSound(): void {
  const notes = [523, 659, 784, 1047, 784, 1047, 1319];
  notes.forEach((freq, i) => playTone(freq, 0.15, 'sine', 0.28, i * 0.09));
}

/** Subtle tick between questions */
export function playMathsTickSound(): void {
  playTone(440, 0.04, 'sine', 0.12);
}
