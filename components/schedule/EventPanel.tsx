'use client';
import { useState, useEffect, useRef } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Plus, Check, X, Eraser, Edit2, Trash2 } from 'lucide-react';

const EVENT_COLORS = [
  'bg-slate-50/80 text-slate-700 border-slate-200',
  'bg-gray-100/80 text-gray-700 border-gray-200',
  'bg-zinc-100/80 text-zinc-700 border-zinc-200',
  'bg-neutral-100/80 text-neutral-700 border-neutral-200',
  'bg-stone-100/80 text-stone-700 border-stone-200',
  
  'bg-red-50/80 text-red-700 border-red-200',
  'bg-orange-50/80 text-orange-700 border-orange-200',
  'bg-amber-50/80 text-amber-700 border-amber-200',
  'bg-yellow-50/80 text-yellow-700 border-yellow-200',
  
  'bg-lime-50/80 text-lime-700 border-lime-200',
  'bg-green-50/80 text-green-700 border-green-200',
  'bg-emerald-50/80 text-emerald-700 border-emerald-200',
  'bg-teal-50/80 text-teal-700 border-teal-200',
  'bg-cyan-50/80 text-cyan-700 border-cyan-200',
  
  'bg-sky-50/80 text-sky-700 border-sky-200',
  'bg-blue-50/80 text-blue-700 border-blue-200',
  'bg-indigo-50/80 text-indigo-700 border-indigo-200',
  'bg-violet-50/80 text-violet-700 border-violet-200',
  
  'bg-purple-50/80 text-purple-700 border-purple-200',
  'bg-fuchsia-50/80 text-fuchsia-700 border-fuchsia-200',
  'bg-pink-50/80 text-pink-700 border-pink-200',
  'bg-rose-50/80 text-rose-700 border-rose-200',
];

export default function EventPanel() {
  const { events, activeEventId, setActiveEvent, addEvent, updateEvent, deleteEvent } = useScheduleStore();
  
  // Adding state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('10');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('10');
  const [editColor, setEditColor] = useState('');

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close context menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const usedColors = new Set(events.map(e => e.color));
    const availableColors = EVENT_COLORS.filter(c => !usedColors.has(c));
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

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  const startEdit = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      setEditingId(id);
      setEditName(event.name);
      setEditScore(event.scorePerSlot.toString());
      setEditColor(event.color);
    }
    setContextMenu(null);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateEvent(editingId, {
        name: editName.trim(),
        scorePerSlot: parseInt(editScore) || 0,
        color: editColor
      });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个事件吗？')) {
      deleteEvent(id);
    }
    setContextMenu(null);
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50/50 h-full flex flex-col relative" style={{ transform: 'none' }}>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Quick Config</h2>
      
      <div className="flex-grow overflow-y-auto pr-2 -mx-2 px-2 custom-scrollbar">
        <div className="flex flex-wrap gap-3 py-1">
          {/* 橡皮擦工具 */}
          <div 
            onClick={() => setActiveEvent(activeEventId === 'eraser' ? null : 'eraser')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all border flex items-center gap-2 text-sm font-medium ${
              activeEventId === 'eraser' ? 'border-gray-900 bg-gray-900 text-white shadow-lg scale-105' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Eraser size={14} /> 擦除
          </div>

          {events.map(event => (
            <div 
              key={event.id}
              onClick={() => setActiveEvent(event.id === activeEventId ? null : event.id)}
              onContextMenu={(e) => handleContextMenu(e, event.id)}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-all border flex items-center gap-2 text-sm ${
                activeEventId === event.id ? 'shadow-lg scale-105 ring-2 ring-gray-900 ring-offset-2 border-transparent' : 'hover:shadow-md'
              } ${event.color}`}
            >
              <span className="font-medium">{event.name}</span>
              <span className="text-[10px] opacity-70 bg-black/5 px-2 py-0.5 rounded-md font-bold">{event.scorePerSlot}</span>
            </div>
          ))}
        </div>
        
        {isAdding && (
          <div className="mt-6 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 flex flex-col gap-3 shadow-sm">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="New Event Name"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              autoFocus
            />
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                placeholder="Score"
                className="w-20 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              />
              <span className="text-xs text-gray-500 font-medium">pts / 30min</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors shadow-sm">
                <Check size={14} /> Save
              </button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors shadow-sm">
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mt-6 w-full py-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 flex-shrink-0 text-sm font-bold uppercase tracking-widest shadow-sm"
        >
          <Plus size={16} /> Add Event
        </button>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4">编辑事件</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">事件名称</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">分数 (每 30 分钟)</label>
                <input
                  type="number"
                  value={editScore}
                  onChange={e => setEditScore(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-2 block">事件颜色</label>
                <div className="grid grid-cols-7 gap-2 max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
                  {EVENT_COLORS.map(color => {
                    const bgColorClass = color.split(' ')[0]; // 提取 bg-xxx-50/80
                    return (
                      <div 
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-all flex items-center justify-center ${bgColorClass} ${
                          editColor === color 
                            ? 'ring-2 ring-offset-2 ring-gray-800 scale-110 shadow-sm' 
                            : 'hover:scale-110 hover:shadow-sm border border-transparent hover:border-gray-200'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setEditingId(null)}
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 py-2 rounded-xl bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu - Rendered via React Portal in a real app, but here we use fixed + high z-index and ensure no parent transforms */}
      {contextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-gray-200 py-1 w-24 overflow-hidden text-sm"
          style={{ 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`,
            margin: 0
          }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              startEdit(contextMenu.id);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
          >
            <Edit2 size={14} /> 编辑
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(contextMenu.id);
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <Trash2 size={14} /> 删除
          </button>
        </div>
      )}
    </div>
  );
}