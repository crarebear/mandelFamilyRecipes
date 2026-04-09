import React from 'react';
import type { Recipe } from '../lib/mockData';
import { ChefHat, ShoppingCart, CheckCircle, ArrowLeft, Globe, Hash, Edit3, Trash2, Tag as TagIcon, Scale, Calendar } from 'lucide-react';
import { useFamilyData } from '../hooks/useFamilyData';
import { scaleAmount } from '../lib/scaling';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, onEdit }) => {
  const { staples, deleteRecipe } = useFamilyData();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [multiplier, setMultiplier] = React.useState(1);
  
  const checkIsStaple = (name: string) => {
    const lowerName = name.toLowerCase();
    return staples.some(staple => lowerName.includes(staple.toLowerCase()));
  };

  const pantryIngredients = recipe.ingredients.filter(ing => checkIsStaple(ing.name));
  const shoppingIngredients = recipe.ingredients.filter(ing => !checkIsStaple(ing.name));

  const handleDelete = async () => {
    await deleteRecipe(recipe.id);
    onBack();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-12">
      {/* Editorial Header */}
      <header className="space-y-8">
        <div className="flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#BC4A3C] hover:text-[#121212] transition-colors font-serif italic text-lg group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Collection</span>
          </button>
          
          <div className="flex gap-4">
            {isDeleting ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-4 transition-all">
                <p className="text-xs font-black uppercase tracking-widest text-[#BC4A3C] px-4 font-serif italic">Archive forever?</p>
                <button 
                  onClick={handleDelete}
                  className="bg-[#BC4A3C] px-6 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="bg-stone-200 px-6 py-3 rounded-xl text-stone-600 text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200 mr-4">
                   {[0.5, 1, 2, 3].map(m => (
                     <button 
                       key={m}
                       onClick={() => setMultiplier(m)}
                       className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${multiplier === m ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-900'}`}
                     >
                       {m}x
                     </button>
                   ))}
                </div>
                <button 
                  onClick={() => onEdit(recipe)}
                  className="p-3 bg-white border-2 border-stone-200 text-stone-600 hover:text-[#D49A00] hover:border-[#D49A00] rounded-xl transition-all shadow-sm flex items-center gap-2"
                  title="Edit Recipe"
                >
                  <Edit3 size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Edit</span>
                </button>
                <button 
                  onClick={() => setIsDeleting(true)}
                  className="p-3 bg-white border-2 border-stone-200 text-stone-600 hover:text-red-600 hover:border-red-600 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  title="Delete Recipe"
                >
                  <Trash2 size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-[#D49A00]/10 text-[#D49A00] rounded-full text-[10px] font-sans font-bold uppercase tracking-widest">
                {recipe.category}
              </span>
              {recipe.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-stone-900 text-stone-100 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <TagIcon size={10} /> {tag}
                </span>
              ))}
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-[#121212] tracking-tighter leading-[0.85] max-w-4xl">
              {recipe.title}
            </h1>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-4 text-stone-600 font-serif italic text-lg border-l border-[#E8E2D9] pl-10 h-min self-end pb-2">
            <div className="flex items-center gap-3 text-stone-400">
               <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                  <CheckCircle size={14} />
               </div>
               <span>Cooked {recipe.cookCount || 0} times</span>
            </div>
            {recipe.lastScheduled && (
              <div className="flex items-center gap-3 text-stone-400">
                 <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                    <Calendar size={14} />
                 </div>
                 <span>Last scheduled {new Date(recipe.lastScheduled).toLocaleDateString()}</span>
              </div>
            )}
            {recipe.sourceUrl && (
              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#D49A00] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#D49A00]/10 flex items-center justify-center text-[#D49A00]">
                  <Globe size={14} />
                </div>
                <span>Original Source</span>
              </a>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                <Hash size={14} />
              </div>
              <span className="text-sm">Archive No. {recipe.id.slice(-4).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Ingredients & Pantry Intelligence */}
        <div className="lg:col-span-4 space-y-12">
          <section className="space-y-8">
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-serif flex items-center gap-3">
                <ChefHat className="text-[#D49A00]" />
                Ingredients
              </h3>
              {multiplier !== 1 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-[#BC4A3C] flex items-center gap-2 animate-pulse">
                  <Scale size={12} /> Adjusted {multiplier}x
                </span>
              )}
            </div>
            <ul className="space-y-6">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex flex-col gap-1 border-b border-[#E8E2D9] pb-4 group">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-serif group-hover:text-[#BC4A3C] transition-colors">{ing.name}</span>
                    <span className="font-sans font-bold text-stone-600 text-sm">
                      {scaleAmount(ing.amount, multiplier)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {checkIsStaple(ing.name) && (
                      <span className="text-[10px] uppercase font-sans font-black tracking-widest text-[#2D4F4F] flex items-center gap-1">
                        <CheckCircle size={10} /> In My Cabinet
                      </span>
                    )}
                    {ing.tags?.map(itag => (
                      <span key={itag} className="text-[10px] uppercase font-sans font-black tracking-widest text-[#D49A00] flex items-center gap-1">
                        <TagIcon size={10} /> {itag}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Intelligent Pantry Toggles */}
          <div className="bg-[#121212] text-[#F7F2EC] p-8 rounded-xl space-y-8 shadow-xl border border-white/5">
            <div className="space-y-4">
               <h4 className="font-serif italic text-xl flex items-center gap-2 text-[#D49A00]">
                 <CheckCircle size={18} />
                 Pantry Ready
               </h4>
               <div className="flex flex-wrap gap-2">
                  {pantryIngredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-sans font-bold uppercase tracking-widest rounded-full opacity-60">
                      {ing.name}
                    </span>
                  ))}
                  {pantryIngredients.length === 0 && <p className="text-xs italic opacity-30">No staples detected</p>}
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="font-serif italic text-xl flex items-center gap-2 text-[#BC4A3C]">
                 <ShoppingCart size={18} />
                 Add to List
               </h4>
               <div className="flex flex-wrap gap-2">
                  {shoppingIngredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-[#BC4A3C]/20 border border-[#BC4A3C]/40 text-[#BC4A3C] text-[10px] font-sans font-bold uppercase tracking-widest rounded-full">
                      {ing.name}
                    </span>
                  ))}
                  {shoppingIngredients.length === 0 && <p className="text-xs italic opacity-30 font-serif">Kitchen fully stocked</p>}
               </div>
            </div>
          </div>
        </div>

        {/* Right: Modernized Instructions */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-12">
            <h3 className="text-3xl font-serif">Preparation Strategy.</h3>
            <div className="space-y-16">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-10 group">
                  <span className="text-7xl font-serif text-[#D49A00] opacity-10 group-hover:opacity-100 transition-opacity leading-none select-none">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="pt-2">
                    <p className="text-2xl font-serif leading-relaxed text-[#121212]">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
