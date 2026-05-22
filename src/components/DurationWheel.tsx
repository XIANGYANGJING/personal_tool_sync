import { useState, useEffect } from 'react';

interface DurationWheelProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PRESET_MINUTES = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 150, 180];

export function DurationWheel({ value, onChange, min = 5, max = 180 }: DurationWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  function handleSelect(minutes: number) {
    onChange(minutes);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-[#888] hover:border-[#555] transition-colors"
      >
        <span>{value}min</span>
        <span className="text-[#555]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-[#1a1a1a] border border-[#333] rounded-xl p-3 shadow-xl z-50 w-48">
          <div className="text-xs text-[#555] mb-2">选择时长</div>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_MINUTES.filter(m => m >= min && m <= max).map(minutes => (
              <button
                key={minutes}
                onClick={() => handleSelect(minutes)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tempValue === minutes
                    ? 'bg-white text-black'
                    : 'bg-[#0d0d0d] text-[#888] hover:bg-[#2a2a2a]'
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}