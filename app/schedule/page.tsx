'use client';
import { useState } from 'react';
import EventPanel from '@/components/schedule/EventPanel';
import Timeline from '@/components/schedule/Timeline';
import HealthPanel from '@/components/schedule/HealthPanel';
import { format } from 'date-fns';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  return (
    <div className="w-full mx-auto px-6 pt-24 pb-8 flex gap-8 h-screen bg-[#F8F9FB]">
      {/* 左侧边栏 */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-8 h-full">
        {/* 事件配置区 */}
        <div className="flex-grow min-h-0">
          <EventPanel />
        </div>

        {/* 健康小组件 */}
        <div className="flex-shrink-0">
          <HealthPanel date={currentDate} />
        </div>
      </div>
      
      {/* 右侧主时间轴 (平铺 4 列) */}
      <div className="flex-grow bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50/50 p-8 h-full overflow-hidden flex flex-col">
        <Timeline date={currentDate} onDateChange={setCurrentDate} />
      </div>
    </div>
  );
}