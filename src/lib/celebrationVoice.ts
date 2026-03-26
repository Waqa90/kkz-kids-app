/**
 * Celebration Voice Messages
 * Plays personalized spoken praise when a child achieves a perfect or near-perfect score.
 * Uses the browser's Speech Synthesis API (same as speech.ts).
 */

import { speak } from '@/lib/speech';

type ActivityType = 'questions' | 'fill-blanks' | 'word-match' | 'rhyme-match';

// Personalized praise templates per child name
// {name} is replaced with the child's name at runtime
const PERFECT_MESSAGES: Record<string, string[]> = {
  Kitty: [
    'Amazing job, Kitty! You got every single one right! You are a superstar reader!',
    'Wow, Kitty! Perfect score! You are so clever and brilliant!',
    'Kitty, you did it! Every answer was correct! You make me so proud!',
    'Incredible, Kitty! A perfect score! You are a reading champion!',
    'Kitty, you are unstoppable! Perfect score! Keep shining bright!',
  ],
  Karawa: [
    'Amazing job, Karawa! You got every single one right! You are a superstar reader!',
    'Wow, Karawa! Perfect score! You are so clever and brilliant!',
    'Karawa, you did it! Every answer was correct! You make me so proud!',
    'Incredible, Karawa! A perfect score! You are a reading champion!',
    'Karawa, you are unstoppable! Perfect score! Keep shining bright!',
  ],
  Zech: [
    'Amazing job, Zech! You got every single one right! You are a superstar reader!',
    'Wow, Zech! Perfect score! You are so clever and brilliant!',
    'Zech, you did it! Every answer was correct! You make me so proud!',
    'Incredible, Zech! A perfect score! You are a reading champion!',
    'Zech, you are unstoppable! Perfect score! Keep shining bright!',
  ],
};

const NEAR_PERFECT_MESSAGES: Record<string, string[]> = {
  Kitty: [
    'Great work, Kitty! You did really well! Almost perfect — keep it up!',
    'Well done, Kitty! You are doing so great! Just a little more practice and you will be perfect!',
    'Kitty, that was fantastic! You are getting better and better every time!',
    'Super effort, Kitty! You should be very proud of yourself!',
  ],
  Karawa: [
    'Great work, Karawa! You did really well! Almost perfect — keep it up!',
    'Well done, Karawa! You are doing so great! Just a little more practice and you will be perfect!',
    'Karawa, that was fantastic! You are getting better and better every time!',
    'Super effort, Karawa! You should be very proud of yourself!',
  ],
  Zech: [
    'Great work, Zech! You did really well! Almost perfect — keep it up!',
    'Well done, Zech! You are doing so great! Just a little more practice and you will be perfect!',
    'Zech, that was fantastic! You are getting better and better every time!',
    'Super effort, Zech! You should be very proud of yourself!',
  ],
};

// Activity-specific bonus phrases appended to the message
const ACTIVITY_BONUS: Record<ActivityType, string> = {
  'questions': 'You understood the story so well!',
  'fill-blanks': 'You filled in every blank perfectly!',
  'word-match': 'You matched all the words like a pro!',
  'rhyme-match': 'You found all the rhymes — what a poet!',
};

// Generic fallback messages when child name is not one of the three
const GENERIC_PERFECT = [
  'Amazing! You got every single one right! You are a superstar reader!',
  'Wow! Perfect score! You are so clever and brilliant!',
  'You did it! Every answer was correct! Incredible work!',
];

const GENERIC_NEAR_PERFECT = [
  'Great work! You did really well! Almost perfect — keep it up!',
  'Well done! You are doing so great! Keep practising!',
  'Fantastic effort! You should be very proud of yourself!',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Speak a personalized celebration message after a delay (to let sound effects finish first).
 *
 * @param childName  - The selected child's name (Kitty, Karawa, or Zech)
 * @param score      - Number of correct answers
 * @param total      - Total possible answers
 * @param activity   - Which activity was completed
 * @param delayMs    - Milliseconds to wait before speaking (default 1200ms)
 */
export function playCelebrationVoice(
  childName: string | undefined,
  score: number,
  total: number,
  activity: ActivityType,
  delayMs = 1200
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (total === 0) return;

  const isPerfect = score === total;
  const isNearPerfect = !isPerfect && score / total >= 0.8;

  if (!isPerfect && !isNearPerfect) return;

  const name = childName?.trim() ?? '';
  const knownNames = ['Kitty', 'Karawa', 'Zech'];
  const isKnown = knownNames.includes(name);

  let baseMessage: string;
  if (isPerfect) {
    baseMessage = isKnown
      ? pickRandom(PERFECT_MESSAGES[name])
      : pickRandom(GENERIC_PERFECT);
  } else {
    baseMessage = isKnown
      ? pickRandom(NEAR_PERFECT_MESSAGES[name])
      : pickRandom(GENERIC_NEAR_PERFECT);
  }

  // Append activity-specific bonus only for perfect scores
  const bonus = isPerfect ? ` ${ACTIVITY_BONUS[activity]}` : '';
  const fullMessage = `${baseMessage}${bonus}`;

  setTimeout(() => {
    speak(fullMessage, { rate: 0.95, pitch: 1.2, volume: 1.0 });
  }, delayMs);
}

// ── Maths-specific celebration messages ───────────────────────────────────────

const MATHS_PERFECT_MESSAGES: Record<string, string[]> = {
  Kitty: [
    'Amazing maths, Kitty! Every answer was correct! You are a maths superstar!',
    'Wow Kitty! Perfect score in maths! You are so clever with numbers!',
    'Kitty you solved every single problem! You are a brilliant mathematician!',
  ],
  Karawa: [
    'Incredible maths, Karawa! Perfect score! Numbers love you!',
    'Karawa you got every maths answer right! You are unstoppable!',
    'Amazing work Karawa! A perfect maths score! You make me so proud!',
  ],
  Zech: [
    'Fantastic maths Zech! Every answer correct! You are a number genius!',
    'Wow Zech! Perfect maths score! You are so amazing at numbers!',
    'Zech you solved every problem! You are a brilliant maths champion!',
  ],
};

const MATHS_GOOD_MESSAGES: Record<string, string[]> = {
  Kitty: [
    'Great maths work, Kitty! You are getting so good with numbers!',
    'Well done Kitty! Your maths skills are growing every day!',
    'Kitty, that was fantastic maths! Keep practising and you will be perfect!',
  ],
  Karawa: [
    'Great maths, Karawa! You are doing really well with numbers!',
    'Well done Karawa! Your maths is getting better and better!',
    'Karawa, fantastic effort in maths! Keep it up!',
  ],
  Zech: [
    'Great maths work, Zech! You are so good with numbers!',
    'Well done Zech! Your maths skills are amazing!',
    'Zech, brilliant maths effort! You should be very proud!',
  ],
};

/**
 * Speak a personalized maths celebration message.
 */
export function playCelebrationVoiceForMaths(
  childName: string | undefined,
  score: number,
  total: number,
  delayMs = 1200
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (total === 0) return;

  const isPerfect = score === total;
  const isNearPerfect = !isPerfect && score / total >= 0.8;

  if (!isPerfect && !isNearPerfect) return;

  const name = childName?.trim() ?? '';
  const isKnown = ['Kitty', 'Karawa', 'Zech'].includes(name);

  let message: string;
  if (isPerfect) {
    message = isKnown ? pickRandom(MATHS_PERFECT_MESSAGES[name]) : pickRandom(GENERIC_PERFECT);
  } else {
    message = isKnown ? pickRandom(MATHS_GOOD_MESSAGES[name]) : pickRandom(GENERIC_NEAR_PERFECT);
  }

  setTimeout(() => {
    speak(message, { rate: 0.95, pitch: 1.2, volume: 1.0 });
  }, delayMs);
}
