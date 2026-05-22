import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DateRangeSlider } from '@/components/ui/DateRangeSlider';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, icon: string, startDate: string, endDate: string) => void;
  defaultStartDate: string;
  defaultEndDate: string;
}

export function ActionModal({ isOpen, onClose, onAdd, defaultStartDate, defaultEndDate }: ActionModalProps) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📌');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const icons = ['📌', '🎧', '📖', '✏️', '🏃', '💪', '🎤', '📚', '💻', '🎯'];

  function handleSubmit() {
    if (!title.trim() || !startDate || !endDate) return;
    if (startDate < defaultStartDate) return;
    if (endDate > defaultEndDate) return;
    if (startDate > endDate) return;
    onAdd(title.trim(), icon, startDate, endDate);
    setTitle('');
    setIcon('📌');
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    onClose();
  }

  function handleReset() {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加动作">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">动作名称</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="如：听力"
            className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#333] rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">图标</label>
          <div className="flex gap-2 flex-wrap">
            {icons.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 text-xl rounded-lg transition-colors ${
                  icon === ic ? 'bg-indigo-600' : 'bg-[#0d0d0d]'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">动作周期</label>
            <button
              onClick={handleReset}
              className="text-xs text-[#666] hover:text-white"
            >
              重置
            </button>
          </div>
          <div className="bg-[#0d0d0d] rounded-xl py-4">
            <DateRangeSlider
              startDate={startDate}
              endDate={endDate}
              goalStart={defaultStartDate}
              goalEnd={defaultEndDate}
              onChange={(s, e) => {
                setStartDate(s);
                setEndDate(e);
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            添加
          </button>
        </div>
      </div>
    </Modal>
  );
}
