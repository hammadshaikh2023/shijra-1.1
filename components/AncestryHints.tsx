import React, { useEffect, useState } from 'react';
import { Sparkles, X, UserCheck, ArrowRight, GitMerge } from 'lucide-react';
import { Button } from './Button';

interface AncestryHintsProps {
  onDismiss: () => void;
  onAccept: () => void;
}

export const AncestryHints: React.FC<AncestryHintsProps> = ({ onDismiss, onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      
      {/* GLOW EFFECT (The pulsing aura) */}
      <div className="absolute inset-0 -m-4 bg-gradient-to-r from-gold-400/20 via-orange-500/10 to-transparent rounded-3xl blur-[30px] animate-pulse-glow pointer-events-none" />

      {/* GLASS CARD */}
      <div className="relative w-96 bg-navy-900/60 backdrop-blur-xl border border-gold-400/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Decorative Top Border */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />

        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-gold-300">
              <Sparkles size={16} className="animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-widest">Smart Match Found</span>
            </div>
            <button 
              onClick={onDismiss}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Context Message */}
          <p className="text-slate-200 text-sm font-light leading-relaxed mb-5">
            We found a high-confidence match for <strong className="text-white font-medium">Grandfather Ahmed</strong> in the <em className="text-emerald-300 not-italic">Malik Family Archive</em>.
          </p>

          {/* Visual Comparison (Venn/Connection) */}
          <div className="flex items-center justify-between bg-navy-950/50 rounded-xl p-3 mb-5 border border-white/5 relative">
             {/* Line connecting avatars */}
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-navy-900 rounded-full border border-gold-500/30 text-gold-400">
               <ArrowRight size={12} />
             </div>

             {/* Node A (You) */}
             <div className="text-center z-10">
                <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 mb-1 mx-auto overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100" alt="Ahmed" className="w-full h-full object-cover opacity-60 grayscale" />
                </div>
                <div className="text-[10px] text-slate-400">Your Tree</div>
             </div>

             {/* Node B (Found) */}
             <div className="text-center z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-900/40 border border-emerald-500/50 mb-1 mx-auto overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                   <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100" alt="Ahmed Found" className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">New Record</div>
             </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              fullWidth 
              className="!py-2 !text-xs !bg-gold-500/10 !text-gold-300 !border-gold-500/30 hover:!bg-gold-500 hover:!text-navy-950 shadow-none"
              onClick={onAccept}
            >
              <UserCheck size={14} className="mr-2" /> Review Match
            </Button>
            <Button 
              variant="ghost" 
              className="!py-2 !px-3 !text-xs text-slate-500 hover:text-white"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};