import type { Principle } from '@/models/types';

interface BoomerangAlertProps {
  principle: Principle;
  onClose: () => void;
  onConfirm: () => void;
}

export function BoomerangAlert({ principle, onClose, onConfirm }: BoomerangAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="bg-[#1a1a1a] border-2 border-red-500 rounded-2xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">🪃</div>
        <h2 className="text-xl font-bold text-white mb-2">回旋镖击中！</h2>
        <p className="text-[#888] mb-6">
          你曾记录过这个原则，但在这次实践中未能避免：
        </p>
        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-6">
          <div className="text-lg font-medium text-red-400">"{principle.content}"</div>
        </div>
        <p className="text-sm text-[#555] mb-6">
          命中次数：{principle.hitCount + 1}
        </p>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-400 transition-colors"
        >
          我记住了
        </button>
      </div>
    </div>
  );
}