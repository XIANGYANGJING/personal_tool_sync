import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface DateRangeSliderProps {
  startDate: string;
  endDate: string;
  goalStart: string;
  goalEnd: string;
  onChange: (start: string, end: string) => void;
}

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateRangeSlider({ startDate, endDate, goalStart, goalEnd, onChange }: DateRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  // Parse dates with validation
  const goalStartDate = useMemo(() => new Date(goalStart), [goalStart]);
  const goalEndDate = useMemo(() => new Date(goalEnd), [goalEnd]);
  const startDateObj = useMemo(() => new Date(startDate), [startDate]);
  const endDateObj = useMemo(() => new Date(endDate), [endDate]);

  const goalStartMs = isValidDate(goalStartDate) ? goalStartDate.getTime() : Date.now();
  const goalEndMs = isValidDate(goalEndDate) ? goalEndDate.getTime() : Date.now() + 7 * 24 * 60 * 60 * 1000;
  const startMs = isValidDate(startDateObj) ? startDateObj.getTime() : goalStartMs;
  const endMs = isValidDate(endDateObj) ? endDateObj.getTime() : goalEndMs;

  const totalMs = goalEndMs - goalStartMs;
  const startPercent = totalMs > 0 ? ((startMs - goalStartMs) / totalMs) * 100 : 0;
  const endPercent = totalMs > 0 ? ((endMs - goalStartMs) / totalMs) * 100 : 100;

  const percentToDateMs = useCallback((percent: number): number => {
    return goalStartMs + (percent / 100) * totalMs;
  }, [goalStartMs, totalMs]);

  const formatDisplay = useCallback((ms: number): string => {
    const d = new Date(ms);
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }, []);

  const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
  };

  const handleTouchStart = (handle: 'start' | 'end') => (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
  };

  useEffect(() => {
    if (!dragging) return;

    const updatePosition = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      const newMs = percentToDateMs(percent);
      const newDate = formatDateStr(new Date(newMs));

      if (dragging === 'start') {
        if (percent <= endPercent) {
          onChange(newDate, endDate);
        }
      } else if (dragging === 'end') {
        if (percent >= startPercent) {
          onChange(startDate, newDate);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);
    const handleEnd = () => setDragging(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, startDate, endDate, startPercent, endPercent, onChange, percentToDateMs]);

  return (
    <div className="px-2 select-none">
      {/* Date labels */}
      <div className="flex justify-between mb-3">
        <div className="text-center min-w-[60px]">
          <div className="text-xs text-[#666]">开始</div>
          <div className="text-base font-semibold text-white">{formatDisplay(startMs)}</div>
        </div>
        <div className="text-center min-w-[60px]">
          <div className="text-xs text-[#666]">结束</div>
          <div className="text-base font-semibold text-white">{formatDisplay(endMs)}</div>
        </div>
      </div>

      {/* Track */}
      <div ref={trackRef} className="relative h-10 cursor-pointer">
        {/* Background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-[#333] rounded-full" />

        {/* Selected range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-amber-500 rounded-full"
          style={{
            left: `${startPercent}%`,
            width: `${Math.max(0, endPercent - startPercent)}%`,
          }}
        />

        {/* Start handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full shadow-lg flex items-center justify-center transition-transform cursor-grab ${
            dragging === 'start' ? 'scale-125 z-10 bg-white' : 'bg-gray-200 hover:bg-white'
          }`}
          style={{ left: `${startPercent}%` }}
          onMouseDown={handleMouseDown('start')}
          onTouchStart={handleTouchStart('start')}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
        </div>

        {/* End handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full shadow-lg flex items-center justify-center transition-transform cursor-grab ${
            dragging === 'end' ? 'scale-125 z-10 bg-white' : 'bg-gray-200 hover:bg-white'
          }`}
          style={{ left: `${endPercent}%` }}
          onMouseDown={handleMouseDown('end')}
          onTouchStart={handleTouchStart('end')}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
        </div>
      </div>

      {/* Goal period labels */}
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-[#555]">{goalStart}</span>
        <span className="text-[10px] text-[#555]">{goalEnd}</span>
      </div>

      <p className="text-xs text-center text-[#555] mt-2">拖动右侧滑块调整结束日期</p>
    </div>
  );
}