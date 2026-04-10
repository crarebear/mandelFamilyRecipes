import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface BookCoverProps {
  onOpen: () => void;
  isLoggedIn: boolean;
  hasPasswordAccess: boolean;
  onPasswordCorrect: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpen, isLoggedIn, hasPasswordAccess, onPasswordCorrect }) => {
  const [phase, setPhase] = useState<'initial' | 'password'>(hasPasswordAccess ? 'initial' : 'initial');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (password === 'iloveDobby!81920') {
      onPasswordCorrect();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

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

        <div className="flex flex-col items-center gap-10">
          <p className="text-[#F7F2EC] opacity-40 font-sans max-w-sm text-lg leading-relaxed">
            A minimalist collection of shared flavors, hand-drafted and AI-refined for the modern kitchen.
          </p>

          <div className="h-24 flex lg:items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {phase === 'initial' ? (
                <motion.button 
                  key="initial-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={hasPasswordAccess ? onOpen : () => setPhase('password')}
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
                </motion.button>
              ) : (
                <motion.div 
                  key="password-entry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    x: error ? [0, -10, 10, -10, 10, 0] : 0
                  }}
                  transition={{ 
                    x: { duration: 0.4, ease: "easeInOut" }
                  }}
                  className="flex flex-col items-center gap-4 w-full max-w-sm"
                >
                  <div className="relative w-full">
                    <input 
                      type="password"
                      autoFocus
                      placeholder="Family Passcode"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      className={`w-full bg-white/5 border-2 ${error ? 'border-red-500' : 'border-[#D49A00]/30'} rounded-2xl px-6 py-4 text-[#F7F2EC] font-serif text-xl focus:outline-none focus:border-[#D49A00] transition-all text-center placeholder:opacity-30`}
                    />
                    <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 text-[#D49A00]/50" size={20} />
                  </div>
                  <button 
                    onClick={handleVerify}
                    className="flex items-center gap-2 text-[#D49A00] font-serif italic text-lg hover:text-[#F7F2EC] transition-colors group"
                  >
                    <span>Unlock Vault</span>
                    <ArrowRight size={18} className="translate-y-px group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
