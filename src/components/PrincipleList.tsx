import { useState } from 'react';
import type { Principle } from '@/models/types';

interface PrincipleListProps {
  principles: Principle[];
  onAddPrinciple: (content: string, keywords: string[]) => void;
}

export function PrincipleList({ principles, onAddPrinciple }: PrincipleListProps) {
  const [newContent, setNewContent] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  function handleAdd() {
    if (!newContent.trim()) return;
    const keywords = newKeywords.split(',').map(k => k.trim()).filter(Boolean);
    onAddPrinciple(newContent.trim(), keywords);
    setNewContent('');
    setNewKeywords('');
  }

  return (
    <div className="space-y-3">
      {/* Add form */}
      <div className="bg-[#1a1a1a] border border-[#333] p-3 rounded-lg">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="记录一条人生原则..."
          className="w-full px-3 py-2 text-sm bg-[#0d0d0d] border border-[#333] rounded-lg text-white mb-2"
        />
        <input
          type="text"
          value={newKeywords}
          onChange={(e) => setNewKeywords(e.target.value)}
          placeholder="关键词（逗号分隔）"
          className="w-full px-3 py-2 text-xs bg-[#0d0d0d] border border-[#333] rounded-lg text-white mb-2"
        />
        <button
          onClick={handleAdd}
          className="w-full py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500"
        >
          添加原则
        </button>
      </div>

      {/* List */}
      {principles.map(principle => (
        <div key={principle.id} className="bg-[#1a1a1a] border border-[#333] p-3 rounded-lg border-l-3 border-l-red-500/50">
          <div className="text-sm font-medium text-white mb-1">{principle.content}</div>
          <div className="flex flex-wrap gap-1 mb-1">
            {principle.keywords.map(kw => (
              <span key={kw} className="text-[10px] px-1.5 py-0.5 bg-[#0d0d0d] rounded text-[#666]">{kw}</span>
            ))}
          </div>
          <div className="text-[10px] text-[#444]">
            命中 {principle.hitCount} 次{principle.lastHitAt && ` · 最后 ${new Date(principle.lastHitAt).toLocaleDateString('zh-CN')}`}
          </div>
        </div>
      ))}
    </div>
  );
}