import { useState, useEffect, useRef } from 'react';

interface WeekPickerProps {
  weeks: number;
  onChange: (weeks: number) => void;
  minWeeks?: number;
  maxWeeks?: number;
}

export function WeekPicker({ weeks, onChange, minWeeks = 1, maxWeeks = 24 }: WeekPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startWeeks, setStartWeeks] = useState(weeks);
  const dialRef = useRef<HTMLDivElement>(null);

  // Mouse wheel handler
  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newWeeks = Math.min(maxWeeks, Math.max(minWeeks, weeks + delta));
      if (newWeeks !== weeks) {
        onChange(newWeeks);
      }
    };

    dial.addEventListener('wheel', handleWheel, { passive: false });
    return () => dial.removeEventListener('wheel', handleWheel);
  }, [weeks, onChange, minWeeks, maxWeeks]);

  // Drag to adjust
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartWeeks(weeks);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      const change = Math.round(delta / 30);
      if (change !== 0) {
        const newWeeks = Math.min(maxWeeks, Math.max(minWeeks, startWeeks + change));
        if (newWeeks !== weeks) {
          onChange(newWeeks);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startWeeks, weeks, onChange, minWeeks, maxWeeks]);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setStartWeeks(weeks);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      const delta = e.touches[0].clientY - startY;
      const change = Math.round(delta / 30);
    const newWeeks = Math.min(maxWeeks, Math.max(minWeeks, startWeeks + change));
    if (newWeeks !== weeks) {
      onChange(newWeeks);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={dialRef}
        className="relative w-32 h-32 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#333] bg-[#1a1a1a]" />

        {/* Tick marks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-0.5 h-2 origin-bottom ${i < weeks ? 'bg-amber-500' : 'bg-[#333]'}`}
            style={{
              left: '50%',
              top: '4px',
              transform: `translateX(-50%) rotate(${(i / 24) * 360}deg)`,
              transformOrigin: `0 ${56}px`,
              height: i % 4 === 0 ? '10px' : '6px',
            }}
          />
        ))}

        {/* Center display */}
        <div className="absolute inset-4 rounded-full bg-[#0d0d0d] flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{weeks}</span>
          <span className="text-xs text-[#888]">周</span>
        </div>

        {/* Pointer indicator */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-amber-500" />
      </div>

      <p className="text-xs text-[#666] mt-3">滑动鼠标或拖动转盘调整周数</p>
    </div>
  );
}