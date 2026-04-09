import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChefHat, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (selectedStaples: string[]) => void;
}

const COMMON_STAPLES = [
  'All-purpose Flour', 'Granulated Sugar', 'Brown Sugar', 'Baking Powder', 'Baking Soda',
  'Kosher Salt', 'Black Pepper', 'Olive Oil', 'Vegetable Oil', 'Butter',
  'Milk', 'Eggs', 'Garlic', 'Onions', 'Rice', 'Pasta', 'Chicken Stock',
  'Soy Sauce', 'Honey', 'Maple Syrup'
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const toggleStaple = (staple: string) => {
    setSelected(prev => 
      prev.includes(staple) ? prev.filter(s => s !== staple) : [...prev, staple]
    );
  };

  return (
    <div className="onboarding-screen overflow-hidden">
      <div className="max-w-5xl w-full h-[80vh] bg-[#F7F2EC] shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-2xl flex overflow-hidden border border-white/20">
        
        {/* Decorative Sidebar */}
        <div className="w-1/3 bg-[#121212] p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 z-10">
            <div className="w-16 h-16 rounded-full bg-[#D49A00] flex items-center justify-center text-[#121212]">
              <ChefHat size={32} />
            </div>
            <h1 className="text-5xl font-serif text-[#F7F2EC] leading-tight tracking-tighter">
              Setting the <br/><span className="text-[#D49A00]">Cabinet.</span>
            </h1>
          </div>
          
          <div className="space-y-4 z-10">
             <div className="flex gap-2">
                {[1, 2].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-[#D49A00]' : 'w-4 bg-white/10'}`} />
                ))}
             </div>
             <p className="font-serif italic text-[#F7F2EC] opacity-30 text-sm">Step {step} of 2</p>
          </div>

          <div className="absolute -bottom-20 -left-20 w-64 h-64 border-[40px] border-white/5 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-16 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col justify-center space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-5xl font-serif text-[#121212]">Welcome to the Mandel Kitchen Archive.</h2>
                  <p className="text-xl font-serif italic text-stone-400 max-w-lg">
                    Before we unlock the recipes, we need to understand what you usually keep in your pantry.
                  </p>
                </div>
                
                <p className="text-stone-400 font-sans leading-relaxed max-w-sm">
                  This will allow our AI to intelligently let you know if you're ready to cook or if a grocery trip is needed.
                </p>

                <button 
                  onClick={() => setStep(2)}
                  className="btn-retro btn-retro-accent group"
                >
                  <span>Build my Cabinet</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif">What's in Stock?</h2>
                  <p className="font-serif italic text-stone-400">Select the items you generally have available.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {COMMON_STAPLES.map((staple) => (
                    <button
                      key={staple}
                      onClick={() => toggleStaple(staple)}
                      className={`p-5 rounded-lg border-2 font-serif transition-all flex items-center justify-between text-left ${
                        selected.includes(staple) 
                          ? 'bg-[#121212] text-[#F7F2EC] border-[#121212] shadow-xl' 
                          : 'bg-white border-[#E8E2D9] text-[#121212] hover:border-[#D49A00]'
                      }`}
                    >
                      <span className="text-sm font-bold uppercase tracking-tight">{staple}</span>
                      {selected.includes(staple) && <Check size={16} className="text-[#D49A00]" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-10 border-t border-[#E8E2D9]">
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-stone-400 font-serif italic hover:text-[#121212] transition-colors"
                  >
                    Wait, go back
                  </button>
                  <button 
                    onClick={() => onComplete(selected)}
                    className="btn-retro btn-retro-accent shadow-[0_15px_30px_rgba(214,154,0,0.4)]"
                  >
                    <Sparkles size={20} />
                    <span>Confirm Cabinet</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
