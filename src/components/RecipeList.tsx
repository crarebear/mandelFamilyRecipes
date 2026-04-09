import React from 'react';
import type { Recipe } from '../lib/mockData';
import { ChefHat, ShoppingCart, ArrowRight } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {recipes.map((recipe) => (
        <div 
          key={recipe.id} 
          className="retro-card group p-0 overflow-hidden flex flex-col h-full"
          onClick={() => onSelectRecipe(recipe)}
        >
          {/* Header Accent */}
          <div className={`h-2 w-full ${
            recipe.category === 'breakfast' ? 'bg-[#D49A00]' : 
            recipe.category === 'dessert' ? 'bg-[#BC4A3C]' : 'bg-[#2D4F4F]'
          }`} />
          
          <div className="p-8 flex-1 flex flex-col">
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-stone-600 mb-3 font-bold">
              {recipe.category}
            </span>
            <h3 className="text-3xl font-serif text-[#121212] leading-tight mb-8 flex-1">
              {recipe.title}
            </h3>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#E8E2D9]">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-stone-600 text-sm font-medium">
                  <ChefHat size={16} />
                  <span>{recipe.ingredients.length}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 text-sm font-medium">
                  <ShoppingCart size={16} />
                  <span>~15 min</span>
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 group-hover:bg-[#D49A00] group-hover:text-[#121212] transition-colors">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {recipes.length === 0 && (
        <div className="col-span-full py-20 text-center space-y-4 opacity-30">
          <ChefHat size={64} className="mx-auto" />
          <p className="font-serif italic text-2xl">The collection is currently quiet...</p>
        </div>
      )}
    </div>
  );
};
