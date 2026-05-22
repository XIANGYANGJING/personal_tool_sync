import type { Achievement } from '@/models/types';

interface AchievementPanelProps {
  achievements: Achievement[];
}

export function AchievementPanel({ achievements }: AchievementPanelProps) {
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-4">
      {unlocked.length > 0 && (
        <div>
          <div className="text-xs text-[#555] uppercase mb-2">已解锁</div>
          <div className="space-y-2">
            {unlocked.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] p-3 rounded-lg">
                <div className="text-2xl">{a.icon}</div>
                <div>
                  <div className="text-sm font-medium text-white">{a.title}</div>
                  <div className="text-xs text-[#555]">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <div className="text-xs text-[#555] uppercase mb-2">进行中</div>
          <div className="space-y-2">
            {locked.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-[#1a1a1a]/50 border border-[#333]/50 p-3 rounded-lg">
                <div className="text-2xl opacity-50">{a.icon}</div>
                <div>
                  <div className="text-sm font-medium text-[#555]">{a.title}</div>
                  <div className="text-xs text-[#444]">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}