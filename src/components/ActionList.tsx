import type { Action, ActionLog } from '@/models/types';

interface ActionListProps {
  actions: Action[];
  logs: ActionLog[];
  effectiveMinutesPerDay: number;
}

export function ActionList({ actions, logs, effectiveMinutesPerDay }: ActionListProps) {
  function getActionTotalMinutes(actionId: string): number {
    return logs.filter(l => l.actionId === actionId).reduce((sum, l) => sum + l.minutes, 0);
  }

  function getActionDays(action: Action): number {
    const start = new Date(action.startDate);
    const end = new Date(action.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  function getActionProgress(action: Action): number {
    const days = getActionDays(action);
    const totalMinutes = getActionTotalMinutes(action.id);
    return Math.round((totalMinutes / (days * effectiveMinutesPerDay)) * 100);
  }

  return (
    <div className="space-y-2">
      {actions.map(action => {
        const progress = getActionProgress(action);
        return (
          <div key={action.id} className="bg-[#1a1a1a] border border-[#333] p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                {action.icon} {action.title}
              </span>
              <span className="text-xs text-[#555]">
                {action.startDate} ~ {action.endDate}
              </span>
            </div>
            <div className="h-1.5 bg-[#0d0d0d] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#555]">{getActionTotalMinutes(action.id)}分钟</span>
              <span className="text-[10px] text-amber-400">{progress}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}