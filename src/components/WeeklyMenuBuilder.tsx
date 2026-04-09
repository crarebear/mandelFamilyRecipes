import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, ShoppingBag, Plus, X, Copy, Check } from 'lucide-react';
import type { Recipe, MenuItem, DayOfWeek } from '../lib/mockData';

interface WeeklyMenuBuilderProps {
  menu: MenuItem[];
  recipes: Recipe[];
  staples: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onAddRecipe: (day: DayOfWeek, recipeId: string) => void;
  onClose: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyMenuBuilder: React.FC<WeeklyMenuBuilderProps> = ({ 
  menu, 
  recipes, 
  staples, 
  onRemove, 
  onClear, 
  onAddRecipe,
  onClose 
}) => {
  const [showSelector, setShowSelector] = React.useState<{ day: DayOfWeek } | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Aggregate Ingredients
  const getGroceryList = () => {
    const needed: Record<string, string[]> = {};
    const lowerStaples = staples.map(s => s.toLowerCase());

    menu.forEach(item => {
      const recipe = recipes.find(r => r.id === item.recipeId);
      if (!recipe) return;

      recipe.ingredients.forEach(ing => {
        const isStaple = lowerStaples.some(s => ing.name.toLowerCase().includes(s));
        if (!isStaple) {
          if (!needed[ing.name]) needed[ing.name] = [];
          needed[ing.name].push(ing.amount);
        }
      });
    });

    return Object.entries(needed).map(([name, amounts]) => ({
      name,
      amount: amounts.join(' + ')
    }));
  };

  const groceryList = getGroceryList();

  const handleCopy = () => {
    const listText = groceryList.map(item => `- ${item.name}: ${item.amount}`).join('\n');
    navigator.clipboard.writeText(`Mandel Family Grocery List for the Week:\n\n${listText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between border-b-2 border-stone-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Calendar className="text-[#BC4A3C]" size={32} />
             <h2 className="text-5xl font-serif tracking-tighter">Weekly Menu.</h2>
          </div>
          <p className="font-serif italic text-stone-600 text-xl">Coordinate your flavor journey for the week ahead.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onClear}
            className="px-6 py-3 border-2 border-stone-200 hover:border-red-600 hover:text-red-600 rounded-xl font-serif italic text-sm transition-all shadow-sm"
          >
            Clear for Next Week
          </button>
          <button 
            onClick={onClose}
            className="btn-retro font-bold text-sm bg-stone-900 text-white px-8"
          >
            Return to Library
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Weekly Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {DAYS.map(day => {
            const dayItems = menu.filter(m => m.day === day);
            return (
              <div key={day} className="bg-white p-8 rounded-3xl border-2 border-stone-100 shadow-sm space-y-6 flex flex-col min-h-[250px] relative overflow-hidden group hover:border-[#D49A00] transition-all">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif italic text-stone-400 group-hover:text-stone-900 transition-colors uppercase tracking-widest text-[10px] font-black">{day}</h3>
                  <button 
                    onClick={() => setShowSelector({ day })}
                    className="p-2 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  {dayItems.map(item => {
                    const recipe = recipes.find(r => r.id === item.recipeId);
                    return (
                      <div key={item.id} className="flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-100 animate-in fade-in slide-in-from-bottom-2">
                        <span className="font-serif text-lg">{recipe?.title || 'Unknown Recipe'}</span>
                        <button onClick={() => onRemove(item.id)} className="text-stone-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    );
                  })}
                  {dayItems.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-stone-100 rounded-2xl h-full">
                      <p className="text-stone-300 font-serif italic text-xs uppercase tracking-widest">Available Slot</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Smart Grocery List */}
        <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
          <div className="bg-stone-950 text-[#F7F2EC] rounded-3xl p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <ShoppingBag size={200} />
             </div>
             
             <div className="relative space-y-10">
               <div className="flex items-center justify-between">
                 <h3 className="text-3xl font-serif italic">Grocery List.</h3>
                 <button 
                  onClick={handleCopy}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 group border border-white/10"
                 >
                   {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">{copied ? 'Copied' : 'Copy All'}</span>
                 </button>
               </div>

               <div className="space-y-6">
                 {groceryList.map((item, i) => (
                   <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                     <span className="font-serif italic opacity-90">{item.name}</span>
                     <span className="font-sans font-bold text-xs text-[#D49A00]">{item.amount}</span>
                   </div>
                 ))}
                 {groceryList.length === 0 && (
                   <div className="text-center py-10 space-y-4 opacity-30">
                     <ShoppingBag className="mx-auto" size={48} />
                     <p className="font-serif italic text-sm">Add recipes to see what else you need beyond the staples.</p>
                   </div>
                 )}
               </div>

               {groceryList.length > 0 && (
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                   <p className="text-[10px] uppercase font-black tracking-widest text-[#D49A00] mb-2 opacity-50">Note</p>
                   <p className="font-serif italic text-sm opacity-60 leading-relaxed">
                     Staples from your cabinet are omitted. This list updates in real-time as you refine the plan.
                   </p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Recipe Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <div className="fixed inset-0 bg-[#121212]/90 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F2EC] w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b-2 border-stone-200 flex justify-between items-center bg-white">
                <h3 className="text-2xl font-serif italic text-stone-900">Select for {showSelector.day}</h3>
                <button onClick={() => setShowSelector(null)} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-all"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y_auto p-8 space-y-4 custom-scrollbar">
                {recipes.map(recipe => (
                  <button 
                    key={recipe.id}
                    onClick={() => {
                      onAddRecipe(showSelector.day, recipe.id);
                      setShowSelector(null);
                    }}
                    className="w-full text-left p-4 bg-white hover:bg-stone-900 hover:text-white rounded-xl border-2 border-stone-100 transition-all flex justify-between items-center group"
                  >
                    <span className="text-xl font-serif">{recipe.title}</span>
                    <span className="text-xs uppercase font-black tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{recipe.category}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
