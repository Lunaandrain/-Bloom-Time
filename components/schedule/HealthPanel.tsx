'use client';
import { useState, useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';

import { TrendingUp, TrendingDown, Settings2, X } from 'lucide-react';

export default function HealthPanel({ date }: { date: string }) {
  const { records, updateWeight, weightConfig, updateWeightConfig } = useScheduleStore();
  const record = records[date];
  const [localWeight, setLocalWeight] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [lossScore, setLossScore] = useState('10');
  const [gainScore, setGainScore] = useState('-10');

  useEffect(() => {
    if (weightConfig) {
      setLossScore(weightConfig.lossScore.toString());
      setGainScore(weightConfig.gainScore.toString());
    }
  }, [weightConfig]);

  useEffect(() => {
    if (record?.weight !== undefined && record?.weight !== null) {
      setLocalWeight(record.weight.toString());
    } else {
      setLocalWeight('');
    }
  }, [record?.weight, date]);

  const handleSave = () => {
    const num = parseFloat(localWeight);
    if (!isNaN(num)) {
      updateWeight(date, num);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSaveConfig = () => {
    const newLoss = parseInt(lossScore) || 0;
    const newGain = parseInt(gainScore) || 0;
    updateWeightConfig({ lossScore: newLoss, gainScore: newGain });
    setIsConfiguring(false);

    const num = parseFloat(localWeight);
    if (!isNaN(num)) {
      updateWeight(date, num);
    }
  };

  const isPositive = (record?.weightScore ?? 0) > 0;
  const isNegative = (record?.weightScore ?? 0) < 0;

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50/50 w-full flex flex-col relative overflow-hidden min-h-[190px]">
      {/* Decorative gradient blob in the background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl pointer-events-none"></div>

      <button
        onClick={() => setIsConfiguring(!isConfiguring)}
        className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600 transition-colors z-20"
      >
        {isConfiguring ? <X size={18} /> : <Settings2 size={18} />}
      </button>

      {isConfiguring ? (
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Score Config</h2>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Lose Weight</label>
              <input 
                type="number" 
                value={lossScore} 
                onChange={e => setLossScore(e.target.value)} 
                className="w-full bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2 text-sm font-bold text-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-400" 
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Gain Weight</label>
              <input 
                type="number" 
                value={gainScore} 
                onChange={e => setGainScore(e.target.value)} 
                className="w-full bg-rose-50/50 border border-rose-100 rounded-lg px-3 py-2 text-sm font-bold text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-400" 
              />
            </div>
          </div>
          <button 
            onClick={handleSaveConfig} 
            className="w-full mt-auto bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Save Config
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Today's Weight</h2>
          
          <div className="flex items-end gap-3 mb-6">
            <div className="flex items-baseline gap-1">
              <input 
                type="number" 
                value={localWeight}
                onChange={(e) => setLocalWeight(e.target.value)}
                onBlur={handleSave}
                className="w-24 text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors p-0"
                placeholder="0.0"
              />
              <span className="text-gray-400 font-medium text-lg mb-1">kg</span>
            </div>
            
            {(isPositive || isNegative) && (
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg mb-2 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {isPositive ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {record.weightScore > 0 ? `+${record.weightScore}` : record.weightScore} pt
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
            <span className="text-xs text-gray-400 font-medium">Hidden Score Impact</span>
            <button 
              onClick={handleSave}
              disabled={isSaved}
              className={`text-xs font-bold transition-colors uppercase tracking-wider ${
                isSaved 
                  ? 'text-emerald-500 cursor-default' 
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              {isSaved ? 'Saved ✓' : 'Update'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}