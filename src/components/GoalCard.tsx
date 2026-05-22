import type { Goal } from '@/models/types';

interface GoalCardProps {
  goal: Goal;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export function GoalCard({ goal, isSelected, onClick, onDelete }: GoalCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative px-4 py-3 rounded-xl cursor-pointer border transition-all ${
        isSelected
          ? 'bg-white text-black border-white'
          : 'bg-[#1a1a1a] text-[#888] border-[#2a2a2a] hover:border-[#444]'
      }`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 text-xs"
      >
        ✕
      </button>
      <span className={`text-base font-semibold block ${isSelected ? 'text-black' : 'text-white'}`}>
        {goal.title}
      </span>
      <span className={`text-xs ${isSelected ? 'text-black/50' : 'text-[#555]'}`}>
        Lv.{goal.currentLevel}
      </span>
    </div>
  );
}