import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Clock, CheckCircle, Play, Info, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { FeatureRequest } from '../lib/mockData';

interface FeedbackDashboardProps {
  requests: FeatureRequest[];
  onUpdateStatus: (id: string, status: FeatureRequest['status']) => Promise<void>;
  onClose: () => void;
}

type FilterType = 'open' | 'fixed' | 'WAI' | 'all';

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({ requests, onUpdateStatus, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('open');
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Sorting: "In order of when they came in" -> Oldest first
  const sortedRequests = [...requests].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const normalizeStatus = (status: string) => {
    if (status === 'pending') return 'new';
    return status;
  };

  const filteredRequests = sortedRequests.filter(req => {
    const status = normalizeStatus(req.status);
    if (activeFilter === 'open') return status === 'new' || status === 'in progress';
    if (activeFilter === 'all') return true;
    return status === activeFilter;
  });

  const getStatusIcon = (status: string) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'new': return <Clock size={16} className="text-blue-500" />;
      case 'in progress': return <Play size={16} className="text-[#D49A00]" />;
      case 'fixed': return <CheckCircle size={16} className="text-green-500" />;
      case 'WAI': return <Info size={16} className="text-stone-400" />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#121212]/95 backdrop-blur-3xl z-[2500] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#F7F2EC] w-full max-w-5xl h-[85vh] shadow-[0_60px_120px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="bg-white border-b-2 border-stone-200 p-8 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
              <Filter size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-serif tracking-tighter text-stone-900">Mission Control.</h2>
              <p className="font-serif italic text-stone-500 text-sm">Reviewing the evolving Mandel Archive vision.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-stone-100 hover:bg-stone-200 rounded-full transition-all hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-50 px-8 py-4 border-b border-stone-200 flex gap-4">
          {(['open', 'fixed', 'WAI', 'all'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === f 
                  ? 'bg-stone-900 text-white shadow-md' 
                  : 'bg-white border border-stone-200 text-stone-400 hover:text-stone-900'
              }`}
            >
              {f === 'open' ? 'Active Visions' : f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
          {filteredRequests.map(req => (
            <div key={req.id} className="bg-white border-2 border-stone-100 rounded-2xl p-6 shadow-sm hover:border-[#D49A00]/30 transition-all group">
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-stone-300">#{req.id.slice(-4)}</span>
                    <h4 className="text-xl font-serif text-stone-900 font-bold">{req.title}</h4>
                    <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-full border border-stone-100">
                      {getStatusIcon(req.status)}
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">{req.status}</span>
                    </div>
                  </div>
                  <p className="font-serif italic text-stone-600 leading-relaxed">{req.description}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">Submitted {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col gap-4 items-end">
                  <div className="flex items-center gap-2">
                    {req.image && (
                      <button 
                        onClick={() => setViewingImage(req.image!)}
                        className="p-3 bg-stone-50 hover:bg-stone-900 hover:text-white rounded-xl border border-stone-200 transition-all text-stone-400"
                        title="View Visual Evidence"
                      >
                        <ImageIcon size={18} />
                      </button>
                    )}
                    <select 
                      value={normalizeStatus(req.status)}
                      onChange={(e) => onUpdateStatus(req.id, e.target.value as any)}
                      className="bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl cursor-pointer hover:bg-stone-800 outline-none border-2 border-transparent focus:border-[#D49A00] transition-colors"
                    >
                      <option value="new">🆕 New Vision</option>
                      <option value="in progress">🚧 In Progress</option>
                      <option value="fixed">✅ Fixed</option>
                      <option value="WAI">ℹ️ WAI</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-20 bg-white/50 border-2 border-dashed border-stone-200 rounded-[2.5rem] opacity-30">
              <Clock size={48} className="mx-auto mb-4" />
              <p className="font-serif italic">No Visions found for this status.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Modal Preview */}
      <AnimatePresence>
        {viewingImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/90 flex items-center justify-center p-12 cursor-pointer"
            onClick={() => setViewingImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={viewingImage} 
              className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white/20" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
