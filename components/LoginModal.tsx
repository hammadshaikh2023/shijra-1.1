
import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Mail, Lock, ArrowRight, Fingerprint, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<Props> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API authentication
    setTimeout(() => {
      // DEMO CREDENTIALS CHECK
      if (email === 'user' && pass === 'user123') {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setError('The keys to this sanctuary do not match.');
        setShake(true);
        setTimeout(() => setShake(false), 500); // Reset shake animation
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      <div className={`
        relative w-full max-w-lg bg-navy-900 border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up
        ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}
      `}>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>

        <div className="p-10 relative">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Fingerprint className="text-emerald-400" size={28} />
               </div>
               <div>
                  <h3 className="text-2xl font-serif font-bold text-white">Welcome Back</h3>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure Access to Legacy</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
               <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-fade-in">
                  <AlertCircle size={16} />
                  <span>{error}</span>
               </div>
             )}

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Ancestral ID</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                     type="text" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder-slate-700" 
                     placeholder="Enter ID (user)"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Secure Pin</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                     type="password" 
                     required
                     value={pass}
                     onChange={(e) => setPass(e.target.value)}
                     className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder-slate-700" 
                     placeholder="Enter Pin (user123)"
                   />
                </div>
             </div>

             <div className="flex items-center justify-between text-xs px-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                   <input type="checkbox" defaultChecked className="rounded border-white/10 bg-navy-950 text-emerald-500" />
                   Stay logged in forever
                </label>
                <a href="#" className="text-emerald-400 hover:underline">Forgot access?</a>
             </div>

             <Button 
               fullWidth 
               variant="secondary" 
               type="submit"
               disabled={isLoading}
               className="!py-4 !text-base !bg-emerald-600 !text-white hover:!bg-emerald-500 shadow-xl shadow-emerald-900/40 border-none !rounded-2xl"
             >
               {isLoading ? <span className="animate-pulse">Authenticating...</span> : <>Enter Sanctuary <ArrowRight size={18} className="ml-2" /></>}
             </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4 opacity-50">
             <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted
             </div>
             <div className="w-1 h-1 bg-slate-700 rounded-full" />
             <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                <Sparkles size={14} className="text-gold-400" /> Digital Legacy
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
