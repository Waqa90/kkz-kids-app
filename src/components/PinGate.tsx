'use client';

import React, { useState } from 'react';
import { loadParentSettings } from '@/app/parent/components/SettingsPanel';

interface PinGateProps {
  title: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function PinGate({ title, subtitle, onSuccess, onCancel }: PinGateProps) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const settings = loadParentSettings();
    if (username.trim() === settings.username && pin === settings.pin) {
      setTimeout(() => { setLoading(false); onSuccess(); }, 300);
    } else {
      setTimeout(() => { setLoading(false); setError('Incorrect username or PIN. Please try again.'); }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 flex flex-col gap-5">
        <div className="text-center">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl font-extrabold text-purple-800">{title}</h2>
          {subtitle && <p className="text-sm text-purple-500 mt-1">{subtitle}</p>}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-purple-700 mb-1">Username</label>
            <input
              type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter username" autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-purple-700 mb-1">PIN</label>
            <input
              type="password" value={pin} onChange={(e) => { setPin(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter PIN" maxLength={6} inputMode="numeric" autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="px-4 py-2 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-semibold text-center">{error}</div>
          )}
          <button type="submit" disabled={loading || !username || !pin}
            className="w-full py-3 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-md text-lg">
            {loading ? '🔓 Checking…' : '🔓 Unlock'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="w-full py-2 text-purple-500 font-semibold text-sm hover:text-purple-700 transition-colors">Cancel</button>
          )}
        </form>
      </div>
    </div>
  );
}
