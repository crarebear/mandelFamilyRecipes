import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Edit3, Sparkles, Plus, CheckCircle, Trash2, Tag as TagIcon } from 'lucide-react';
import { scrapeRecipeFromUrl } from '../lib/scraper';
import { IngredientAutocomplete } from './IngredientAutocomplete';
import { useFamilyData } from '../hooks/useFamilyData';
import type { Recipe } from '../lib/mockData';

interface AddRecipeModalProps {
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  initialRecipe?: Recipe;
}

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'] as const;

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onSave, initialRecipe }) => {
  const { commonIngredients, staples, allTags } = useFamilyData();
  const [activeTab, setActiveTab] = useState<'manual' | 'link'>(initialRecipe ? 'manual' : 'link');
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedRecipe, setScrapedRecipe] = useState<any>(null);

  // Unified Recipe State
  const [recipeState, setRecipeState] = useState<Omit<Recipe, 'id'>>({
    title: initialRecipe?.title || '',
    category: initialRecipe?.category || 'dinner',
    ingredients: initialRecipe?.ingredients || [{ name: '', amount: '', tags: [] }],
    instructions: initialRecipe?.instructions || [''],
    tags: initialRecipe?.tags || [],
    sourceUrl: initialRecipe?.sourceUrl || '',
    cookCount: initialRecipe?.cookCount || 0
  });

  const [newTag, setNewTag] = useState('');

  const handleScrape = async () => {
    setIsScraping(true);
    setError(null);
    try {
      const recipe = await scrapeRecipeFromUrl(url);
      setScrapedRecipe({ ...recipe, tags: [] });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const addIngredient = () => {
    setRecipeState(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', tags: [] }]
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipeState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addStep = () => {
    setRecipeState(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const addRecipeTag = (tag: string) => {
    if (!tag.trim() || recipeState.tags.includes(tag.trim())) return;
    setRecipeState(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    setNewTag('');
  };

  const removeRecipeTag = (tag: string) => {
    setRecipeState(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleFinalSave = () => {
    if (scrapedRecipe) {
      onSave(scrapedRecipe);
    } else if (recipeState.title && recipeState.ingredients.length > 0) {
      onSave(recipeState);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#121212]/95 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4 cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#F7F2EC] w-full max-w-6xl h-[90vh] shadow-[0_60px_120px_rgba(0,0,0,0.9)] rounded-3xl overflow-hidden flex flex-col border border-white/20 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-8 border-b-2 border-[#E8E2D9] bg-white shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#BC4A3C] rounded-2xl flex items-center justify-center text-white rotate-6 shadow-2xl">
              {scrapedRecipe ? <Sparkles size={32} /> : (initialRecipe ? <Edit3 size={32} /> : <Plus size={32} />)}
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-serif tracking-tighter text-stone-900">
                {initialRecipe ? "Refine Archive." : (scrapedRecipe ? "AI Verification." : "Expand the Library.")}
              </h2>
              <p className="font-serif italic text-stone-600 text-lg">
                {initialRecipe ? `Updating ${initialRecipe.title}` : (scrapedRecipe ? "Our AI has transcribed this. Please peer-review." : "Inject new flavors.")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {(activeTab === 'manual' || scrapedRecipe) && (
              <button 
                onClick={handleFinalSave}
                className="bg-stone-900 border-2 border-stone-900 text-white px-8 py-3 rounded-xl text-xs font-serif font-black uppercase tracking-widest hover:bg-transparent hover:text-stone-900 transition-all flex items-center gap-2 shadow-xl"
              >
                <CheckCircle size={18} />
                <span>{initialRecipe ? "Update" : (scrapedRecipe ? "Commit" : "Archive")}</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="w-12 h-12 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-full transition-all hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!scrapedRecipe ? (
              <motion.div 
                key="choice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                {!initialRecipe && (
                  <div className="flex gap-4 p-2 bg-stone-200 rounded-2xl shadow-inner">
                    <button 
                      onClick={() => setActiveTab('link')}
                      className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-xl font-serif font-black text-lg uppercase tracking-widest transition-all ${activeTab === 'link' ? 'bg-stone-900 text-white shadow-2xl scale-[1.02]' : 'text-stone-700 hover:bg-white/50'}`}
                    >
                      <LinkIcon size={20} /> Link Ingest
                    </button>
                    <button 
                      onClick={() => setActiveTab('manual')}
                      className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-xl font-serif font-black text-lg uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-stone-900 text-white shadow-2xl scale-[1.02]' : 'text-stone-700 hover:bg-white/50'}`}
                    >
                      <Edit3 size={20} /> Write Out
                    </button>
                  </div>
                )}

                {activeTab === 'link' ? (
                  <div className="space-y-12 py-10">
                    <div className="text-center space-y-8">
                       <Sparkles className="text-[#D49A00] mx-auto" size={80} />
                       <p className="font-serif italic text-3xl text-stone-800 leading-tight max-w-xl mx-auto">
                        "Paste a URL and Gemini 2.5 Flash will distill it into our family's format."
                       </p>
                    </div>
                    {error && (
                      <div className="p-8 bg-red-50 border-2 border-red-200 text-red-700 font-serif italic text-xl rounded-2xl">
                        {error.includes('quota') ? "Our AI is currently at capacity. Please try again in 60 seconds." : error}
                      </div>
                    )}
                    <div className="space-y-8">
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        className="w-full bg-white border-4 border-stone-200 p-8 rounded-2xl font-serif text-3xl text-stone-900 placeholder:text-stone-300 focus:border-[#D49A00] outline-none transition-all shadow-xl"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <button 
                        disabled={!url || isScraping}
                        onClick={handleScrape}
                        className="btn-retro btn-retro-accent w-full justify-center !py-8 !text-3xl !rounded-2xl shadow-2xl disabled:opacity-20 group"
                      >
                        {isScraping ? "Distilling..." : "Inject Link"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-16 py-8">
                    {/* MANUAL FORM */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">The Identity.</label>
                        <input 
                          placeholder="Recipe Title"
                          className="w-full bg-white border-2 border-stone-200 p-6 rounded-xl font-serif text-2xl text-stone-900 outline-none focus:border-[#BC4A3C]"
                          value={recipeState.title}
                          onChange={e => setRecipeState({...recipeState, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">Meal Type.</label>
                        <select 
                          className="w-full bg-white border-2 border-stone-200 p-6 rounded-xl font-serif text-2xl text-stone-900 outline-none appearance-none cursor-pointer focus:border-[#BC4A3C]"
                          value={recipeState.category}
                          onChange={e => setRecipeState({...recipeState, category: e.target.value as any})}
                        >
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* RECIPE TAGS */}
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">Archive Tags (Easy, Quick, etc.)</label>
                      <div className="flex flex-wrap gap-3">
                        {recipeState.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-stone-900 text-stone-100 rounded-lg font-serif italic">
                            {tag}
                            <button onClick={() => removeRecipeTag(tag)} className="hover:text-red-400"><X size={14} /></button>
                          </span>
                        ))}
                        <div className="relative group">
                          <input 
                            placeholder="Add tag..."
                            className="bg-white border-2 border-stone-100 rounded-xl px-4 py-2 pr-10 font-serif italic text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-[#D49A00] transition-all w-64 shadow-sm"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => {
                               if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addRecipeTag(newTag);
                               }
                            }}
                          />
                          <button onClick={() => addRecipeTag(newTag)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 group-hover:text-[#D49A00] transition-colors"><Plus size={16} /></button>
                          
                          {/* Tag Autocomplete */}
                          {newTag && (
                            <div className="absolute top-full left-0 w-full bg-white border-2 border-stone-100 rounded-xl mt-2 py-2 shadow-2xl z-[3000] overflow-hidden">
                               {allTags
                                 .filter(t => t.toLowerCase().includes(newTag.toLowerCase()) && !recipeState.tags.includes(t))
                                 .slice(0, 5)
                                 .map(suggestion => (
                                    <button
                                      key={suggestion}
                                      onClick={() => addRecipeTag(suggestion)}
                                      className="w-full text-left px-4 py-2 hover:bg-stone-50 text-xs font-serif italic text-stone-600 flex items-center gap-2"
                                    >
                                      <TagIcon size={12} className="text-[#D49A00]" />
                                      {suggestion}
                                    </button>
                                 ))
                               }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center justify-between border-b-2 border-stone-200 pb-4">
                         <label className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">Elements.</label>
                         <button onClick={addIngredient} className="text-[#BC4A3C] font-serif italic hover:underline flex items-center gap-2">
                           <Plus size={16} /> Add Ingredient
                         </button>
                       </div>
                       <div className="grid grid-cols-1 gap-6">
                          {recipeState.ingredients.map((ing, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex gap-4 p-4 bg-white rounded-xl border-2 border-stone-100 group transition-all focus-within:border-[#BC4A3C]">
                                <IngredientAutocomplete 
                                  value={ing.name}
                                  onChange={val => {
                                    const newIngs = [...recipeState.ingredients];
                                    newIngs[i].name = val;
                                    setRecipeState({...recipeState, ingredients: newIngs});
                                  }}
                                  corpus={commonIngredients}
                                  staples={staples}
                                  placeholder="Ingredient Name"
                                  className="flex-1 bg-transparent border-none outline-none font-serif text-xl text-stone-950"
                                />
                                <input 
                                  placeholder="Amount"
                                  className="w-32 bg-stone-50 border-none outline-none font-sans font-bold text-center text-sm rounded-lg text-stone-900"
                                  value={ing.amount}
                                  onChange={e => {
                                    const newIngs = [...recipeState.ingredients];
                                    newIngs[i].amount = e.target.value;
                                    setRecipeState({...recipeState, ingredients: newIngs});
                                  }}
                                />
                                <button onClick={() => removeIngredient(i)} className="p-2 text-stone-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={20} />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 pl-4">
                                <TagIcon size={12} className="text-stone-400" />
                                <input 
                                  placeholder="Specifics (e.g. Preferred brand, notes...)"
                                  className="flex-1 bg-transparent border-none outline-none font-serif italic text-xs text-stone-500 focus:text-[#D49A00]"
                                  value={ing.tags?.[0] || ''}
                                  onChange={e => {
                                    const newIngs = [...recipeState.ingredients];
                                    newIngs[i].tags = [e.target.value];
                                    setRecipeState({...recipeState, ingredients: newIngs});
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center justify-between border-b-2 border-stone-200 pb-4">
                         <label className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">The Procedure.</label>
                         <button onClick={addStep} className="text-[#BC4A3C] font-serif italic hover:underline flex items-center gap-2">
                           <Plus size={16} /> Add Step
                         </button>
                       </div>
                       <div className="space-y-6">
                         {recipeState.instructions.map((step, i) => (
                           <div key={i} className="flex gap-6 group items-start">
                             <span className="text-4xl font-serif text-[#D49A00] opacity-20 pt-2">0{i+1}</span>
                             <textarea 
                               placeholder="What happens next?"
                               className="flex-1 bg-white border-2 border-stone-100 p-6 rounded-xl font-serif text-xl leading-relaxed text-stone-900 outline-none focus:border-[#BC4A3C] transition-all resize-none"
                               value={step}
                               rows={2}
                               onChange={e => {
                                 const newSteps = [...recipeState.instructions];
                                 newSteps[i] = e.target.value;
                                 setRecipeState({...recipeState, instructions: newSteps});
                               }}
                             />
                           </div>
                         ))}
                       </div>
                    </div>

                    {/* Bottom action removed in favor of Header action per request */}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="verify"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16"
              >
                {/* SCRAPED RECIPE VERIFICATION (Similar UI to Manual but populated) */}
                <div className="space-y-12">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-7xl font-serif tracking-tighter text-stone-950"
                    value={scrapedRecipe.title}
                    onChange={(e) => setScrapedRecipe({...scrapedRecipe, title: e.target.value})}
                  />
                  <div className="space-y-8">
                    <label className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">Parsed Ingredients.</label>
                    {scrapedRecipe.ingredients.map((ing: any, i: number) => (
                      <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border-2 border-stone-100 shadow-sm">
                        <input 
                          className="flex-1 font-serif text-2xl text-stone-900 border-none outline-none focus:text-[#BC4A3C] transition-colors" 
                          value={ing.name} 
                          onChange={e => {
                            const n = [...scrapedRecipe.ingredients]; 
                            n[i].name = e.target.value; 
                            setScrapedRecipe({...scrapedRecipe, ingredients: n});
                          }} 
                        />
                        <input 
                          className="w-32 font-sans font-black text-xs text-right text-stone-900 bg-stone-50 rounded-lg p-2 border-none outline-none" 
                          value={ing.amount} 
                          onChange={e => {
                            const n = [...scrapedRecipe.ingredients]; 
                            n[i].amount = e.target.value; 
                            setScrapedRecipe({...scrapedRecipe, ingredients: n});
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-stone-950 p-16 rounded-3xl h-fit sticky top-0">
                   <label className="text-xs font-black uppercase tracking-[0.4em] text-white/40 block mb-8">Procedure.</label>
                   <div className="space-y-8">
                      {scrapedRecipe.instructions.map((step: string, i: number) => (
                        <textarea 
                          key={i} 
                          className="w-full bg-transparent border-none text-white font-serif text-xl leading-relaxed opacity-90 focus:opacity-100 transition-opacity outline-none ring-0" 
                          value={step} 
                          rows={3}
                          onChange={e => {
                            const n = [...scrapedRecipe.instructions]; 
                            n[i] = e.target.value; 
                            setScrapedRecipe({...scrapedRecipe, instructions: n});
                          }} 
                        />
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {scrapedRecipe && (
          <div className="p-12 border-t-2 border-[#E8E2D9] flex justify-between items-center bg-white shadow-2xl">
            <button onClick={() => setScrapedRecipe(null)} className="text-stone-500 font-serif italic text-2xl">← Back</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
;
