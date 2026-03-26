'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SUBJECTS_BY_CHILD } from '@/lib/childProfile';

// ── Storage keys ──────────────────────────────────────────────────────────────
const SETTINGS_KEY = 'kitty_parent_settings';

export interface ChildProfileData {
  name: string;
  emoji: string;
  photoUrl: string | null;
  class: 3 | 4 | 5;
}

export interface ChildControls {
  soundEnabled: boolean;
  subjectEnabled: Record<string, boolean>;
  dailyTimeLimitMinutes: number | null;
  showHints: boolean;
}

export interface ParentSettings {
  username: string;
  pin: string;
  children: Record<string, ChildProfileData>;
  childControls: Record<string, ChildControls>;
  globalSoundEnabled: boolean;
}

const DEFAULT_CHILDREN: Record<string, ChildProfileData> = {
  Kitty:  { name: 'Kitty',  emoji: '🐱', photoUrl: '/assets/images/kitty-1774338561653.PNG',  class: 4 },
  Karawa: { name: 'Karawa', emoji: '🦊', photoUrl: '/assets/images/karawa-1774337018022.PNG', class: 5 },
  Zech:   { name: 'Zech',   emoji: '🦁', photoUrl: '/assets/images/Zech-1774338328208.PNG',   class: 3 },
};

function defaultControls(childKey: string): ChildControls {
  const subjects = SUBJECTS_BY_CHILD[childKey] ?? [];
  const subjectEnabled: Record<string, boolean> = {};
  subjects.forEach((s) => { subjectEnabled[s] = true; });
  return { soundEnabled: true, subjectEnabled, dailyTimeLimitMinutes: null, showHints: true };
}

export function loadParentSettings(): ParentSettings {
  if (typeof window === 'undefined') {
    return {
      username: 'Waqa',
      pin: '1234',
      children: DEFAULT_CHILDREN,
      childControls: Object.fromEntries(Object.keys(DEFAULT_CHILDREN).map((k) => [k, defaultControls(k)])),
      globalSoundEnabled: true,
    };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ParentSettings>;
      const children: Record<string, ChildProfileData> = {};
      Object.entries(DEFAULT_CHILDREN).forEach(([key, def]) => {
        const saved = parsed.children?.[key];
        children[key] = saved ? { ...def, ...saved } : { ...def };
      });
      // Include any extra children added by parent
      if (parsed.children) {
        Object.entries(parsed.children).forEach(([key, val]) => {
          if (!children[key]) children[key] = val as ChildProfileData;
        });
      }
      const childControls: Record<string, ChildControls> = {};
      Object.keys(children).forEach((key) => {
        const saved = parsed.childControls?.[key];
        childControls[key] = saved ? { ...defaultControls(key), ...saved } : defaultControls(key);
      });
      return {
        username: parsed.username || 'Waqa',
        pin: parsed.pin || '1234',
        children,
        childControls,
        globalSoundEnabled: parsed.globalSoundEnabled !== false,
      };
    }
  } catch { /* ignore */ }
  return {
    username: 'Waqa',
    pin: '1234',
    children: { ...DEFAULT_CHILDREN },
    childControls: Object.fromEntries(Object.keys(DEFAULT_CHILDREN).map((k) => [k, defaultControls(k)])),
    globalSoundEnabled: true,
  };
}

export function saveParentSettings(settings: ParentSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ── Helper exports ────────────────────────────────────────────────────────────

export function getChildControls(name: string): ChildControls {
  const s = loadParentSettings();
  return s.childControls[name] ?? defaultControls(name);
}

export function isSubjectEnabled(childName: string, subject: string): boolean {
  const controls = getChildControls(childName);
  const globalOk = loadParentSettings().globalSoundEnabled !== false;
  // subjectEnabled check — if key missing, default to true
  return controls.subjectEnabled[subject] !== false;
}

export function getChildClassFromSettings(name: string): 3 | 4 | 5 {
  const s = loadParentSettings();
  return s.children[name]?.class ?? 4;
}

// ── Emoji options ─────────────────────────────────────────────────────────────
const EMOJI_OPTIONS = ['🐱', '🦊', '🦁', '🐶', '🐸', '🐼', '🦄', '🐯', '🐻', '🦋', '🐨', '🐮', '🦉', '🐺', '🦅'];

const SUBJECT_LABELS: Record<string, string> = {
  english: '📖 English', maths: '🔢 Maths', science: '🔬 Science',
  'social-studies': '🌏 Social Studies', 'healthy-living': '🥦 Healthy Living',
  mce: '🤝 MCE', fijian: '🌺 Fijian',
};

const TIME_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: '⏱ Unlimited', value: null },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface SettingsPanelProps {
  onClose: () => void;
  onSave?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SettingsPanel({ onClose, onSave }: SettingsPanelProps) {
  const [settings, setSettings] = useState<ParentSettings>(() => loadParentSettings());
  const [activeTab, setActiveTab] = useState<'children' | 'subjects' | 'controls' | 'parent'>('children');
  const [savedMsg, setSavedMsg] = useState('');
  const [expandedControls, setExpandedControls] = useState<string | null>(null);

  // Parent profile edit state
  const [newUsername, setNewUsername] = useState(settings.username);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Child edit state
  const [childEdits, setChildEdits] = useState<Record<string, ChildProfileData>>(() => {
    const copy: Record<string, ChildProfileData> = {};
    Object.entries(settings.children).forEach(([key, val]) => { copy[key] = { ...val }; });
    return copy;
  });

  // Add child state
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState<ChildProfileData>({ name: '', emoji: '🐱', photoUrl: null, class: 3 });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const newChildFileRef = useRef<HTMLInputElement | null>(null);

  const showSaved = (msg = 'Saved!') => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const notifySettingsChanged = () => {
    window.dispatchEvent(new Event('kitty_settings_changed'));
    onSave?.();
  };

  // ── Save helpers ──────────────────────────────────────────────────────────
  const persistSettings = (updated: ParentSettings, msg?: string) => {
    setSettings(updated);
    saveParentSettings(updated);
    notifySettingsChanged();
    if (msg) showSaved(msg);
  };

  const handleSaveChildren = () => {
    persistSettings({ ...settings, children: { ...childEdits } }, 'Child profiles saved!');
  };

  const handleAddChild = () => {
    if (!newChild.name.trim()) return;
    const key = newChild.name.trim();
    const updatedChildren = { ...settings.children, [key]: { ...newChild, name: key } };
    const updatedControls = { ...settings.childControls, [key]: defaultControls(key) };
    const updated = { ...settings, children: updatedChildren, childControls: updatedControls };
    setChildEdits({ ...childEdits, [key]: { ...newChild, name: key } });
    persistSettings(updated, `${key} added!`);
    setNewChild({ name: '', emoji: '🐱', photoUrl: null, class: 3 });
    setShowAddChild(false);
  };

  const handleDeleteChild = (key: string) => {
    const { [key]: _c, ...restChildren } = settings.children;
    const { [key]: _ct, ...restControls } = settings.childControls;
    const { [key]: _e, ...restEdits } = childEdits;
    const updated = { ...settings, children: restChildren, childControls: restControls };
    setChildEdits(restEdits);
    persistSettings(updated, `${key} removed.`);
    setDeleteConfirm(null);
  };

  const handleSaveParent = () => {
    setPinError('');
    if (!newUsername.trim()) return;
    if (newPin) {
      if (!/^\d{4,6}$/.test(newPin)) { setPinError('PIN must be 4–6 digits.'); return; }
      if (newPin !== confirmPin) { setPinError('PINs do not match.'); return; }
    }
    persistSettings({
      ...settings,
      username: newUsername.trim(),
      pin: newPin ? newPin : settings.pin,
    }, 'Parent profile saved!');
    setNewPin('');
    setConfirmPin('');
  };

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoChange = (childKey: string, file: File, isNew = false) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (isNew) {
        setNewChild((prev) => ({ ...prev, photoUrl: dataUrl }));
      } else {
        setChildEdits((prev) => ({ ...prev, [childKey]: { ...prev[childKey], photoUrl: dataUrl } }));
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Controls helpers ──────────────────────────────────────────────────────
  const updateControl = <K extends keyof ChildControls>(childKey: string, field: K, value: ChildControls[K]) => {
    const updated: ParentSettings = {
      ...settings,
      childControls: {
        ...settings.childControls,
        [childKey]: { ...settings.childControls[childKey], [field]: value },
      },
    };
    persistSettings(updated);
  };

  const toggleSubject = (childKey: string, subject: string, val: boolean) => {
    const existing = settings.childControls[childKey] ?? defaultControls(childKey);
    const updated: ParentSettings = {
      ...settings,
      childControls: {
        ...settings.childControls,
        [childKey]: { ...existing, subjectEnabled: { ...existing.subjectEnabled, [subject]: val } },
      },
    };
    persistSettings(updated);
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tabs = [
    { key: 'children', label: '👦 Children' },
    { key: 'subjects', label: '📚 Subjects' },
    { key: 'controls', label: '🔊 Controls' },
    { key: 'parent',   label: '🔑 Account' },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-lg font-extrabold text-purple-800">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold text-lg transition-colors"
            aria-label="Close settings"
          >×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-100 flex-shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-xs font-extrabold transition-colors whitespace-nowrap px-2 ${
                activeTab === tab.key
                  ? 'text-purple-700 border-b-2 border-purple-500 bg-purple-50'
                  : 'text-purple-400 hover:text-purple-600'
              }`}
            >{tab.label}</button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* ── TAB 1: Children ── */}
          {activeTab === 'children' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-purple-500 font-medium">Manage child profiles, photos, names and class.</p>

              {Object.entries(childEdits).map(([childKey, child]) => (
                <div key={childKey} className="bg-purple-50 rounded-2xl border-2 border-purple-100 p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 bg-white flex items-center justify-center">
                        {child.photoUrl ? (
                          <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">{child.emoji}</span>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRefs.current[childKey]?.click()}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center text-xs shadow transition-colors"
                        title="Upload photo"
                      >📷</button>
                      <input
                        ref={(el) => { fileInputRefs.current[childKey] = el; }}
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoChange(childKey, f); }}
                      />
                    </div>

                    {/* Fields */}
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text" value={child.name}
                        onChange={(e) => setChildEdits((prev) => ({ ...prev, [childKey]: { ...prev[childKey], name: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 text-purple-900 font-semibold text-sm focus:outline-none focus:border-purple-500 bg-white"
                        placeholder="Child's name"
                      />

                      {/* Emoji picker */}
                      <div className="flex flex-wrap gap-1">
                        {EMOJI_OPTIONS.map((em) => (
                          <button type="button" key={em}
                            onClick={() => setChildEdits((prev) => ({ ...prev, [childKey]: { ...prev[childKey], emoji: em } }))}
                            className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-colors ${
                              child.emoji === em ? 'bg-purple-500 ring-2 ring-purple-400' : 'bg-white hover:bg-purple-100 border border-purple-200'
                            }`}
                          >{em}</button>
                        ))}
                      </div>

                      {/* Class selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-700">Class:</span>
                        {([3, 4, 5] as const).map((c) => (
                          <button type="button" key={c}
                            onClick={() => setChildEdits((prev) => ({ ...prev, [childKey]: { ...prev[childKey], class: c } }))}
                            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-colors ${
                              child.class === c ? 'bg-purple-500 text-white' : 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-100'
                            }`}
                          >Class {c}</button>
                        ))}
                      </div>

                      {child.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setChildEdits((prev) => ({ ...prev, [childKey]: { ...prev[childKey], photoUrl: null } }))}
                          className="self-start text-xs text-red-400 hover:text-red-600 font-semibold"
                        >🗑 Remove photo</button>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirm(childKey)}
                      className="text-red-300 hover:text-red-500 text-lg transition-colors flex-shrink-0"
                      title="Delete child"
                    >🗑</button>
                  </div>

                  {/* Delete confirm */}
                  {deleteConfirm === childKey && (
                    <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 text-sm">
                      <p className="text-red-700 font-bold mb-2">Remove {child.name}? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteChild(childKey)} className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold text-xs">Yes, remove</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-bold text-xs">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add child */}
              {!showAddChild ? (
                <button type="button" onClick={() => setShowAddChild(true)} className="w-full py-3 border-2 border-dashed border-purple-300 rounded-2xl text-purple-500 font-bold hover:bg-purple-50 transition-colors">
                  ➕ Add Child
                </button>
              ) : (
                <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold text-green-700">New Child Profile</p>
                  <input type="text" value={newChild.name} onChange={(e) => setNewChild((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border-2 border-green-200 text-green-900 font-semibold text-sm focus:outline-none focus:border-green-500 bg-white"
                    placeholder="Child's name" />
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_OPTIONS.map((em) => (
                      <button type="button" key={em} onClick={() => setNewChild((p) => ({ ...p, emoji: em }))}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-colors ${
                          newChild.emoji === em ? 'bg-green-500 ring-2 ring-green-400' : 'bg-white hover:bg-green-100 border border-green-200'
                        }`}
                      >{em}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700">Class:</span>
                    {([3, 4, 5] as const).map((c) => (
                      <button type="button" key={c} onClick={() => setNewChild((p) => ({ ...p, class: c }))}
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-colors ${
                          newChild.class === c ? 'bg-green-500 text-white' : 'bg-white border border-green-200 text-green-600 hover:bg-green-100'
                        }`}
                      >Class {c}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddChild} className="flex-1 py-2 bg-green-500 text-white rounded-xl font-bold text-sm">✅ Add</button>
                    <button type="button" onClick={() => { setShowAddChild(false); setNewChild({ name: '', emoji: '🐱', photoUrl: null, class: 3 }); }}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm">Cancel</button>
                  </div>
                </div>
              )}

              <button type="button" onClick={handleSaveChildren} className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-md">
                💾 Save Child Profiles
              </button>
            </div>
          )}

          {/* ── TAB 2: Subjects ── */}
          {activeTab === 'subjects' && (
            <div className="flex flex-col gap-5">
              <p className="text-xs text-purple-500 font-medium">Enable or disable subjects for each child.</p>
              {Object.entries(settings.children).map(([childKey, child]) => {
                const subjects = SUBJECTS_BY_CHILD[child.name] ?? SUBJECTS_BY_CHILD[childKey] ?? [];
                const controls = settings.childControls[childKey] ?? defaultControls(childKey);
                return (
                  <div key={childKey} className="bg-purple-50 rounded-2xl border-2 border-purple-100 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-300 bg-white flex items-center justify-center flex-shrink-0">
                        {child.photoUrl
                          ? <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                          : <span className="text-xl">{child.emoji}</span>}
                      </div>
                      <span className="font-extrabold text-purple-800">{child.name}</span>
                      <span className="text-xs bg-purple-200 text-purple-700 rounded-full px-2 py-0.5 font-bold">Class {child.class}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {subjects.map((subject) => {
                        const enabled = controls.subjectEnabled[subject] !== false;
                        return (
                          <div key={subject} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-purple-100">
                            <span className="text-sm font-bold text-purple-700">{SUBJECT_LABELS[subject] ?? subject}</span>
                            <div className="flex items-center gap-2">
                              {!enabled && <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-bold">🔒 Locked</span>}
                              <button
                                type="button"
                                onClick={() => toggleSubject(childKey, subject, !enabled)}
                                aria-label={`${enabled ? 'Disable' : 'Enable'} ${SUBJECT_LABELS[subject] ?? subject} for ${child.name}`}
                                className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-green-400' : 'bg-gray-300'}`}
                              >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-7' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TAB 3: Sound & Controls ── */}
          {activeTab === 'controls' && (
            <div className="flex flex-col gap-4">
              {/* Global sound */}
              <div className="bg-orange-50 rounded-2xl border-2 border-orange-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-orange-800">🔊 All Sounds</p>
                    <p className="text-xs text-orange-600">Master toggle — overrides all child settings</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => persistSettings({ ...settings, globalSoundEnabled: !settings.globalSoundEnabled })}
                    aria-label={settings.globalSoundEnabled ? 'Disable all sounds' : 'Enable all sounds'}
                    className={`w-14 h-7 rounded-full transition-colors relative ${settings.globalSoundEnabled ? 'bg-green-400' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-all ${settings.globalSoundEnabled ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {/* Per-child controls */}
              {Object.entries(settings.children).map(([childKey, child]) => {
                const controls = settings.childControls[childKey] ?? defaultControls(childKey);
                const expanded = expandedControls === childKey;
                return (
                  <div key={childKey} className="bg-purple-50 rounded-2xl border-2 border-purple-100 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedControls(expanded ? null : childKey)}
                      aria-expanded={expanded ? 'true' : 'false'}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-300 bg-white flex items-center justify-center flex-shrink-0">
                        {child.photoUrl
                          ? <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                          : <span className="text-xl">{child.emoji}</span>}
                      </div>
                      <span className="font-extrabold text-purple-800 flex-1">{child.name}</span>
                      <span className="text-purple-400">{expanded ? '▲' : '▼'}</span>
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4 flex flex-col gap-3 border-t border-purple-100 pt-3">
                        {/* Sound toggle */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-purple-700">🔊 Sound</span>
                          <button
                            type="button"
                            onClick={() => updateControl(childKey, 'soundEnabled', !controls.soundEnabled)}
                            aria-label={controls.soundEnabled ? 'Disable sound' : 'Enable sound'}
                            className={`w-12 h-6 rounded-full transition-colors relative ${controls.soundEnabled ? 'bg-green-400' : 'bg-gray-300'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${controls.soundEnabled ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        {/* Hints toggle */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-purple-700">💡 Show Hints</span>
                          <button
                            type="button"
                            onClick={() => updateControl(childKey, 'showHints', !controls.showHints)}
                            aria-label={controls.showHints ? 'Disable hints' : 'Enable hints'}
                            className={`w-12 h-6 rounded-full transition-colors relative ${controls.showHints ? 'bg-green-400' : 'bg-gray-300'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${controls.showHints ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        {/* Daily limit */}
                        <div>
                          <p className="text-sm font-bold text-purple-700 mb-2">⏱ Daily Time Limit</p>
                          <div className="flex flex-wrap gap-2">
                            {TIME_OPTIONS.map((opt) => (
                              <button type="button" key={String(opt.value)}
                                onClick={() => updateControl(childKey, 'dailyTimeLimitMinutes', opt.value)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                                  controls.dailyTimeLimitMinutes === opt.value
                                    ? 'bg-purple-500 text-white' : 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-100'
                                }`}
                              >{opt.label}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TAB 4: Parent Account ── */}
          {activeTab === 'parent' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-purple-500 font-medium">Update your display name or change your PIN.</p>
              <div>
                <label className="block text-sm font-bold text-purple-700 mb-1">Username</label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold text-base focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter username" />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-700 mb-1">New PIN <span className="text-purple-400 font-normal text-xs">(leave blank to keep current)</span></label>
                <input type="password" value={newPin} onChange={(e) => { setNewPin(e.target.value); setPinError(''); }}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold text-base focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="4–6 digit PIN" maxLength={6} inputMode="numeric" />
              </div>
              {newPin && (
                <div>
                  <label className="block text-sm font-bold text-purple-700 mb-1">Confirm New PIN</label>
                  <input type="password" value={confirmPin} onChange={(e) => { setConfirmPin(e.target.value); setPinError(''); }}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold text-base focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Re-enter PIN" maxLength={6} inputMode="numeric" />
                </div>
              )}
              {pinError && (
                <div className="px-4 py-2 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-semibold">{pinError}</div>
              )}
              <div className="bg-purple-50 rounded-2xl border border-purple-100 px-4 py-3 text-xs text-purple-500 font-medium">
                🔒 Current PIN is saved securely in your browser. Changes take effect immediately on next login.
              </div>
              <button onClick={handleSaveParent} className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-md">
                💾 Save Parent Profile
              </button>
            </div>
          )}
        </div>

        {/* Save toast */}
        {savedMsg && (
          <div className="mx-6 mb-4 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 text-sm font-bold text-center animate-pulse flex-shrink-0">
            ✅ {savedMsg}
          </div>
        )}
      </div>
    </div>
  );
}
