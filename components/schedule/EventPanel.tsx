'use client';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Plus } from 'lucide-react';

export default function EventPanel() {
  const { events, activeEventId, setActiveEvent } = useScheduleStore();

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">事件配置</h2>
      <div className="flex-grow overflow-y-auto space-y-3">
        {events.map(event => (
          <div 
            key={event.id}
            onClick={() => setActiveEvent(event.id === activeEventId ? null : event.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
              activeEventId === event.id ? 'border-green-400 scale-105 shadow-md' : 'border-transparent hover:bg-gray-50'
            } ${event.color}`}
          >
            <div className="font-medium text-gray-800">{event.name}</div>
            <div className="text-sm text-gray-600 opacity-80">{event.scorePerSlot} 分 / 30分</div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} /> 添加事件
      </button>
    </div>
  );
}