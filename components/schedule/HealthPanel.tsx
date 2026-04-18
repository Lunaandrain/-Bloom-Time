'use client';
import { useState, useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';

export default function HealthPanel({ date }: { date: string }) {
  const { records, updateWeight } = useScheduleStore();
  const record = records[date];
  const [localWeight, setLocalWeight] = useState<string>('');

  useEffect(() => {
    if (record?.weight) setLocalWeight(record.weight.toString());
  }, [record?.weight]);

  const handleSave = () => {
    const num = parseFloat(localWeight);
    if (!isNaN(num)) {
      updateWeight(date, num);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-gray-100 w-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800">今日体重</h2>
        {record?.weightScore !== undefined && record.weightScore !== 0 && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${record.weightScore > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {record.weightScore > 0 ? '+10 分' : '-10 分'}
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          value={localWeight}
          onChange={(e) => setLocalWeight(e.target.value)}
          className="flex-grow px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 w-full min-w-0 bg-gray-50"
          placeholder="kg"
        />
        <button 
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap font-medium shadow-sm"
        >
          记录
        </button>
      </div>
    </div>
  );
}