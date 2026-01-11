import React, { useState } from 'react';
import { Send, X, Baby, Heart, Users, Bell, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { BroadcastEventType } from '../types';

interface Props {
  onClose: () => void;
  onSend: (type: BroadcastEventType, message: string) => void;
}

const EVENT_TYPES: { type: BroadcastEventType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'NEW_BIRTH', label: 'New Baby', icon: <Baby size={18} />, color: 'from-blue-400 to-cyan-300' },
  { type: 'WEDDING', label: 'Wedding', icon: <Heart size={18} />, color: 'from-pink-400 to-rose-300' },
  { type: 'REUNION', label: 'Reunion', icon: <Users size={18} />, color: 'from-emerald-400 to-green-300' },
  { type: 'GENERAL', label: 'General', icon: <Bell size={18} />, color: 'from-gold-400 to-amber-300' },
];

export const BroadcastSender: React.FC<Props> = ({ onClose, onSend }) => {
  const [selectedType, setSelectedType] = useState<BroadcastEventType>('NEW_BIRTH');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 800)); 
    onSend(selectedType, message);
    setIsSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fade-in-up">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Glass Card */}
      <div className="relative w-full max-w-md bg-navy-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.1)] overflow-hidden">
        
        {/* Header Decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-gold-400" /> Family Broadcast
              </h3>
              <p className="text-slate-400 text-sm mt-1">Share joyous news with the entire tree.</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Event Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {EVENT_TYPES.map((evt) => (
              <button
                key={evt.type}
                onClick={() => setSelectedType(evt.type)}
                className={`
                  relative overflow-hidden p-3 rounded-xl border transition-all duration-300 flex items-center gap-3
                  ${selectedType === evt.type 
                    ? 'bg-white/10 border-gold-500/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                    : 'bg-navy-950/40 border-white/5 hover:bg-white/5 hover:border-white/10'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-navy-950
                  bg-gradient-to-br ${evt.color}
                  ${selectedType !== evt.type ? 'opacity-70 grayscale' : 'opacity-100'}
                `}>
                  {evt.icon}
                </div>
                <span className={`text-sm font-medium ${selectedType === evt.type ? 'text-white' : 'text-slate-400'}`}>
                  {evt.label}
                </span>
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="space-y-2 mb-8">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1">Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`e.g. "We are overjoyed to announce..."`}
              className="w-full h-32 bg-navy-950/50 border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all resize-none"
            />
          </div>

          {/* Action Button */}
          <Button 
            fullWidth 
            onClick={handleSubmit} 
            disabled={!message.trim() || isSending}
            variant="primary" 
            className="!py-4 text-lg !bg-gradient-to-r !from-gold-500 !to-gold-600 !text-navy-950 !font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] border-none"
          >
            {isSending ? (
              <span className="animate-pulse">Broadcasting...</span>
            ) : (
              <>
                <Send size={18} className="mr-2" /> Send to Family
              </>
            )}
          </Button>

        </div>
      </div>
    </div>
  );
};
