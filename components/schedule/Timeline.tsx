'use client';
import { useState, useCallback, useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

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

export default function Timeline({ date, onDateChange }: { date: string, onDateChange?: (date: string) => void }) {
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

  const handlePrevDay = () => {
    if (onDateChange) onDateChange(format(subDays(new Date(date), 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    if (onDateChange) onDateChange(format(addDays(new Date(date), 1), 'yyyy-MM-dd'));
  };

  return (
    <div className="h-full flex flex-col select-none overflow-hidden">
      <div className="flex justify-between items-end mb-6 flex-shrink-0 px-2">
        <div className="flex items-center gap-2 bg-slate-50/50 rounded-xl p-1 border border-slate-100 shadow-sm">
          <button 
            onClick={handlePrevDay} 
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
            title="前一天"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2 px-3 relative group">
            <CalendarIcon size={18} className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{date}</h2>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => { if(e.target.value && onDateChange) onDateChange(e.target.value) }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <button 
            onClick={handleNextDay} 
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
            title="后一天"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="text-3xl font-bold text-slate-800 tracking-tight flex items-baseline gap-1">
          {record.totalScore} <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">pts</span>
        </div>
      </div>
      
      <div className="flex-grow grid grid-cols-4 gap-8 min-h-0 px-2" onMouseLeave={() => setIsPainting(false)}>
        {COLUMNS.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col h-full relative">
            {/* Column Divider */}
            {colIndex > 0 && (
              <div className="absolute left-[-16px] top-0 bottom-0 w-px bg-slate-100" />
            )}
            
            <h3 className="text-[10px] font-semibold text-slate-400 mb-3 text-left uppercase tracking-[0.15em] border-b border-slate-100 pb-2 flex-shrink-0">
              {col.title}
            </h3>
            
            <div className="flex-grow flex flex-col gap-[5px] min-h-0 py-1">
              {col.slots.map(time => {
                const eventId = record.timeBlocks[time];
                const event = events.find(e => e.id === eventId);
                const activeEvent = events.find(e => e.id === activeEventId);
                
                return (
                  <div key={time} className="flex-grow flex items-stretch group min-h-0 relative">
                    <div className="w-12 flex-shrink-0 flex items-center justify-end pr-3 relative">
                      <span className="text-[10px] text-slate-400 font-medium tracking-wide group-hover:text-slate-600 transition-colors">{time}</span>
                      {/* Timeline Tick */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-px bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                      {/* Vertical Line Segment */}
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-slate-100"></div>
                    </div>
                    
                    <div className="flex-grow py-[1px] pl-2 pr-1 min-h-0 relative">
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onMouseDown={() => {
                          if (activeEventId) {
                            setIsPainting(true);
                            updateTimeBlock(date, time, activeEventId);
                          }
                        }}
                        onMouseEnter={() => handlePaint(time)}
                        className={`w-full h-full min-h-0 transition-all duration-200 cursor-pointer flex items-center justify-center px-4 relative overflow-hidden group/crystal ${
                          event 
                            ? `${event.color} rounded-[10px] !border-0 shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.08)] backdrop-blur-xl` 
                            : 'rounded-[8px] bg-transparent border border-transparent hover:border-dashed hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {event && (
                          <>
                            {/* 水晶质感：矩形玻璃上层强反光 */}
                            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/90 to-white/10 pointer-events-none" />
                            
                            {/* 水晶质感：整体玻璃对角线折射 */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/40 pointer-events-none" />
                            
                            {/* 水晶质感：边缘清透高光框 */}
                            <div className="absolute inset-0 border-[1.5px] border-white/90 rounded-[10px] pointer-events-none" />
                            
                            {/* 水晶质感：底部暗部折射增强立体感 */}
                            <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/[0.08] to-transparent pointer-events-none" />
                            
                            {/* 悬浮反光扫过动画 */}
                            <div className="absolute inset-0 opacity-0 group-hover/crystal:opacity-100 bg-gradient-to-tr from-transparent via-white/80 to-transparent -translate-x-[100%] group-hover/crystal:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

                            <span className="text-[13px] font-extrabold tracking-wide truncate relative z-10 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] text-slate-800">{event.name}</span>
                          </>
                        )}
                        {!event && activeEventId && activeEventId !== 'eraser' && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: activeEvent?.color?.split(' ')[0]?.replace('bg-', '') || 'currentColor' }} />
                        )}
                      </motion.div>
                    </div>
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