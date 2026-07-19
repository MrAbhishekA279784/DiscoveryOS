import React from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#07070A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6]"
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-serif text-white tracking-wider">DiscoveryOS</span>
          <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Restoring Session</span>
        </div>
      </div>
    </div>
  );
}
