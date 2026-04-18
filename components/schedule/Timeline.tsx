'use client';
import { useState, useCallback, useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { motion } from 'framer-motion';

const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

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
    <div className="h-full flex flex-col select-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{date}</h2>
        <div className="text-2xl font-black text-green-600">
          {record.totalScore} <span className="text-sm text-gray-500 font-normal">分</span>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-4" onMouseLeave={() => setIsPainting(false)}>
        {timeSlots.map(time => {
          const eventId = record.timeBlocks[time];
          const event = events.find(e => e.id === eventId);
          const activeEvent = events.find(e => e.id === activeEventId);
          
          return (
            <div key={time} className="flex items-center group mb-1">
              <div className="w-14 text-sm text-gray-400 font-medium">{time}</div>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                onMouseDown={() => {
                  if (activeEventId) {
                    setIsPainting(true);
                    updateTimeBlock(date, time, activeEventId);
                  }
                }}
                onMouseEnter={() => handlePaint(time)}
                className={`flex-grow h-12 rounded-md border border-gray-100 transition-colors cursor-pointer flex items-center px-4 ${
                  event ? event.color : 'bg-gray-50 hover:bg-gray-100'
                }`}
                style={!event && activeEventId ? { '--hover-color': activeEvent?.color } as any : {}}
              >
                {event && <span className="text-gray-700 font-medium">{event.name}</span>}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}