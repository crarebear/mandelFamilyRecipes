import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface IngredientAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  corpus: string[];
  staples: string[];
  placeholder?: string;
  className?: string;
}

export const IngredientAutocomplete: React.FC<IngredientAutocompleteProps> = ({
  value,
  onChange,
  corpus,
  staples,
  placeholder,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = corpus.filter(item => 
    item.toLowerCase().includes(value.toLowerCase()) && 
    item.toLowerCase() !== value.toLowerCase()
  ).slice(0, 5);

  const isPantryReady = staples.some(s => s.toLowerCase() === value.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          className={`${className} pr-10`}
        />
        {isPantryReady && (
          <CheckCircle2 
            size={18} 
            className="absolute right-3 text-green-500 animate-in zoom-in duration-300" 
          />
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-stone-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {filtered.map((item, i) => {
            const inPantry = staples.some(s => s.toLowerCase() === item.toLowerCase());
            return (
              <button
                key={i}
                onClick={() => {
                  onChange(item);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-none text-left"
              >
                <span className="font-serif text-lg text-stone-900">{item}</span>
                {inPantry && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={12} /> Pantry Ready
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
