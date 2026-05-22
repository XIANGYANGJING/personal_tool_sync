import { useMemo } from 'react';
import type { ActionLog, Goal } from '@/models/types';

interface ActionTimelineProps {
  goal: Goal;
  logs: ActionLog[];
  onDayClick?: (date: string, logs: ActionLog[]) => void;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getIntensityClass(ratio: number): string {
  if (ratio === 0) return 'bg-[#1a1a1a]';
  if (ratio <= 0.5) return 'bg-amber-500/30';
  if (ratio <= 0.8) return 'bg-amber-500';
  if (ratio <= 1) return 'bg-amber-400';
  return 'bg-orange-500 shadow-lg shadow-orange-500/50';
}

export function ActionTimeline({ goal, logs, onDayClick }: ActionTimelineProps) {
  const days = useMemo(() => {
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const result: { date: string; dayOfWeek: number; logs: ActionLog[]; totalMinutes: number }[] = [];

    const current = new Date(start);
    while (current <= end) {
      const dateStr = formatDate(current);
      const dayLogs = logs.filter(l => l.date === dateStr);
      const totalMinutes = dayLogs.reduce((sum, l) => sum + l.minutes, 0);
      result.push({
        date: dateStr,
        dayOfWeek: current.getDay(),
        logs: dayLogs,
        totalMinutes,
      });
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [goal.startDate, goal.endDate, logs]);

  // Group into weeks (Mon-Sun)
  const weeks = useMemo(() => {
    const result: typeof days[] = [];
    let currentWeek: typeof days = [];

    // Pad start to Monday
    const firstDay = new Date(days[0]?.date || goal.startDate);
    const padCount = (firstDay.getDay() + 6) % 7; // Monday = 0
    for (let i = 0; i < padCount; i++) {
      currentWeek.push({ date: '', dayOfWeek: -1, logs: [], totalMinutes: 0 });
    }

    for (const day of days) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push({ date: '', dayOfWeek: -1, logs: [], totalMinutes: 0 });
      result.push(currentWeek);
    }
    return result;
  }, [days, goal.startDate]);

  const maxMinutes = goal.effectiveMinutesPerDay;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5 mb-1">
        <div className="w-4" />
        {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-[#444]">{d}</div>
        ))}
      </div>

      <div className="flex gap-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => {
              const ratio = day.totalMinutes > 0 ? Math.min(day.totalMinutes / maxMinutes, 1.5) : 0;
              const isValid = day.date !== '';

              return (
                <div
                  key={di}
                  onClick={() => isValid && onDayClick?.(day.date, day.logs)}
                  className={`w-6 h-6 rounded-sm cursor-pointer transition-all ${isValid ? getIntensityClass(ratio) : 'bg-transparent'}`}
                  title={isValid ? `${day.date}: ${day.totalMinutes}分钟` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2 text-[10px] text-[#444]">
        <span>少</span>
        <div className="flex gap-0.5">
          <div className="w-2 h-2 rounded-sm bg-[#1a1a1a]" />
          <div className="w-2 h-2 rounded-sm bg-amber-500/30" />
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <div className="w-2 h-2 rounded-sm bg-amber-400" />
          <div className="w-2 h-2 rounded-sm bg-orange-500" />
        </div>
        <span>多</span>
      </div>
    </div>
  );
}