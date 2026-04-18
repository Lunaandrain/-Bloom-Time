import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subDays, format } from 'date-fns';

export type EventConfig = {
  id: string;
  name: string;
  scorePerSlot: number;
  color: string;
};

export type DailyRecord = {
  date: string;
  weight: number | null;
  weightScore: number;
  timeBlocks: Record<string, string>; // "00:00" -> eventId
  totalScore: number;
};

interface ScheduleState {
  events: EventConfig[];
  records: Record<string, DailyRecord>; // date -> record
  activeEventId: string | null;
  addEvent: (event: Omit<EventConfig, 'id'>) => void;
  setActiveEvent: (id: string | null) => void;
  updateTimeBlock: (date: string, timeKey: string, eventId: string) => void;
  updateWeight: (date: string, weight: number) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      events: [
        { id: '1', name: '睡觉', scorePerSlot: 10, color: 'bg-blue-200' },
        { id: '2', name: '学习', scorePerSlot: 20, color: 'bg-green-200' },
        { id: '3', name: '娱乐', scorePerSlot: 0, color: 'bg-yellow-200' },
      ],
      records: {},
      activeEventId: null,
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: Date.now().toString() }]
      })),
      setActiveEvent: (id) => set({ activeEventId: id }),
      updateTimeBlock: (date, timeKey, eventId) => set((state) => {
        const record = state.records[date] || { date, weight: null, weightScore: 0, timeBlocks: {}, totalScore: 0 };
        const newTimeBlocks = { ...record.timeBlocks, [timeKey]: eventId };
        
        let newScore = record.weightScore;
        Object.values(newTimeBlocks).forEach(eId => {
          const evt = state.events.find(e => e.id === eId);
          if (evt) newScore += evt.scorePerSlot;
        });

        return {
          records: {
            ...state.records,
            [date]: { ...record, timeBlocks: newTimeBlocks, totalScore: newScore }
          }
        };
      }),
      updateWeight: (date, weight) => set((state) => {
        const record = state.records[date] || { date, weight: null, weightScore: 0, timeBlocks: {}, totalScore: 0 };
        
        const yesterdayStr = format(subDays(new Date(date), 1), 'yyyy-MM-dd');
        const yesterdayRecord = state.records[yesterdayStr];
        
        let weightScore = 0;
        if (yesterdayRecord && yesterdayRecord.weight !== null && weight !== null) {
          if (weight < yesterdayRecord.weight) weightScore = 10;
          else if (weight > yesterdayRecord.weight) weightScore = -10;
        }

        let newScore = weightScore;
        Object.values(record.timeBlocks).forEach(eId => {
          const evt = state.events.find(e => e.id === eId);
          if (evt) newScore += evt.scorePerSlot;
        });

        return {
          records: {
            ...state.records,
            [date]: { ...record, weight, weightScore, totalScore: newScore }
          }
        };
      })
    }),
    { name: 'garden-calendar-storage' }
  )
);