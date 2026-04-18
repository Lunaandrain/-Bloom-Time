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
      {/* Global glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[4px] z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
        className="z-10 flex flex-col items-center text-center p-12"
      >
        <h1 className="font-artistic text-7xl md:text-9xl text-white mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-wide">
          Bloom Time
        </h1>
        <p className="text-xl md:text-2xl text-white/95 font-light tracking-[0.2em] mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          种下时间，收获花园
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            href="/schedule"
            className="px-8 py-3 rounded-full bg-white/20 hover:bg-white/30 border border-white/50 text-white transition-all duration-300 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 font-light tracking-widest"
          >
            开始打卡
          </Link>
          <Link 
            href="/garden"
            className="px-8 py-3 rounded-full bg-black/20 hover:bg-black/30 border border-white/20 text-white transition-all duration-300 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 font-light tracking-widest"
          >
            去看看花
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