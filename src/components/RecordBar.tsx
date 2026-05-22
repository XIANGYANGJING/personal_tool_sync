import { useState } from 'react';
import type { Action } from '@/models/types';
import { DurationWheel } from './DurationWheel';

interface RecordBarProps {
  actions: Action[];
  onRecord: (actionId: string, minutes: number, note: string) => void;
}

export function RecordBar({ actions, onRecord }: RecordBarProps) {
  const [selectedActionId, setSelectedActionId] = useState<string>('');
  const [minutes, setMinutes] = useState(30);
  const [note, setNote] = useState('');

  function handleSubmit() {
    if (!selectedActionId) return;
    onRecord(selectedActionId, minutes, note);
    setNote('');
  }

  return (
    <div className="bg-[#0d0d0d] border-t border-[#1a1a1a] px-4 py-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Action selector */}
        <div className="flex gap-1 overflow-x-auto">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => setSelectedActionId(action.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedActionId === action.id
                  ? 'bg-white text-black font-medium'
                  : 'bg-[#1a1a1a] text-[#888]'
              }`}
            >
              <span>{action.icon}</span> {action.title}
            </button>
          ))}
        </div>

        {/* Duration wheel */}
        <div className="flex items-center justify-center">
          <DurationWheel value={minutes} onChange={setMinutes} />
        </div>

        {/* Note input */}
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="记录一下..."
          className="flex-1 px-3 py-2 text-sm bg-[#141414] border border-[#2a2a2a] rounded-lg text-white min-w-0"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg"
        >
          记录
        </button>
      </div>
    </div>
  );
}