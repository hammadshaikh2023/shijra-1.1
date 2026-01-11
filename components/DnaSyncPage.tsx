
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Fingerprint, ShieldCheck, Upload, Sparkles, Activity, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const DnaSyncPage: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SEQUENCING' | 'ANALYZING' | 'COMPLETED'>('IDLE');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (syncStatus === 'SEQUENCING') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setSyncStatus('ANALYZING');
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    } else if (syncStatus === 'ANALYZING') {
        setTimeout(() => setSyncStatus('COMPLETED'), 3000);
    }
    return () => clearInterval(interval);
  }, [syncStatus]);

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8"
          >
            <Dna size={14} className="animate-pulse" /> Precision Genealogy
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tight italic">Genomic <span className="text-slate-500 not-italic font-light">Synchronization</span></h1>
          <p className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Integrate raw genetic data to uncover forgotten branches. We use advanced SNP mapping to find 99.9% accurate matches within our global sanctuary.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* SECURE UPLOAD ZONE */}
          <div className="lg:col-span-2">
            <div className="bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 relative group overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
              
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Neural Sequencer</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">v2.4 Archival Engine</p>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encrypted Tunnel Active</span>
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                 {syncStatus === 'IDLE' && (
                    <div className="w-full text-center">
                       <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                          <Upload className="text-cyan-400" size={40} />
                       </div>
                       <h4 className="text-xl font-bold text-white mb-4">Drop Your Genetic Signature</h4>
                       <p className="text-slate-400 text-sm mb-10 max-w-xs mx-auto font-light">Select Raw DNA Data from 23andMe, AncestryDNA, or MyHeritage (CSV/TXT formats supported).</p>
                       <Button variant="primary" onClick={() => setSyncStatus('SEQUENCING')} className="!px-12 !py-5 !bg-cyan-600 shadow-2xl shadow-cyan-900/40 uppercase tracking-[0.3em] font-black text-[11px]">Initialize Sequencing</Button>
                    </div>
                 )}

                 {syncStatus === 'SEQUENCING' && (
                    <div className="w-full max-w-md">
                       <div className="flex justify-between mb-4">
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Sequencing Nucleotides</span>
                          <span className="text-white font-mono text-sm">{progress}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${progress}%` }}
                             className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          />
                       </div>
                       <div className="mt-12 space-y-4">
                          {[
                            "Mapping Chromosome 17...",
                            "Filtering SNP interference...",
                            "Generating Haplotype profile..."
                          ].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider opacity-60">
                               <div className="w-1 h-1 rounded-full bg-cyan-400" />
                               {t}
                            </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {syncStatus === 'ANALYZING' && (
                    <div className="text-center py-10">
                       <div className="relative mb-12">
                          <div className="w-24 h-24 border-4 border-purple-500/10 border-t-purple-400 rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Search className="text-purple-400 animate-pulse" size={32} />
                          </div>
                       </div>
                       <h4 className="text-2xl font-serif text-white font-bold mb-3 tracking-wide">Neural Cross-Reference</h4>
                       <p className="text-[11px] text-slate-500 uppercase tracking-[0.4em] animate-pulse">Scanning Global Sanctuary for Shared Segments...</p>
                    </div>
                 )}

                 {syncStatus === 'COMPLETED' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                       <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                          <CheckCircle2 size={48} />
                       </div>
                       <h4 className="text-4xl font-serif text-white font-bold mb-6 italic tracking-tight">Sync Complete</h4>
                       <p className="text-slate-300 text-sm mb-12 max-w-sm mx-auto leading-relaxed font-light">We discovered <span className="text-gold-400 font-black">14 New Potential Kin</span> and updated your genetic topology map.</p>
                       <Button variant="secondary" onClick={() => setSyncStatus('IDLE')} className="!py-4 !px-10 uppercase tracking-[0.4em] font-black text-[10px]">Return to Vault</Button>
                    </motion.div>
                 )}
              </div>
            </div>
          </div>

          {/* SIDE INFO */}
          <div className="space-y-8 h-full flex flex-col justify-between">
             <div className="bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10">
                <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                <h4 className="text-white font-serif text-xl font-bold mb-4">Biometric Privacy</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                   Genetic data is the ultimate fingerprint. We encrypt raw DNA at the hardware level. We never sell your genomic profile.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                      <Fingerprint size={14} className="text-cyan-400" /> AES-256 GCM Protection
                   </div>
                   <div className="flex items-center gap-3 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                      <ShieldCheck size={14} className="text-emerald-400" /> HIPAA Compliant Storage
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-500/20 rounded-[2.5rem] p-10 flex-1">
                <Sparkles className="text-gold-400 mb-6" size={32} />
                <h4 className="text-white font-serif text-xl font-bold mb-4">Proximity Matching</h4>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                   Unlock deep lineage tracing by connecting your "cM" values with distant cousins globally.
                </p>
                <button className="mt-8 text-gold-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                   View Match Criteria <ChevronRight size={14} />
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(100%); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const ChevronRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
