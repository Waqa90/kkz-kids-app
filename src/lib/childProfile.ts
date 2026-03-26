// Child profile — subjects, session storage, class helpers

// ── Subject definitions ───────────────────────────────────────────────────────

export type SubjectKey =
  | 'english'
  | 'maths'
  | 'science'
  | 'social-studies'
  | 'healthy-living'
  | 'mce'
  | 'fijian';

export const SUBJECT_META: Record<SubjectKey, {
  label: string;
  emoji: string;
  color: string;
  levelColor: string;
  description: string;
}> = {
  english:          { label: 'English',            emoji: '📖', color: 'bg-blue-100',    levelColor: 'bg-blue-200 text-blue-800',    description: 'Stories, reading & writing' },
  maths:            { label: 'Maths',              emoji: '🔢', color: 'bg-green-100',   levelColor: 'bg-green-200 text-green-800',  description: 'Numbers & problem solving' },
  science:          { label: 'Elementary Science', emoji: '🔬', color: 'bg-yellow-100',  levelColor: 'bg-yellow-200 text-yellow-800', description: 'Nature, plants & animals' },
  'social-studies': { label: 'Social Studies',     emoji: '🌏', color: 'bg-orange-100',  levelColor: 'bg-orange-200 text-orange-800', description: 'Community, Fiji & the world' },
  'healthy-living': { label: 'Healthy Living',     emoji: '🥦', color: 'bg-teal-100',    levelColor: 'bg-teal-200 text-teal-800',    description: 'Health, food & wellbeing' },
  mce:              { label: 'MCE',                emoji: '🤝', color: 'bg-pink-100',    levelColor: 'bg-pink-200 text-pink-800',    description: 'Good values & behaviour' },
  fijian:           { label: 'Fijian',             emoji: '🌺', color: 'bg-purple-100',  levelColor: 'bg-purple-200 text-purple-800', description: 'Fijian language & culture' },
};

// ── Per-child subject lists ───────────────────────────────────────────────────

export const SUBJECTS_BY_CHILD: Record<string, SubjectKey[]> = {
  Karawa: ['maths', 'english', 'science', 'social-studies', 'healthy-living'],
  Zech:   ['maths', 'english', 'mce', 'fijian'],
  Kitty:  ['english', 'maths', 'science', 'social-studies', 'healthy-living', 'fijian'],
};

// ── Child class & level helpers ───────────────────────────────────────────────

export const CHILD_NAMES = ['Kitty', 'Karawa', 'Zech'] as const;
export type ChildName = typeof CHILD_NAMES[number];
export type ChildClass = 3 | 4 | 5;

// Default classes — overridden by ParentSettings at runtime
export const DEFAULT_CHILD_CLASSES: Record<ChildName, ChildClass> = {
  Zech: 3, Kitty: 4, Karawa: 5,
};

// Keep backward compat alias
export const CHILD_CLASSES = DEFAULT_CHILD_CLASSES;

export const CLASS_ALLOWED_LEVELS: Record<ChildClass, string[]> = {
  3: ['Easy', 'Fun', 'Medium'],
  4: ['Easy', 'Fun', 'Medium'],
  5: ['Medium', 'Fun', 'Hard'],
};

// sessionStorage key — clears when browser tab closes
const CHILD_SESSION_KEY = 'kkz_active_child';

export function getChildClass(name: ChildName): ChildClass {
  return DEFAULT_CHILD_CLASSES[name];
}

export function getAllowedLevels(name: ChildName): string[] {
  return CLASS_ALLOWED_LEVELS[DEFAULT_CHILD_CLASSES[name]];
}

export function getSelectedChild(): ChildName | null {
  if (typeof window === 'undefined') return null;
  const val = sessionStorage.getItem(CHILD_SESSION_KEY);
  if (val && CHILD_NAMES.includes(val as ChildName)) return val as ChildName;
  return null;
}

export function setSelectedChild(name: ChildName): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(CHILD_SESSION_KEY, name);
}

export function clearSelectedChild(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CHILD_SESSION_KEY);
}
