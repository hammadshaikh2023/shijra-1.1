
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Crown, Zap, ShieldCheck, ArrowRight, CreditCard, 
  Minus, ChevronDown, Lock, Sparkles, Star, Fingerprint,
  Activity, Info, Box, History
} from 'lucide-react';
import { Button } from './Button';

interface Tier {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  color: string;
  glow: string;
  description: string;
  btnVar: 'primary' | 'secondary' | 'outline';
  isPopular?: boolean;
}

export const SubscriptionSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<Tier | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'SUMMARY' | 'PROCESSING' | 'SUCCESS'>('SUMMARY');

  const tiers: Tier[] = [
    { 
      id: 'free', 
      name: 'Stardust', 
      monthlyPrice: 0, 
      yearlyPrice: 0, 
      description: 'The foundation of your ancestral journey.',
      color: 'text-slate-400', 
      glow: 'group-hover:shadow-slate-500/10',
      btnVar: 'outline' 
    },
    { 
      id: 'basic', 
      name: 'Constellation', 
      monthlyPrice: 12.99, 
      yearlyPrice: 9.99, 
      description: 'Essential archival for modern families.',
      color: 'text-emerald-400', 
      glow: 'group-hover:shadow-emerald-500/20',
      btnVar: 'primary' 
    },
    { 
      id: 'pro', 
      name: 'Eternal Legacy', 
      monthlyPrice: 24.99, 
      yearlyPrice: 19.99, 
      description: 'Full AI restoration and deep lineage tools.',
      color: 'text-gold-400', 
      glow: 'group-hover:shadow-gold-500/40',
      btnVar: 'secondary',
      isPopular: true 
    },
    { 
      id: 'elite', 
      name: 'The Genealogist', 
      monthlyPrice: 59.99, 
      yearlyPrice: 49.99, 
      description: 'Expert DNA analysis & researcher support.',
      color: 'text-purple-400', 
      glow: 'group-hover:shadow-purple-500/20',
      btnVar: 'primary' 
    },
  ];

  const featureGroups = [
    { 
      title: "Lineage Architecture", 
      items: [
        { name: "Family Tree Nodes", values: ["50", "Unlimited", "Unlimited", "Unlimited"] },
        { name: "Digital Vault Storage", values: ["1 GB", "20 GB", "100 GB", "1 TB"] },
        { name: "Blueprint Schematic View", values: [true, true, true, true] },
        { name: "High-Res PDF Exports", values: [false, true, true, true] },
      ]
    },
    { 
      title: "Neural Restoration (AI)", 
      items: [
        { name: "Deep Nostalgia™ Animation", values: [false, "3/mo", "Unlimited", "Unlimited"] },
        { name: "AI Voice Restoration", values: [false, false, true, true] },
        { name: "Photo Colorization", values: [false, true, true, true] },
      ]
    },
    { 
      title: "Genetic Intelligence", 
      items: [
        { name: "Raw DNA Data Import", values: [false, true, true, true] },
        { name: "Global Smart Matches", values: [false, false, true, true] },
        { name: "Chromosome Browser", values: [false, false, "Basic", "Advanced"] },
        { name: "1-on-1 Support", values: [false, false, false, "Priority"] },
      ]
    }
  ];

  const handleProcessPayment = () => {
    setCheckoutStep('PROCESSING');
    setTimeout(() => setCheckoutStep('SUCCESS'), 3500);
  };

  const handleSelectPlan = (tier: Tier) => {
    setSelectedPlan(tier);
    setCheckoutStep('SUMMARY');
  };

  return (
    <div className="relative pt-20 pb-32 overflow-hidden bg-[#020617] animate-fade-in font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[1000px] h-[1000px] bg-emerald-900/10 rounded-full blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[1000px] h-[1000px] bg-gold-900/10 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24 pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-navy-900/50 border border-white/10 backdrop-blur-md text-gold-400 text-[10px] font-black tracking-[0.4em] uppercase mb-10 shadow-2xl"
          >
            <Crown size={14} fill="currentColor" className="animate-float" /> Sanctuary Access Tiers
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-10 tracking-tight leading-none">
            Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-white to-emerald-300 italic">Ancestral</span> Seat
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light leading-relaxed mb-16">
            Unlock the professional suite of tools required to weave your family's cosmic history into a timeless digital masterpiece.
          </p>

          {/* Billing Switcher (Functional) */}
          <div className="flex items-center justify-center gap-8 p-3 bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-full w-fit mx-auto shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s]" />
             <button 
               onClick={() => setBillingCycle('monthly')}
               className={`px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${billingCycle === 'monthly' ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Monthly
             </button>
             <button 
               onClick={() => setBillingCycle('yearly')}
               className={`px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 ${billingCycle === 'yearly' ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Yearly <span className="bg-black/20 px-3 py-1 rounded text-[9px] font-black">SAVE 25%</span>
             </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40 relative">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              className={`
                relative group flex flex-col p-12 rounded-[3.5rem] border transition-all duration-700
                ${tier.isPopular ? 'bg-white/5 border-gold-500/50 shadow-[0_0_80px_rgba(251,191,36,0.15)] scale-105 z-10' : 'bg-navy-900/40 border-white/5 hover:border-white/20'}
                ${tier.glow}
              `}
            >
              {tier.isPopular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 text-[10px] font-black px-8 py-2.5 rounded-full shadow-2xl z-20 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Star size={12} fill="currentColor" /> Recommended
                </div>
              )}

              <div className="mb-12">
                 <h3 className={`text-3xl font-serif font-bold mb-4 ${tier.color}`}>{tier.name}</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed min-h-[40px] opacity-70">{tier.description}</p>
              </div>

              <div className="mb-14">
                 <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-bold text-white tracking-tighter">
                     ${billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice}
                   </span>
                   <span className="text-slate-500 text-sm font-black uppercase tracking-widest">/mo</span>
                 </div>
                 {tier.monthlyPrice > 0 && (
                   <div className="text-[10px] text-emerald-400 font-black mt-4 uppercase tracking-[0.2em] flex items-center gap-2">
                     <ShieldCheck size={12} className="shrink-0" /> Billed ${((billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice) * 12).toFixed(2)} yearly
                   </div>
                 )}
              </div>

              <div className="flex-1 space-y-6 mb-14">
                 {featureGroups[0].items.slice(0, 3).map((feat, fidx) => (
                   <div key={fidx} className="flex items-center gap-4 text-sm">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/20">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-slate-300 font-light">{feat.values[idx] === true ? feat.name : feat.values[idx]}</span>
                   </div>
                 ))}
                 <div className="h-px bg-white/5 w-full pt-4" />
                 <button className="text-[10px] text-slate-500 hover:text-white uppercase font-black tracking-[0.3em] transition-colors flex items-center gap-2">
                    View Full Roadmap <ChevronDown size={14} />
                 </button>
              </div>

              <Button 
                fullWidth 
                variant={tier.btnVar} 
                onClick={() => handleSelectPlan(tier)}
                className={`!py-6 !rounded-[2rem] !text-[12px] !font-black uppercase tracking-[0.4em] transition-all ${tier.isPopular ? 'shadow-2xl shadow-gold-500/30 hover:scale-[1.03]' : 'hover:bg-white/10'}`}
              >
                {tier.monthlyPrice === 0 ? 'Initialize' : 'Subscribe Now'}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Blueprint Roadmap Table (Capability Matrix) */}
        <div className="relative rounded-[4rem] overflow-hidden border border-white/10 bg-navy-900/40 backdrop-blur-3xl p-1 shadow-2xl group mb-40">
           <div className="absolute inset-0 bg-[linear-gradient(#ffffff03_1px,transparent_1px),linear-gradient(90deg,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
           <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
           
           <div className="overflow-x-auto relative z-10">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5">
                    <th className="p-16 w-1/3">
                       <h4 className="text-4xl font-serif text-white mb-3">Lineage Matrix</h4>
                       <p className="text-[11px] text-slate-500 uppercase tracking-[0.5em] font-black">Archival Capability Roadmap</p>
                    </th>
                    {tiers.map(t => (
                      <th key={t.id} className="p-12 text-center min-w-[160px]">
                         <span className={`text-[12px] font-black uppercase tracking-tighter ${t.color}`}>{t.name}</span>
                      </th>
                    ))}
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {featureGroups.map((section, sidx) => (
                    <React.Fragment key={sidx}>
                       <tr>
                         <td colSpan={5} className="bg-white/5 px-16 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.6em]">{section.title}</td>
                       </tr>
                       {section.items.map((feat, fidx) => (
                         <tr key={fidx} className="border-b border-white/5 hover:bg-white/5 transition-all duration-500 group/row">
                           <td className="px-16 py-8 text-slate-300 font-light tracking-widest text-base group-hover/row:text-white transition-colors">{feat.name}</td>
                           {feat.values.map((val, vidx) => (
                             <td key={vidx} className="p-8 text-center">
                               <div className="flex justify-center">
                                 {val === true ? (
                                   <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500/20">
                                      <Check size={16} strokeWidth={4} />
                                   </div>
                                 ) : val === false ? (
                                   <Minus size={16} className="text-slate-800" />
                                 ) : (
                                   <span className="text-[12px] font-black text-slate-400 uppercase tracking-tighter group-hover/row:text-gold-400 transition-colors">{val}</span>
                                 )}
                               </div>
                             </td>
                           ))}
                         </tr>
                       ))}
                    </React.Fragment>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Global Security Assurance */}
        <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto mb-20 opacity-60">
           {[
             { icon: ShieldCheck, title: "Biometric Access", desc: "Your genetic archives are protected by hardware-level encryption." },
             { icon: History, title: "Ancestral Ownership", desc: "You own 100% of the data. Export to GEDCOM or raw vectors anytime." },
             { icon: Info, title: "Family Support", desc: "1-on-1 archival assistance available for complex tree reconstructions." }
           ].map((item, i) => (
             <div key={i} className="text-center group hover:opacity-100 transition-opacity">
                <item.icon className="mx-auto mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h5 className="text-white text-xs font-black uppercase tracking-widest mb-3">{item.title}</h5>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>

      {/* --- INTERACTIVE MULTI-STAGE CHECKOUT MODAL --- */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/98 backdrop-blur-3xl"
              onClick={() => checkoutStep !== 'PROCESSING' && setSelectedPlan(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 30 }}
              className="relative w-full max-w-2xl bg-navy-900 border border-white/10 rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent shadow-[0_0_20px_#fbbf24]" />
              
              <div className="p-16 text-center">
                 {checkoutStep === 'SUMMARY' && (
                   <>
                     <div className="w-24 h-24 bg-gold-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-gold-500/20 shadow-inner group">
                        <CreditCard className="text-gold-400 group-hover:rotate-12 transition-transform duration-700" size={42} />
                     </div>
                     <h3 className="text-5xl font-serif text-white font-bold mb-4">Sanctuary Checkout</h3>
                     <p className="text-slate-400 text-base mb-12 font-light">Provisioning your lineage vault for the <span className={`font-black ${selectedPlan.color}`}>{selectedPlan.name}</span> tier.</p>
                     
                     <div className="bg-navy-950/60 rounded-[2.5rem] p-10 border border-white/5 mb-12 text-left space-y-6">
                        <div className="flex justify-between items-center">
                           <span className="text-slate-500 text-[11px] uppercase font-black tracking-widest">Selected Cycle</span>
                           <span className="text-white text-[11px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full ring-1 ring-white/10">{billingCycle}</span>
                        </div>
                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                           <span className="text-white font-bold text-xl">Total Commitment</span>
                           <div className="text-right">
                              <span className="text-5xl font-serif font-bold text-white tracking-tighter">
                                ${billingCycle === 'yearly' ? (selectedPlan.yearlyPrice * 12).toFixed(2) : selectedPlan.monthlyPrice.toFixed(2)}
                              </span>
                              <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">Inclusive of legacy taxes</p>
                           </div>
                        </div>
                     </div>

                     <Button fullWidth variant="secondary" onClick={handleProcessPayment} className="!py-6 !bg-gold-500 !text-navy-950 !font-black !rounded-[1.5rem] shadow-2xl shadow-gold-500/40 uppercase tracking-[0.4em] text-xs">
                        Finalize Authorization <ArrowRight size={20} className="ml-3" />
                     </Button>
                     <button onClick={() => setSelectedPlan(null)} className="mt-10 text-[11px] text-slate-600 hover:text-white uppercase font-black tracking-[0.4em] transition-all hover:scale-105 active:scale-95">Discard & Return to Tiers</button>
                   </>
                 )}

                 {checkoutStep === 'PROCESSING' && (
                    <div className="py-24 flex flex-col items-center">
                       <div className="relative mb-14">
                          <div className="w-32 h-32 border-[6px] border-gold-500/10 border-t-gold-400 rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Fingerprint className="text-gold-500 animate-pulse" size={48} />
                          </div>
                       </div>
                       <h4 className="text-3xl font-serif text-white font-bold mb-4 tracking-wide italic">Authenticating Lineage</h4>
                       <p className="text-[11px] text-slate-500 uppercase tracking-[0.5em] animate-pulse">Establishing Secure Connection to Archive Vaults...</p>
                    </div>
                 )}

                 {checkoutStep === 'SUCCESS' && (
                    <div className="py-12 flex flex-col items-center">
                       <motion.div 
                         initial={{ scale: 0, rotate: -90 }}
                         animate={{ scale: 1, rotate: 0 }}
                         transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                         className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-12 border border-emerald-500/30 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                       >
                          <Check size={64} strokeWidth={4} />
                       </motion.div>
                       <h4 className="text-6xl font-serif text-white font-bold mb-6 italic tracking-tight">Ahlan wa Sahlan!</h4>
                       <p className="text-slate-300 text-lg mb-14 max-w-sm mx-auto leading-relaxed font-light">
                          Welcome, Keeper. Your family sanctuary has been successfully upgraded. Premium architecture tools are now active.
                       </p>
                       <Button fullWidth onClick={() => { setSelectedPlan(null); setCheckoutStep('SUMMARY'); }} variant="primary" className="!py-6 !bg-emerald-600 !border-none !rounded-[1.5rem] uppercase tracking-[0.5em] font-black text-xs shadow-2xl shadow-emerald-900/60 hover:scale-[1.02] transition-transform">
                          Initialize Dashboard
                       </Button>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
