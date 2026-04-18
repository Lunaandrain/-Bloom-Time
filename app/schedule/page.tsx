'use client';
import EventPanel from '@/components/schedule/EventPanel';
import Timeline from '@/components/schedule/Timeline';
import HealthPanel from '@/components/schedule/HealthPanel';
import { format } from 'date-fns';

export default function SchedulePage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 pt-24 pb-8 flex gap-6 h-screen">
      {/* 左侧边栏 (w-72) */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-6 h-full">
        {/* 健康小组件 */}
        <div className="flex-shrink-0">
          <HealthPanel date={today} />
        </div>
        
        {/* 事件配置区 */}
        <div className="flex-grow min-h-0">
          <EventPanel />
        </div>
      </div>
      
      {/* 右侧主时间轴 (平铺 4 列) */}
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full overflow-hidden flex flex-col">
        <Timeline date={today} />
      </div>
    </div>
  );
}