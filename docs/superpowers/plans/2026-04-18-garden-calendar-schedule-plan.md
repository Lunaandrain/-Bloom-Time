# 日程系统 (Schedule Page) 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 构建一个基于 Next.js 的日程管理页面，支持自定义事件配置、拖拽涂抹式的时间轴填涂交互，以及体重记录隐藏分计算。

**架构：** 前端使用 Next.js App Router，状态管理使用 Zustand 存储在客户端。采用三栏布局：左侧事件配置，中间时间轴，右侧健康记录。

**技术栈：** Next.js 14, React, Tailwind CSS, Framer Motion, Zustand, Lucide React (图标)

---

### 任务 1：初始化项目与基础依赖

**文件：**
- 创建：`package.json`, `app/layout.tsx`, `app/page.tsx` 等 Next.js 基础文件
- 创建：`store/useScheduleStore.ts`

- [ ] **步骤 1：初始化 Next.js 项目**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes
```

- [ ] **步骤 2：安装额外依赖**
```bash
npm install framer-motion zustand lucide-react clsx tailwind-merge
```

- [ ] **步骤 3：配置全局 Zustand Store (基础状态)**
```typescript
// store/useScheduleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        
        // 重新计算总分
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
        // 简化版：这里需要实现与昨天的对比逻辑，将在后续组件中完善
        const record = state.records[date] || { date, weight: null, weightScore: 0, timeBlocks: {}, totalScore: 0 };
        return {
          records: {
            ...state.records,
            [date]: { ...record, weight }
          }
        };
      })
    }),
    { name: 'garden-calendar-storage' }
  )
);
```

- [ ] **步骤 4：Commit**
```bash
git add .
git commit -m "chore: initialize next.js and zustand store"
```

### 任务 2：创建应用布局与导航栏

**文件：**
- 修改：`app/layout.tsx`
- 创建：`components/Navbar.tsx`

- [ ] **步骤 1：创建 Navbar 组件**
```tsx
// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: '首页' },
    { href: '/schedule', label: '日程' },
    { href: '/garden', label: '花园' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-green-700">Bloom Time</div>
        <div className="flex space-x-8">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`transition-colors ${pathname === link.href ? 'text-green-600 font-medium' : 'text-gray-500 hover:text-green-500'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **步骤 2：修改 Layout 引入 Navbar**
```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bloom Time - 花园日历",
  description: "种下时间，收获花园",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-stone-50 min-h-screen pt-16`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **步骤 3：Commit**
```bash
git add app/layout.tsx components/Navbar.tsx
git commit -m "feat: add global navbar and layout"
```

### 任务 3：实现左侧事件配置面板

**文件：**
- 创建：`app/schedule/page.tsx`
- 创建：`components/schedule/EventPanel.tsx`

- [ ] **步骤 1：创建日程主页面骨架**
```tsx
// app/schedule/page.tsx
'use client';
import EventPanel from '@/components/schedule/EventPanel';

export default function SchedulePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6 h-[calc(100vh-4rem)]">
      {/* 左侧：事件配置 */}
      <div className="w-64 flex-shrink-0">
        <EventPanel />
      </div>
      
      {/* 中间：时间轴 (占位) */}
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
        Timeline Placeholder
      </div>
      
      {/* 右侧：健康数据 (占位) */}
      <div className="w-72 flex-shrink-0">
        Health Panel Placeholder
      </div>
    </div>
  );
}
```

- [ ] **步骤 2：实现 EventPanel 组件**
```tsx
// components/schedule/EventPanel.tsx
'use client';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Plus } from 'lucide-react';

export default function EventPanel() {
  const { events, activeEventId, setActiveEvent } = useScheduleStore();

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">事件配置</h2>
      <div className="flex-grow overflow-y-auto space-y-3">
        {events.map(event => (
          <div 
            key={event.id}
            onClick={() => setActiveEvent(event.id === activeEventId ? null : event.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
              activeEventId === event.id ? 'border-green-400 scale-105 shadow-md' : 'border-transparent hover:bg-gray-50'
            } ${event.color}`}
          >
            <div className="font-medium text-gray-800">{event.name}</div>
            <div className="text-sm text-gray-600 opacity-80">{event.scorePerSlot} 分 / 30分</div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} /> 添加事件
      </button>
    </div>
  );
}
```

- [ ] **步骤 3：Commit**
```bash
git add app/schedule/page.tsx components/schedule/EventPanel.tsx
git commit -m "feat: add event configuration panel"
```

### 任务 4：实现主时间轴与涂抹交互

**文件：**
- 创建：`components/schedule/Timeline.tsx`
- 修改：`app/schedule/page.tsx`

- [ ] **步骤 1：实现 Timeline 组件与涂抹逻辑**
```tsx
// components/schedule/Timeline.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { motion } from 'framer-motion';

// 生成 48 个时间块的 key ("00:00", "00:30"...)
const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

export default function Timeline({ date }: { date: string }) {
  const { events, activeEventId, records, updateTimeBlock } = useScheduleStore();
  const record = records[date] || { timeBlocks: {}, totalScore: 0 };
  
  const [isPainting, setIsPainting] = useState(false);

  // 处理涂抹
  const handlePaint = useCallback((timeKey: string) => {
    if (isPainting && activeEventId) {
      updateTimeBlock(date, timeKey, activeEventId);
    }
  }, [isPainting, activeEventId, date, updateTimeBlock]);

  // 全局鼠标松开事件，停止涂抹
  useEffect(() => {
    const handleMouseUp = () => setIsPainting(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="h-full flex flex-col">
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
```

- [ ] **步骤 2：将 Timeline 接入页面**
```tsx
// 修改 app/schedule/page.tsx
'use client';
import EventPanel from '@/components/schedule/EventPanel';
import Timeline from '@/components/schedule/Timeline';
import { format } from 'date-fns'; // 需要 npm install date-fns

export default function SchedulePage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6 h-[calc(100vh-4rem)]">
      <div className="w-64 flex-shrink-0">
        <EventPanel />
      </div>
      
      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <Timeline date={today} />
      </div>
      
      <div className="w-72 flex-shrink-0">
        Health Panel Placeholder
      </div>
    </div>
  );
}
```

- [ ] **步骤 3：安装 date-fns 并 Commit**
```bash
npm install date-fns
git add components/schedule/Timeline.tsx app/schedule/page.tsx
git commit -m "feat: add interactive timeline with paint functionality"
```

### 任务 5：实现健康面板与隐藏分逻辑

**文件：**
- 创建：`components/schedule/HealthPanel.tsx`
- 修改：`app/schedule/page.tsx`
- 修改：`store/useScheduleStore.ts`

- [ ] **步骤 1：完善 Store 中的体重计算逻辑**
```typescript
// 修改 store/useScheduleStore.ts 中的 updateWeight 方法
// 在顶部引入 import { subDays, format } from 'date-fns';

updateWeight: (date, weight) => set((state) => {
  const record = state.records[date] || { date, weight: null, weightScore: 0, timeBlocks: {}, totalScore: 0 };
  
  // 获取昨天的记录
  const yesterdayStr = format(subDays(new Date(date), 1), 'yyyy-MM-dd');
  const yesterdayRecord = state.records[yesterdayStr];
  
  let weightScore = 0;
  if (yesterdayRecord && yesterdayRecord.weight !== null && weight !== null) {
    if (weight < yesterdayRecord.weight) weightScore = 10;
    else if (weight > yesterdayRecord.weight) weightScore = -10;
  }

  // 重新计算总分
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
```

- [ ] **步骤 2：实现 HealthPanel 组件**
```tsx
// components/schedule/HealthPanel.tsx
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
            className="flex-grow px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="例如: 65.5"
          />
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
```

- [ ] **步骤 3：接入 HealthPanel 并 Commit**
```tsx
// 修改 app/schedule/page.tsx，将占位符替换为组件
// 引入 import HealthPanel from '@/components/schedule/HealthPanel';
// 替换: <div className="w-72 flex-shrink-0"><HealthPanel date={today} /></div>
```
```bash
git add store/useScheduleStore.ts components/schedule/HealthPanel.tsx app/schedule/page.tsx
git commit -m "feat: add health panel and weight tracking score logic"
```
