
import React, { useState, useEffect } from 'react';
import { Sparkles, UserCheck, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface Hint {
  id: string;
  suggestedName: string;
  sourceTreeName: string;
  confidenceLevel: number;
  matchedOn: string[];
  img: string;
}

interface HintsNotificationProps {
  treeId: string;
  currentIndividualId?: string;
  onViewAll?: () => void;
}

export const HintsNotification: React.FC<HintsNotificationProps> = ({ treeId, currentIndividualId, onViewAll }) => {
  const [hints, setHints] = useState<Hint[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    const fetchHints = async () => {
      setLoading(true);
      // Reverted to local simulation to avoid 404/API errors in browser environment
      setTimeout(() => {
        const mockHints: Hint[] = [
          {
            id: "match_101",
            suggestedName: "Tariq Mahmood (Legacy)",
            sourceTreeName: "Global Archive",
            confidenceLevel: 98,
            matchedOn: ["Name", "Region"],
            img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop"
          },
          {
            id: "match_102",
            suggestedName: "Al-Hamza Bin Saud",
            sourceTreeName: "Middle East Diaspora",
            confidenceLevel: 82,
            matchedOn: ["Haplogroup", "Oral History"],
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop"
          }
        ];
        setHints(mockHints);
        setHasNew(true);
        setLoading(false);
      }, 2000);
    };

    fetchHints();
  }, [currentIndividualId]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasNew(false);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-gold-400 border-gold-500/30 bg-gold-500/10';
    return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className={`
          relative p-2 rounded-full transition-all duration-500
          ${isOpen ? 'bg-navy-800 text-white' : 'text-slate-300 hover:text-white'}
          ${hasNew ? 'shadow-[0_0_15px_rgba(251,191,36,0.6)]' : ''}
        `}
      >
        <Sparkles 
          size={20} 
          className={`transition-transform duration-500 ${hasNew ? 'text-gold-400 animate-pulse' : ''} ${isOpen ? 'rotate-12' : ''}`} 
          fill={hasNew ? "currentColor" : "none"}
        />
        
        {hasNew && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gold-500 text-navy-950 text-[9px] font-bold items-center justify-center">
              {hints.length}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-96 z-[60] animate-fade-in-up origin-top-right">
          <div className="bg-navy-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />

            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-navy-950/50">
               <div>
                 <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                   <Sparkles size={14} className="text-gold-400" /> Cloud Hints
                 </h4>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                 <X size={16} />
               </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
              {loading ? (
                <div className="py-8 text-center flex flex-col items-center">
                   <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin mb-3" />
                   <span className="text-xs text-slate-500 animate-pulse">Scanning Archive...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {hints.map((hint) => (
                    <div 
                      key={hint.id} 
                      className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 transition-all duration-300"
                    >
                       <div className="flex gap-3">
                          <div className="relative shrink-0">
                             <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                               <img src={hint.img} alt={hint.suggestedName} className="w-full h-full object-cover" />
                             </div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start mb-0.5">
                                <h5 className="text-sm font-bold text-slate-200 truncate pr-2 group-hover:text-gold-300 transition-colors">
                                  {hint.suggestedName}
                                </h5>
                                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getConfidenceColor(hint.confidenceLevel)}`}>
                                   {hint.confidenceLevel}%
                                </div>
                             </div>
                             <div className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
                               <ShieldCheck size={10} /> source: <span className="text-slate-400">{hint.sourceTreeName}</span>
                             </div>
                             <Button fullWidth variant="secondary" onClick={() => { if(onViewAll) onViewAll(); setIsOpen(false); }} className="!py-1.5 !text-xs !bg-gold-500/10 !text-gold-400 !border-gold-500/30 hover:!bg-gold-500 hover:!text-navy-950">
                                Review Match <ChevronRight size={12} className="ml-1" />
                             </Button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
