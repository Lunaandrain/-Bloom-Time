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
    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">健康数据</h2>
      
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">今日体重 (kg)</label>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={localWeight}
            onChange={(e) => setLocalWeight(e.target.value)}
            className="flex-grow px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 w-full min-w-0"
            placeholder="例如: 65.5"
          />
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            记录
          </button>
        </div>
        
        {record?.weightScore !== undefined && record.weightScore !== 0 && (
          <div className={`mt-3 text-sm font-medium ${record.weightScore > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {record.weightScore > 0 ? '🎉 体重减轻，隐藏分 +10' : '⚠️ 体重增加，隐藏分 -10'}
          </div>
        )}
      </div>
    </div>
  );
}