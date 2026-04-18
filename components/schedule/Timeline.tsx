'use client';
import { useState, useCallback, useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { motion } from 'framer-motion';

const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const COLUMNS = [
  { title: "凌晨 (0:00 - 6:00)", slots: timeSlots.slice(0, 12) },
  { title: "上午 (6:00 - 12:00)", slots: timeSlots.slice(12, 24) },
  { title: "下午 (12:00 - 18:00)", slots: timeSlots.slice(24, 36) },
  { title: "夜晚 (18:00 - 24:00)", slots: timeSlots.slice(36, 48) },
];

export default function Timeline({ date }: { date: string }) {
  const { events, activeEventId, records, updateTimeBlock } = useScheduleStore();
  const record = records[date] || { timeBlocks: {}, totalScore: 0 };
  
  const [isPainting, setIsPainting] = useState(false);

  const handlePaint = useCallback((timeKey: string) => {
    if (isPainting && activeEventId) {
      updateTimeBlock(date, timeKey, activeEventId);
    }
  }, [isPainting, activeEventId, date, updateTimeBlock]);

  useEffect(() => {
    const handleMouseUp = () => setIsPainting(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="h-full flex flex-col select-none overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">{date}</h2>
        <div className="text-2xl font-black text-green-600">
          {record.totalScore} <span className="text-sm text-gray-500 font-normal">分</span>
        </div>
      </div>
      
      <div className="flex-grow grid grid-cols-4 gap-6 min-h-0" onMouseLeave={() => setIsPainting(false)}>
        {COLUMNS.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col h-full">
            <h3 className="text-xs font-bold text-gray-400 mb-2 text-center uppercase tracking-wider flex-shrink-0">{col.title}</h3>
            <div className="flex-grow flex flex-col gap-1 min-h-0">
              {col.slots.map(time => {
                const eventId = record.timeBlocks[time];
                const event = events.find(e => e.id === eventId);
                const activeEvent = events.find(e => e.id === activeEventId);
                
                return (
                  <div key={time} className="flex-grow flex items-center group min-h-0">
                    <div className="w-10 flex-shrink-0 text-xs text-gray-400 font-medium text-right pr-2">{time}</div>
                    <motion.div 
                      whileTap={{ scale: 0.98 }}
                      onMouseDown={() => {
                        if (activeEventId) {
                          setIsPainting(true);
                          updateTimeBlock(date, time, activeEventId);
                        }
                      }}
                      onMouseEnter={() => handlePaint(time)}
                      className={`flex-grow h-full min-h-0 rounded-md border border-gray-100 transition-colors cursor-pointer flex items-center px-3 shadow-sm ${
                        event ? event.color : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      style={!event && activeEventId ? { '--hover-color': activeEvent?.color } as any : {}}
                    >
                      {event && <span className="text-gray-700 text-xs font-medium truncate">{event.name}</span>}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}