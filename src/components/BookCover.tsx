import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock } from 'lucide-react';

interface BookCoverProps {
  onOpen: () => void;
  isLoggedIn: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpen, isLoggedIn }) => {
  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Geometric Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#D49A00]"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2.5 }}
        className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#BC4A3C]"
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full text-center space-y-12 z-10"
      >
        <div className="space-y-2">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="text-[#F7F2EC] font-serif italic text-lg tracking-[0.3em] uppercase"
          >
            Digital Heirloom
          </motion.p>
          <h1 className="text-[#F7F2EC] text-7xl md:text-9xl font-serif tracking-tighter leading-none">
            Mandel<br/>
            <span className="text-[#D49A00]">Recipes.</span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="text-[#F7F2EC] opacity-40 font-sans max-w-sm text-lg leading-relaxed">
            A minimalist collection of shared flavors, hand-dratted and AI-refined for the modern kitchen.
          </p>

          <button 
            onClick={onOpen}
            className="group relative flex items-center gap-4 bg-[#D49A00] text-[#121212] px-12 py-5 rounded-full font-serif text-2xl font-bold shadow-[0_20px_40px_rgba(212,154,0,0.3)] hover:shadow-[0_25px_50px_rgba(212,154,0,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            {isLoggedIn ? (
              <>
                <Play size={24} fill="currentColor" />
                <span>Open Collection</span>
              </>
            ) : (
              <>
                <Lock size={22} />
                <span>Secure Entry</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-4 text-[#F7F2EC] opacity-20 font-serif text-sm tracking-widest uppercase py-4">
            <span className="w-8 h-px bg-current" />
            <span>EST. 2024</span>
            <span className="w-8 h-px bg-current" />
          </div>
        </div>
      </motion.div>

      {/* Subtle Vinyl Groove Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0 border-[40px] border-white rounded-full scale-[2]" />
        <div className="absolute inset-0 border-[60px] border-white rounded-full scale-[1.8]" />
        <div className="absolute inset-0 border-[80px] border-white rounded-full scale-[1.6]" />
      </div>
    </div>
  );
};
