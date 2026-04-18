'use client';
import { useState } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Plus, Check, X } from 'lucide-react';

const EVENT_COLORS = [
  'bg-red-200', 'bg-orange-200', 'bg-amber-200', 'bg-lime-200', 
  'bg-green-200', 'bg-emerald-200', 'bg-teal-200', 'bg-cyan-200', 
  'bg-sky-200', 'bg-blue-200', 'bg-indigo-200', 'bg-violet-200', 
  'bg-purple-200', 'bg-fuchsia-200', 'bg-pink-200', 'bg-rose-200'
];

export default function EventPanel() {
  const { events, activeEventId, setActiveEvent, addEvent } = useScheduleStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('10');

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    // Find unused colors
    const usedColors = new Set(events.map(e => e.color));
    const availableColors = EVENT_COLORS.filter(c => !usedColors.has(c));
    
    // Pick random color
    const colorPool = availableColors.length > 0 ? availableColors : EVENT_COLORS;
    const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
    
    addEvent({
      name: newName.trim(),
      scorePerSlot: parseInt(newScore) || 0,
      color: randomColor
    });
    
    setIsAdding(false);
    setNewName('');
    setNewScore('10');
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">事件配置</h2>
      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {events.map(event => (
          <div 
            key={event.id}
            onClick={() => setActiveEvent(event.id === activeEventId ? null : event.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
              activeEventId === event.id ? 'border-gray-800 scale-105 shadow-md' : 'border-transparent hover:brightness-95'
            } ${event.color}`}
          >
            <div className="font-medium text-gray-800">{event.name}</div>
            <div className="text-sm text-gray-700 opacity-80">{event.scorePerSlot} 分 / 30分</div>
          </div>
        ))}
        
        {isAdding && (
          <div className="p-3 rounded-xl border-2 border-green-400 bg-green-50/50 flex flex-col gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="事件名称 (如: 读书)"
              className="w-full px-2 py-1 text-sm rounded border border-green-200 focus:outline-none focus:ring-1 focus:ring-green-400"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                placeholder="分数"
                className="w-16 px-2 py-1 text-sm rounded border border-green-200 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
              <span className="text-xs text-gray-500">分/块</span>
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={handleAdd} className="flex-1 bg-green-500 text-white py-1 rounded text-sm flex items-center justify-center gap-1 hover:bg-green-600">
                <Check size={14} /> 保存
              </button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm flex items-center justify-center gap-1 hover:bg-gray-300">
                <X size={14} /> 取消
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Plus size={18} /> 添加事件
        </button>
      )}
    </div>
  );
}