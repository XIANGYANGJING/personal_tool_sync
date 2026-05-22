import { useState, useEffect, useMemo } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { useActions } from '@/hooks/useActions';
import { useGoalLogs } from '@/hooks/useActionLogs';
import { usePrinciples } from '@/hooks/usePrinciples';
import { useAchievements } from '@/hooks/useAchievements';
import { addActionLogToFirestore } from '@/firebase/firestore';
import { GoalCard } from '@/components/GoalCard';
import { ActionList } from '@/components/ActionList';
import { ActionTimeline } from '@/components/ActionTimeline';
import { RecordBar } from '@/components/RecordBar';
import { PrincipleList } from '@/components/PrincipleList';
import { AchievementPanel } from '@/components/AchievementPanel';
import { ActionModal } from '@/components/ActionModal';
import { WeekPicker } from '@/components/ui/WeekPicker';

type Tab = 'goals' | 'achievements';

export default function App() {
  const { goals, addGoal, deleteGoal } = useGoals();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('goals');

  const selectedGoal = useMemo(
    () => goals.find(g => g.id === selectedGoalId) ?? null,
    [goals, selectedGoalId]
  );

  const { actions, addAction } = useActions(selectedGoalId);
  const { logs: allLogs } = useGoalLogs(selectedGoalId);

  const { principles, addPrinciple } = usePrinciples();
  const { achievements } = useAchievements();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalWeeks, setNewGoalWeeks] = useState(4);

  // Auto-select first active goal
  useEffect(() => {
    if (tab === 'goals' && goals.length > 0 && !selectedGoalId) {
      const activeGoal = goals.find(g => g.status === 'active');
      if (activeGoal) setSelectedGoalId(activeGoal.id);
    }
  }, [tab, goals, selectedGoalId]);

  // Auto-select first phase when goal changes
  useEffect(() => {
    if (selectedGoal && goals.length > 0) {
      const stillExists = goals.some(g => g.id === selectedGoal.id);
      if (!stillExists) {
        const activeGoal = goals.find(g => g.status === 'active');
        setSelectedGoalId(activeGoal?.id ?? null);
      }
    }
  }, [selectedGoal, goals]);

  const activeGoals = useMemo(
    () => goals.filter(g => g.status === 'active'),
    [goals]
  );

  async function handleAddGoal() {
    if (!newGoalTitle.trim()) return;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + newGoalWeeks * 7 * 24 * 60 * 60 * 1000);
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    const id = await addGoal(newGoalTitle.trim(), startStr, endStr);
    setSelectedGoalId(id);
    setNewGoalTitle('');
    setNewGoalWeeks(4);
    setShowGoalModal(false);
  }

  async function handleRecord(actionId: string, minutes: number, note: string) {
    const today = new Date().toISOString().split('T')[0];
    await addActionLogToFirestore(actionId, today, minutes, note);
  }

  async function handleAddAction(title: string, icon: string, startDate: string, endDate: string) {
    if (!selectedGoalId) return;
    await addAction(title, icon, startDate, endDate);
  }

  function handleDayClick(date: string, dayLogs: any[]) {
    // Could implement day detail modal here
    console.log('Day:', date, 'Logs:', dayLogs);
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f]">
      {/* Header */}
      <header className="h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-5 flex-shrink-0">
        <h1 className="text-base font-bold text-white">PhaseReview</h1>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setTab('goals')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${tab === 'goals' ? 'bg-white text-black' : 'text-[#888] hover:text-white'}`}
          >
            目标
          </button>
          <button
            onClick={() => setTab('achievements')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${tab === 'achievements' ? 'bg-white text-black' : 'text-[#888] hover:text-white'}`}
          >
            成就
          </button>
        </div>
      </header>

      {tab === 'goals' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Goals + Actions */}
          <div className="w-[60%] flex flex-col border-r border-[#2a2a2a]">
            {/* Goal cards */}
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-[#555] uppercase">目标</h2>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="px-3 py-1.5 text-sm bg-[#1a1a1a] text-[#888] hover:text-white rounded-lg"
                >
                  + 新建
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {activeGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    isSelected={selectedGoalId === goal.id}
                    onClick={() => setSelectedGoalId(goal.id)}
                    onDelete={() => {
                      deleteGoal(goal.id);
                      if (selectedGoalId === goal.id) {
                        setSelectedGoalId(activeGoals.find(g => g.id !== goal.id)?.id ?? null);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Goal detail */}
            {selectedGoal && (
              <div className="flex-1 overflow-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedGoal.title}</h3>
                    <p className="text-xs text-[#555]">
                      {selectedGoal.startDate} ~ {selectedGoal.endDate}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowActionModal(true)}
                    className="px-3 py-1.5 text-sm bg-[#1a1a1a] text-[#888] hover:text-white rounded-lg"
                  >
                    + 添加动作
                  </button>
                </div>

                {/* Action timeline (7×n) */}
                <div className="mb-6">
                  <h4 className="text-xs text-[#555] uppercase mb-2">日历视图</h4>
                  <ActionTimeline
                    goal={selectedGoal}
                    logs={allLogs}
                    onDayClick={handleDayClick}
                  />
                </div>

                {/* Action progress */}
                <div>
                  <h4 className="text-xs text-[#555] uppercase mb-2">动作进度</h4>
                  <ActionList
                    actions={actions}
                    logs={allLogs}
                    effectiveMinutesPerDay={selectedGoal.effectiveMinutesPerDay}
                  />
                </div>
              </div>
            )}

            {/* Record bar */}
            {selectedGoal && actions.length > 0 && (
              <RecordBar
                actions={actions}
                onRecord={handleRecord}
              />
            )}
          </div>

          {/* Right: Principles */}
          <div className="w-[40%] p-5 overflow-auto">
            <h4 className="text-xs text-[#555] uppercase mb-3">原则库</h4>
            <PrincipleList
              principles={principles}
              onAddPrinciple={addPrinciple}
            />
          </div>
        </div>
      ) : (
        /* Achievements tab */
        <div className="flex-1 overflow-auto p-5">
          <h3 className="text-lg font-bold text-white mb-4">成就系统</h3>
          <AchievementPanel achievements={achievements} />
        </div>
      )}

      {/* Goal creation modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#1a1a1a] rounded-xl p-5 w-96">
            <h3 className="text-white font-semibold mb-4">新建目标</h3>
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="目标名称（如：英语六级）"
              className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#333] rounded-lg text-white mb-5"
            />
            <div className="flex justify-center mb-5">
              <WeekPicker
                weeks={newGoalWeeks}
                onChange={setNewGoalWeeks}
                minWeeks={1}
                maxWeeks={24}
              />
            </div>
            <div className="text-center text-sm text-[#888] mb-4">
              <div>起始：{new Date().toLocaleDateString('zh-CN')}</div>
              <div>结束：{new Date(Date.now() + newGoalWeeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')}</div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowGoalModal(false)} className="px-4 py-2 text-[#888]">取消</button>
              <button onClick={handleAddGoal} className="px-4 py-2 bg-white text-black font-medium rounded-lg">创建</button>
            </div>
          </div>
        </div>
      )}

      {/* Action creation modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onAdd={handleAddAction}
        defaultStartDate={selectedGoal?.startDate ?? ''}
        defaultEndDate={selectedGoal?.endDate ?? ''}
      />
    </div>
  );
}