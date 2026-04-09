import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Package, Sparkles, Plus, Trash2 } from 'lucide-react';

interface PantryManagerProps {
  staples: string[];
  onToggleStaple: (staple: string) => void;
  onClose: () => void;
}

const DEFAULT_STAPLES = [
  'All-purpose Flour', 'Granulated Sugar', 'Brown Sugar', 'Baking Powder', 'Baking Soda',
  'Kosher Salt', 'Black Pepper', 'Olive Oil', 'Vegetable Oil', 'Butter',
  'Milk', 'Eggs', 'Garlic', 'Onions', 'Rice', 'Pasta', 'Chicken Stock',
  'Soy Sauce', 'Honey', 'Maple Syrup'
];

export const PantryManager: React.FC<PantryManagerProps> = ({ staples, onToggleStaple, onClose }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    if (!staples.includes(newItem.trim())) {
      onToggleStaple(newItem.trim());
    }
    setNewItem('');
  };

  // Combine defaults with current staples (uniquely)
  const allPossible = Array.from(new Set([...DEFAULT_STAPLES, ...staples])).sort();

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-stone-200 pb-8 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Package className="text-[#BC4A3C]" size={32} />
             <h2 className="text-5xl font-serif tracking-tighter">Kitchen Cabinet.</h2>
          </div>
          <p className="font-serif italic text-stone-600 text-xl">Manage the items you usually have in stock.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleAddItem} className="relative group">
            <input 
              type="text" 
              placeholder="Add custom staple..." 
              className="bg-white border-2 border-stone-200 rounded-xl px-6 py-3 pr-12 font-serif italic focus:outline-none focus:border-[#D49A00] transition-all w-64 shadow-sm"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-[#D49A00] transition-colors">
              <Plus size={20} />
            </button>
          </form>
          <button 
            onClick={onClose}
            className="btn-retro font-bold text-sm bg-stone-900 text-white px-8"
          >
            Return to Library
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence>
          {allPossible.map((staple) => {
            const isSelected = staples.includes(staple);

            return (
              <motion.div
                key={staple}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <button
                  onClick={() => onToggleStaple(staple)}
                  className={`w-full p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-4 text-left relative overflow-hidden ${
                    isSelected 
                      ? 'bg-stone-900 border-stone-900 text-[#F7F2EC] shadow-xl' 
                      : 'bg-white border-stone-100 text-stone-900 hover:border-[#D49A00]'
                  }`}
                >
                  <div className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-[#D49A00] text-stone-900' : 'bg-stone-100 text-stone-300 group-hover:bg-stone-200'}`}>
                    {isSelected ? <Check size={16} /> : <div className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] leading-tight pr-6">
                    {staple}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute -right-4 -bottom-4 opacity-5">
                       <Package size={100} />
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Custom items: remove. Default items: just toggle off if on.
                    if (isSelected) onToggleStaple(staple);
                  }}
                  title="Remove from Cabinet"
                  className={`absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-all z-10 ${isSelected ? 'text-white/60 hover:text-white' : 'text-stone-900/30 hover:text-red-600'}`}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-12 bg-white p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 border-2 border-stone-100 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Sparkles size={160} />
         </div>
         <div className="w-20 h-20 bg-[#D49A00] rounded-3xl flex items-center justify-center text-stone-900 shadow-2xl rotate-6 shrink-0">
            <Sparkles size={40} />
         </div>
         <div className="space-y-2">
           <h4 className="text-2xl font-serif italic text-stone-900">Intelligent Replenishment.</h4>
           <p className="font-serif italic text-stone-600 text-lg max-w-2xl">
             "Your cabinet is synchronized with the archive. Toggling items here updates every recipe's status instantly, ensuring you always know what's mission-ready."
           </p>
         </div>
      </div>
    </div>
  );
};
