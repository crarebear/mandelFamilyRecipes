import { useState } from 'react'
import { BookCover } from './components/BookCover'
import { TopNav } from './components/TopNav'
import { RecipeList } from './components/RecipeList'
import { RecipeDetail } from './components/RecipeDetail'
import { AddRecipeModal } from './components/AddRecipeModal'
import { Onboarding } from './components/Onboarding'
import { PantryManager } from './components/PantryManager'
import { WeeklyMenuBuilder } from './components/WeeklyMenuBuilder'
import { FeatureRequestModal } from './components/FeatureRequestModal'
import { FeedbackDashboard } from './components/FeedbackDashboard'
import { useAuth } from './hooks/useAuth'
import { useFamilyData } from './hooks/useFamilyData'
import type { Recipe } from './lib/mockData'
import { Search, Info, AlertOctagon } from 'lucide-react'

function App() {
  const { user, login, logout } = useAuth();
  const { 
    recipes, staples, weeklyMenu, 
    addRecipe, updateRecipe, initializeStaples, toggleStaple, 
    addRecipeToMenu, removeFromMenu, clearMenu, submitFeatureRequest,
    updateFeatureRequestStatus, featureRequests,
    loading: dataLoading, error 
  } = useFamilyData();
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasPasswordAccess, setHasPasswordAccess] = useState(() => {
    return sessionStorage.getItem('mandel_family_access') === 'true';
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'collection' | 'pantry' | 'menu' | 'feedback' | 'feedback_dashboard'>('collection');

  const handlePasswordCorrect = () => {
    sessionStorage.setItem('mandel_family_access', 'true');
    setHasPasswordAccess(true);
    if (!user) {
      login();
    }
  };

  // Filtering Logic (Title + Tags)
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = category === 'all' || recipe.category === category;
    const query = searchQuery.toLowerCase();
    const matchesTitle = recipe.title.toLowerCase().includes(query);
    const matchesTags = recipe.tags?.some(tag => tag.toLowerCase().includes(query));
    return matchesCategory && (matchesTitle || matchesTags);
  });

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  if (!user || !isOpen) {
    return (
      <BookCover 
        isLoggedIn={!!user} 
        hasPasswordAccess={hasPasswordAccess}
        onPasswordCorrect={handlePasswordCorrect}
        onOpen={user ? () => setIsOpen(true) : login} 
      />
    );
  }

  return (
    <>
      <div className="app-container">
        <TopNav 
          currentView={view}
          onViewChange={(newView) => {
            if (newView === 'collection') {
              if (view === 'collection' && selectedRecipe) {
                setSelectedRecipe(null);
              } else {
                setView('collection');
              }
            } else {
              if (view === newView) {
                setView('collection');
              } else {
                setView(newView);
              }
            }
          }}
          onAddRecipe={() => {
            setEditingRecipe(null);
            setIsModalOpen(true);
          }}
          user={user}
          onLogout={logout}
        />
        
        <main className="main-content">
          <div className="px-8 py-10">
            {error ? (
              <div className="max-w-md mx-auto p-10 bg-white border-2 border-dashed border-[#BC4A3C]/20 rounded-xl text-center space-y-6 slide-in">
                <AlertOctagon className="mx-auto text-[#BC4A3C]" size={48} />
                <h3 className="text-2xl font-serif">Library Connection Failed.</h3>
                <p className="font-serif italic text-stone-500">{error}</p>
              </div>
            ) : dataLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-stone-200 border-t-[#D49A00] rounded-full animate-spin mb-4" />
                <p className="font-serif italic text-stone-500">Accessing archives...</p>
              </div>
            ) : view === 'pantry' ? (
              <div className="slide-in">
                <PantryManager 
                  staples={staples} 
                  onToggleStaple={toggleStaple} 
                  onClose={() => setView('collection')} 
                />
              </div>
            ) : view === 'menu' ? (
              <div className="slide-in">
                <WeeklyMenuBuilder 
                  menu={weeklyMenu}
                  recipes={recipes}
                  staples={staples}
                  onAddRecipe={addRecipeToMenu}
                  onRemove={removeFromMenu}
                  onClear={clearMenu}
                  onClose={() => setView('collection')}
                />
              </div>
            ) : view === 'feedback' || view === 'feedback_dashboard' ? (
              <div className="text-center py-20">
                <p className="font-serif italic text-stone-500">
                  {view === 'feedback' ? "Opening Archive Suggestion Portal..." : "Mission Control Access..."}
                </p>
              </div>
            ) : selectedRecipe ? (
              <div className="slide-in">
                <RecipeDetail 
                  recipe={selectedRecipe} 
                  onBack={() => setSelectedRecipe(null)} 
                  onEdit={handleEdit}
                />
              </div>
            ) : (
              <div className="slide-in">
                <div className="mb-12 border-b-2 border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl md:text-6xl font-serif tracking-tight">The Collection.</h2>
                    <p className="font-serif italic text-stone-600 text-lg md:text-xl">Family archives curated by the Mandels</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full max-w-sm">
                      <input 
                        type="text" 
                        placeholder="Search recipes or tags (e.g. 'easy', 'spicy')..."
                        className="w-full bg-white border-2 border-stone-200 rounded-xl px-12 py-3 font-sans focus:outline-none focus:border-[#D49A00] transition-all text-stone-900 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    </div>

                    <div className="relative">
                      <select 
                        className="bg-white border-2 border-stone-200 rounded-xl px-6 py-3 font-serif italic text-lg focus:outline-none focus:border-[#BC4A3C] transition-all appearance-none cursor-pointer pr-12 text-stone-900 shadow-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="all">Every Meal</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                        <option value="dessert">Dessert</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                        <Info size={16} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <RecipeList 
                  recipes={filteredRecipes} 
                  onSelectRecipe={setSelectedRecipe} 
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {!dataLoading && staples.length === 0 && (
        <Onboarding 
          onComplete={async (selected) => {
            await initializeStaples(selected);
          }} 
        />
      )}

      {isModalOpen && (
        <AddRecipeModal 
          onClose={() => {
            setIsModalOpen(false);
            setEditingRecipe(null);
          }} 
          initialRecipe={editingRecipe || undefined}
          onSave={async (recipe) => {
            if (editingRecipe) {
              await updateRecipe(editingRecipe.id, recipe);
              setSelectedRecipe({ id: editingRecipe.id, ...recipe } as Recipe);
            } else {
              await addRecipe(recipe);
            }
            setIsModalOpen(false);
            setEditingRecipe(null);
          }} 
        />
      )}

      {view === 'feedback' && (
         <FeatureRequestModal 
            onClose={() => setView('collection')}
            onSubmit={submitFeatureRequest}
         />
      )}

      {view === 'feedback_dashboard' && (
         <FeedbackDashboard 
            requests={featureRequests}
            onUpdateStatus={updateFeatureRequestStatus}
            onClose={() => setView('collection')}
         />
      )}
    </>
  )
}

export default App
