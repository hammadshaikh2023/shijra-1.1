
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, UserCheck, HeartHandshake, Scale, History, Info } from 'lucide-react';

export const PrivacyCharterPage: React.FC = () => {
  const principles = [
    {
      title: "Sovereign Ownership",
      desc: "You own 100% of your data. We are merely the stewards of your legacy. You can export or destroy your records at any time.",
      icon: <UserCheck size={20} />
    },
    {
      title: "Zero-Knowledge Archive",
      desc: "We use edge-computing for photo restoration so your family memories never actually leave your local environment unless you choose to archive them.",
      icon: <Eye size={20} />
    },
    {
      title: "Legacy Immortality",
      desc: "Our endowment fund ensures your data remains active even if the platform ownership changes, protecting your tree for the next millennium.",
      icon: <History size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-32 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-navy-900 to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8"
             >
               <Scale size={14} /> The Shijra Ethics Charter
             </motion.div>
             <h2 className="text-6xl md:text-7xl font-serif font-bold text-white mb-10 italic">Privacy by <span className="text-slate-500 not-italic font-light">Sanctuary</span></h2>
             <p className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl mx-auto">
                Genealogy is deeply personal. Our privacy model is built on the principle of absolute discretion and generational longevity.
             </p>
          </div>

          <div className="bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-16 mb-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={120} /></div>
             
             <div className="space-y-16">
                {principles.map((p, i) => (
                   <div key={i} className="flex gap-10 group">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all duration-500">
                         {p.icon}
                      </div>
                      <div>
                         <h4 className="text-2xl font-serif text-white font-bold mb-4">{p.title}</h4>
                         <p className="text-slate-400 text-lg font-light leading-relaxed">{p.desc}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             <div className="p-12 rounded-[2.5rem] bg-white/5 border border-white/5">
                <h5 className="text-gold-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Data Stewardship</h5>
                <h3 className="text-2xl font-serif text-white font-bold mb-6 italic">The Anti-Commercial Pledge</h3>
                <p className="text-slate-400 text-base font-light leading-relaxed">
                   Unlike other platforms, Shijra will <strong>never</strong> monetize your genomic data, your voice records, or your family tree connections. Our revenue is derived purely from subscription-based sanctuary hosting.
                </p>
             </div>
             <div className="p-12 rounded-[2.5rem] bg-navy-950/50 border border-white/5 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><HeartHandshake size={24} /></div>
                   <h4 className="text-xl font-bold text-white">GDPR & APPI Compliant</h4>
                </div>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-8">
                   We adhere to the strictest global privacy regulations, ensuring your data is treated with the same respect as a physical family heirloom.
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors border-b border-white/10 w-fit pb-1">Download Legal PDF (v4.2)</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
