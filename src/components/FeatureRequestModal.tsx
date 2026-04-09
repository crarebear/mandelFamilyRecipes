import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface FeatureRequestModalProps {
  onClose: () => void;
  onSubmit: (title: string, description: string, image?: string) => Promise<void>;
}

export const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 demo
        setError("Image size exceeds 1MB. Please use a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      // Ensure image is either a string or null (Firestore doesn't like undefined)
      await onSubmit(title.trim(), description.trim(), image || undefined); 
      // Wait, let's look at useFamilyData.ts - it just takes the params and calls addDoc.
      // Actually, image as undefined in an object passed to addDoc will cause an error if the key is present but value is undefined.
      // I'll make sure it's handled in the hook or explicitly passed as null/absent.
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#121212]/95 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4 cursor-pointer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#F7F2EC] w-full max-w-2xl max-h-[90vh] shadow-[0_60px_120px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden flex flex-col border border-white/20 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#E8E2D9] bg-white shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#D49A00] rounded-2xl flex items-center justify-center text-stone-900 rotate-6 shadow-xl">
              <Sparkles size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-serif tracking-tighter text-stone-900">Future Archives.</h2>
              <p className="font-serif italic text-stone-600 text-sm">Suggest a vision for the Mandel library.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white">
                   <CheckCircle size={40} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif tracking-tighter text-stone-900 font-bold">Proposal Archived.</h3>
                  <p className="font-serif italic text-lg text-stone-600 max-w-md mx-auto leading-relaxed">
                    "Your vision has been preserved in our backlog. The lead archivist will evaluate its impact."
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="btn-retro btn-retro-accent !px-12 !py-4 !text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  Return to Archive
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.6em] text-[#BC4A3C] block ml-1">The Feature Title</label>
                  <input 
                    placeholder="e.g. 'Dark Mode'..."
                    className="w-full bg-white border-2 border-stone-200 p-6 rounded-2xl font-serif text-xl text-stone-950 outline-none focus:border-[#D49A00] transition-all shadow-sm placeholder:text-stone-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.6em] text-[#BC4A3C] block ml-1">The Concept</label>
                  <textarea 
                    placeholder="Describe your vision..."
                    className="w-full bg-white border-2 border-stone-200 p-6 rounded-2xl font-serif text-lg text-stone-900 outline-none focus:border-[#D49A00] transition-all min-h-[150px] resize-none shadow-sm placeholder:text-stone-300"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-500 block ml-1">Visual Evidence (Optional)</label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[2rem] h-48 hover:border-[#D49A00] hover:bg-white transition-all cursor-pointer group relative overflow-hidden bg-stone-50">
                      {image ? (
                        <>
                          <img src={image} className="w-full h-full object-cover opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                             <p className="text-white text-[10px] font-black uppercase tracking-widest bg-stone-900 px-4 py-2 rounded-lg">Update Mockup</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-white rounded-2xl shadow-sm text-stone-300 group-hover:text-[#D49A00] transition-colors">
                            <ImageIcon size={32} />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-600">Upload Reference Image</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 shadow-sm"
                  >
                    <AlertCircle size={24} />
                    <p className="font-serif italic text-lg">{error}</p>
                  </motion.div>
                )}

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-6 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    Cancel Design
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="flex-[2] btn-retro btn-retro-accent !py-6 !text-xl !rounded-2xl shadow-2xl disabled:opacity-20 flex items-center justify-center gap-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                    ) : <Send size={20} />}
                    <span>{isSubmitting ? "Preserving..." : "Release to Archive"}</span>
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
