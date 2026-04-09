import React, { useState } from 'react';
import { Plus, LogOut, User as UserIcon, ChefHat, BookOpen, Settings, Package, Calendar, MessageSquare } from 'lucide-react';
import type { User } from 'firebase/auth';

interface TopNavProps {
  onAddRecipe: () => void;
  onViewChange: (view: 'collection' | 'pantry' | 'menu' | 'feedback' | 'feedback_dashboard') => void;
  currentView: 'collection' | 'pantry' | 'menu' | 'feedback' | 'feedback_dashboard';
  user: User | null;
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  onAddRecipe,
  onViewChange,
  currentView,
  user,
  onLogout
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <aside className="nav-rail">
      {/* Brand Icon */}
      <div className="flex flex-col items-center w-full">
        <div className="w-12 h-12 rounded-full bg-[#D49A00] flex items-center justify-center text-[#121212] shadow-lg">
          <ChefHat size={24} />
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col gap-10 items-center justify-center w-full">
        <button 
          onClick={() => onViewChange('collection')}
          className={`nav-icon ${currentView === 'collection' ? 'active' : ''}`}
          title="All Recipes"
        >
          <BookOpen size={28} />
        </button>

        <button 
          onClick={() => onViewChange('pantry')}
          className={`nav-icon ${currentView === 'pantry' ? 'active' : ''}`}
          title="My Kitchen Cabinet"
        >
          <Package size={28} />
        </button>

        <button 
          onClick={() => onViewChange('menu')}
          className={`nav-icon ${currentView === 'menu' ? 'active' : ''}`}
          title="Weekly Menu Plan"
        >
          <Calendar size={28} />
        </button>

        <button 
          onClick={() => onViewChange('feedback')}
          className={`nav-icon ${currentView === 'feedback' ? 'active' : ''}`}
          title="Feedback & Vision"
        >
          <MessageSquare size={28} />
        </button>

        <button 
          onClick={onAddRecipe}
          className="w-14 h-14 rounded-2xl bg-[#BC4A3C] text-white flex items-center justify-center shadow-[0_10px_20px_rgba(188,74,60,0.4)] hover:scale-110 hover:bg-[#A03A2E] transition-all transform rotate-3"
          title="Add Recipe"
        >
          <Plus size={32} />
        </button>
        
        <div className="relative flex flex-col items-center">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`nav-icon ${isDropdownOpen ? 'active' : ''}`}
            title="Archival Controls"
          >
            <Settings size={28} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-full ml-6 top-0 w-64 bg-[#1A1A1B] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden z-[200] p-2">
              <div className="px-5 py-3 border-b border-white/5 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D49A00]">Archival Controls</p>
              </div>
              <button
                className="w-full text-left px-5 py-3 hover:bg-white/10 rounded-md transition-colors text-xs font-sans uppercase tracking-[0.2em] font-bold text-[#F7F2EC] flex items-center gap-3"
                onClick={() => {
                  onViewChange('feedback_dashboard');
                  setIsDropdownOpen(false);
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#D49A00] animate-pulse" />
                Review Visions
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* User Actions */}
      <div className="flex flex-col gap-8 items-center w-full pb-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden cursor-pointer hover:border-[#D49A00] transition-colors shadow-inner bg-white/5 flex items-center justify-center">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={18} className="text-[#F7F2EC]/40" />
          )}
        </div>
        <button 
          onClick={onLogout}
          className="nav-icon hover:text-[#BC4A3C]"
          title="Sign Out"
        >
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  );
};
