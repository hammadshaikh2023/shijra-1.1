import React, { useEffect } from 'react';
import { Story } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, story }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-2xl bg-navy-900/90 border border-white/10 rounded-3xl shadow-2xl shadow-emerald-900/20 overflow-hidden animate-[float_0.4s_ease-out]">
        
        {/* Header Decoration */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-navy-900 via-emerald-600 to-navy-900" />

        <div className="p-8 md:p-12 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="mb-6 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-semibold tracking-wider mb-4 border border-emerald-800/50">
              WISDOM
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-gold-300 mb-2 leading-tight">
              {story.title}
            </h2>
            <p className="text-slate-400 text-sm italic">{new Date(story.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-200 max-w-none">
            <p className="whitespace-pre-line">{story.content}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2 justify-center">
             {story.tags.map(tag => (
               <span key={tag} className="text-xs text-slate-500">#{tag}</span>
             ))}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={onClose}
              className="text-sm text-gold-400 hover:text-gold-300 underline underline-offset-4 transition-colors font-medium"
            >
              Close Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};