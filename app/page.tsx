'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  // Handle smooth scroll to schedule
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) { // scrolling down
        router.push('/schedule');
      }
    };
    
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 50) { // swiping up
        router.push('/schedule');
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [router]);

  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 极轻微的全局毛玻璃与暗角效果 */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-0"></div>
      
      {/* 扫描线效果 (Scanlines) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ background: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.8) 50%)', backgroundSize: '100% 4px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
        className="z-10 flex flex-col items-center text-center p-8 md:p-12 w-full max-w-4xl"
      >
        {/* Top Tag */}
        <div className="mb-6 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center gap-3 shadow-lg">
          <span className="bg-white text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
          <span className="text-white/90 text-xs font-light tracking-wide">Garden Calendar Journey Begins 2026</span>
        </div>

        <h1 className="font-artistic text-7xl md:text-[9rem] leading-none text-white mb-8 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-wide">
          Bloom Time
        </h1>
        
        <p className="text-base md:text-lg text-white/80 font-light tracking-[0.15em] mb-12 max-w-2xl leading-relaxed drop-shadow-md">
          种下时间，收获花园。Discover the beauty of time management in ways once unimaginable. Our pioneering schedule system brings deep-space exploration within reach.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <Link 
            href="/schedule"
            className="px-8 py-3 rounded-full bg-transparent border border-white/80 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm font-light tracking-[0.2em] text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            开始打卡 ↗
          </Link>
          <Link 
            href="/garden"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 font-light tracking-[0.2em] text-sm group drop-shadow-md"
          >
            去看看花 <span className="group-hover:translate-x-1 transition-transform">▶</span>
          </Link>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 z-10 flex flex-col items-center text-white/70"
      >
        <span className="text-sm font-light tracking-widest mb-2">向下滚动</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-4 h-4 border-r-2 border-b-2 border-white/70 rotate-45"
        ></motion.div>
      </motion.div>
    </main>
  );
}