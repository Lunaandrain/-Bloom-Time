'use client';
import { useState, useEffect, useRef } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Plus, Check, X, Eraser, Edit2, Trash2 } from 'lucide-react';

const EVENT_COLORS = [
  'bg-red-200', 'bg-orange-200', 'bg-amber-200', 'bg-lime-200', 
  'bg-green-200', 'bg-emerald-200', 'bg-teal-200', 'bg-cyan-200', 
  'bg-sky-200', 'bg-blue-200', 'bg-indigo-200', 'bg-violet-200', 
  'bg-purple-200', 'bg-fuchsia-200', 'bg-pink-200', 'bg-rose-200'
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
    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col relative" style={{ transform: 'none' }}>
      <h2 className="text-lg font-bold text-gray-800 mb-4">事件配置</h2>
      
      <div className="flex-grow overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {/* 橡皮擦工具 */}
          <div 
            onClick={() => setActiveEvent(activeEventId === 'eraser' ? null : 'eraser')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all border-2 flex items-center gap-1.5 text-sm font-medium ${
              activeEventId === 'eraser' ? 'border-gray-800 bg-gray-200 text-gray-900 shadow-md scale-105' : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eraser size={14} /> 橡皮擦
          </div>

          {events.map(event => (
            <div 
              key={event.id}
              onClick={() => setActiveEvent(event.id === activeEventId ? null : event.id)}
              onContextMenu={(e) => handleContextMenu(e, event.id)}
              className={`px-3 py-1.5 rounded-full cursor-pointer transition-all border-2 flex items-center gap-1.5 text-sm ${
                activeEventId === event.id ? 'border-gray-800 shadow-md scale-105' : 'border-transparent hover:brightness-95'
              } ${event.color}`}
            >
              <span className="font-medium text-gray-800">{event.name}</span>
              <span className="text-xs text-gray-700 opacity-80 bg-white/30 px-1.5 rounded-full">{event.scorePerSlot}</span>
            </div>
          ))}
        </div>
        
        {isAdding && (
          <div className="mt-4 p-3 rounded-xl border-2 border-green-400 bg-green-50/50 flex flex-col gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="事件名称"
              className="w-full px-2 py-1 text-sm rounded border border-green-200 focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                placeholder="分数"
                className="w-16 px-2 py-1 text-sm rounded border border-green-200 focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
              />
              <span className="text-xs text-gray-500">分/30分</span>
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={handleAdd} className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-green-600 transition-colors">
                <Check size={14} /> 保存
              </button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-300 transition-colors">
                <X size={14} /> 取消
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2 flex-shrink-0 text-sm font-medium"
        >
          <Plus size={16} /> 添加新事件
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
                <div className="flex flex-wrap gap-2">
                  {EVENT_COLORS.map(color => (
                    <div 
                      key={color}
                      onClick={() => setEditColor(color)}
                      className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${color} ${editColor === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-110'}`}
                    />
                  ))}
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