import { useState, useEffect, useRef } from 'react';

interface DateWheelProps {
  value: string; // YYYY-MM-DD
  min: string; // YYYY-MM-DD
  max: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

export function DateWheel({ value, min, max, onChange }: DateWheelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startDate, setStartDate] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const minDate = new Date(min);
  const maxDate = new Date(max);
  const currentDate = new Date(value);

  // 计算日期字符串显示
  function formatDisplay(date: Date): { month: string; day: string; week: string } {
    const month = date.toLocaleDateString('zh-CN', { month: 'long' });
    const day = date.getDate();
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    return { month, day: String(day), week };
  }

  const display = formatDisplay(currentDate);

  // 添加日期
  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // 日期转字符串
  function toDateStr(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // 两天之间相差天数
  function daysBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
  }

  // Wheel handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const current = new Date(value);
      const delta = e.deltaY > 0 ? 1 : -1;
      const newDate = addDays(current, delta);

      if (newDate >= minDate && newDate <= maxDate) {
        onChange(toDateStr(newDate));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [value, min, max, onChange]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartDate(value);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      const days = Math.round(delta / 40);
      if (days !== 0) {
        const newDate = addDays(new Date(startDate), days);
        if (newDate >= minDate && newDate <= maxDate) {
          onChange(toDateStr(newDate));
        }
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startDate, min, max, onChange]);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setStartDate(value);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startY;
    const days = Math.round(delta / 40);
    if (days !== 0) {
      const newDate = addDays(new Date(startDate), days);
      if (newDate >= minDate && newDate <= maxDate) {
        onChange(toDateStr(newDate));
        setStartY(e.touches[0].clientY);
        setStartDate(toDateStr(newDate));
      }
    }
  };

  // Progress within range
  const progress = daysBetween(minDate, currentDate);
  const totalDays = daysBetween(minDate, maxDate);

  return (
    <div
      ref={containerRef}
      className="cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="flex flex-col items-center">
        <div className="text-xs text-[#666] mb-1">{display.week}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{display.month}</span>
          <span className="text-4xl font-bold text-white">{display.day}</span>
          <span className="text-lg text-[#888]">日</span>
        </div>
        <div className="text-xs text-[#555] mt-1">{value}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#333] rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all"
          style={{ width: `${totalDays > 0 ? (progress / totalDays) * 100 : 0}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#555] mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      <p className="text-xs text-center text-[#555] mt-2">滑动调整日期</p>
    </div>
  );
}