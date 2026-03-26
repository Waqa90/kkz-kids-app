'use client';

import React, { useState, useEffect } from 'react';
import { CHILD_NAMES, type ChildName } from '@/lib/childProfile';
import { loadParentSettings, getChildClassFromSettings } from '@/app/parent/components/SettingsPanel';

interface ChildPickerProps {
  onSelect: (child: ChildName) => void;
  selectedChild?: ChildName | null;
  title?: string;
  subtitle?: string;
}

const CHILD_ACCENT: Record<string, { bg: string; ring: string; text: string }> = {
  Kitty:  { bg: 'bg-pink-100',   ring: 'ring-pink-400',   text: 'text-pink-700'   },
  Karawa: { bg: 'bg-orange-100', ring: 'ring-orange-400', text: 'text-orange-700' },
  Zech:   { bg: 'bg-blue-100',   ring: 'ring-blue-400',   text: 'text-blue-700'   },
};

export default function ChildPicker({ onSelect, selectedChild, title = '👋 Who is learning today?', subtitle }: ChildPickerProps) {
  const [childSettings, setChildSettings] = useState(() => loadParentSettings().children);

  useEffect(() => {
    const reload = () => setChildSettings(loadParentSettings().children);
    reload();
    window.addEventListener('kitty_settings_changed', reload);
    return () => window.removeEventListener('kitty_settings_changed', reload);
  }, []);

  const children = CHILD_NAMES.filter((n) => childSettings[n]);

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-purple-800">{title}</h2>
        {subtitle && <p className="text-purple-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-lg">
        {children.map((name) => {
          const child = childSettings[name];
          if (!child) return null;
          const accent = CHILD_ACCENT[name] ?? CHILD_ACCENT['Kitty'];
          const isSelected = selectedChild === name;
          const cls = getChildClassFromSettings(name);
          return (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border-4 transition-all duration-150 min-w-[140px] active:scale-95
                ${isSelected
                  ? `${accent.bg} border-current ${accent.ring} ring-4 scale-105 shadow-xl`
                  : 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-lg shadow-md'
                }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
              )}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-purple-50">
                {child.photoUrl
                  ? <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                  : <span className="text-4xl">{child.emoji}</span>}
              </div>
              <span className={`font-extrabold text-lg ${isSelected ? accent.text : 'text-purple-800'}`}>{child.name}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-purple-100'} text-purple-600`}>Class {cls}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
