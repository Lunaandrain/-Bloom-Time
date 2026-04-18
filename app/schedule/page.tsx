'use client';
import EventPanel from '@/components/schedule/EventPanel';
import Timeline from '@/components/schedule/Timeline';
import HealthPanel from '@/components/schedule/HealthPanel';
import { format } from 'date-fns';

export default function SchedulePage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-8 flex gap-6 h-screen">
      <div className="w-64 flex-shrink-0">
        <EventPanel />
      </div>
      
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <Timeline date={today} />
      </div>
      
      <div className="w-72 flex-shrink-0">
        <HealthPanel date={today} />
      </div>
    </div>
  );
}