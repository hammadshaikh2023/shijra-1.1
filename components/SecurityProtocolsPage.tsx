
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, Zap, Database, Server, Cpu, Key, FileLock2, Fingerprint } from 'lucide-react';

export const SecurityProtocolsPage: React.FC = () => {
  const protocols = [
    {
      title: "AES-256 GCM Encryption",
      desc: "All archival data is encrypted at rest using military-grade Advanced Encryption Standard with Galois/Counter Mode for authenticated data integrity.",
      icon: <Lock size={24} />,
      status: "Operational",
      color: "text-emerald-400"
    },
    {
      title: "Multi-Sig Vaults",
      desc: "Family archives require dual-authorization for export. No single admin can extract full lineage datasets without secondary biometric approval.",
      icon: <FileLock2 size={24} />,
      status: "Active",
      color: "text-emerald-400"
    },
    {
      title: "Differential Privacy",
      desc: "Our neural matching engine uses mathematical noise to allow for genetic discovery without ever exposing your raw sequence to other users.",
      icon: <EyeOff size={24} />,
      status: "Optimized",
      color: "text-emerald-400"
    },
    {
      title: "Hardware Security Modules",
      desc: "Root keys are stored in physical HSMs in Tier 4 data centers, air-gapped from general web traffic for absolute sovereignty.",
      icon: <Server size={24} />,
      status: "Encrypted",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-32 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.5em] uppercase mb-8"
          >
            <ShieldCheck size={14} className="animate-pulse" /> Security Architecture
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-10 italic">Citadel of <span className="text-slate-500 not-italic font-light">Memory</span></h2>
          <p className="text-slate-400 text-xl font-light leading-relaxed max-w-3xl mx-auto">
             We treat family records as high-value intellectual property. From decentralized storage to biometric access, every pixel of your legacy is protected by world-class infrastructure.
          </p>
        </div>

        {/* SECURITY MATRIX */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
           {protocols.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 group hover:bg-white/5 hover:border-white/10 transition-all duration-700 overflow-hidden relative"
              >
                 <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-[2] transition-transform duration-1000">{p.icon}</div>
                 
                 <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-emerald-400">{p.icon}</div>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.status}</span>
                    </div>
                 </div>

                 <h3 className="text-2xl font-serif font-bold text-white mb-4 italic">{p.title}</h3>
                 <p className="text-slate-400 text-base font-light leading-relaxed mb-8">{p.desc}</p>
                 
                 <div className="pt-6 border-t border-white/5 flex items-center gap-6">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Compliance</span>
                       <span className="text-[10px] text-white font-bold">SOC2 / HIPAA</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Encryption</span>
                       <span className="text-[10px] text-white font-bold">4096-bit RSA</span>
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* GLOBAL NODE STATUS */}
        <div className="bg-navy-900/60 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-16 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
           <div className="grid lg:grid-cols-3 gap-16 items-center">
              <div>
                 <h4 className="text-3xl font-serif text-white font-bold mb-4">Infrastructure <span className="text-emerald-400">Integrity</span></h4>
                 <p className="text-slate-400 text-sm font-light leading-relaxed">Our globally distributed nodes ensure your archive is mirrored across three continents with real-time failover protocols.</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                   { label: "Active Nodes", val: "14", icon: Database },
                   { label: "Archival Load", val: "12%", icon: Cpu },
                   { label: "Sync Latency", val: "42ms", icon: Zap },
                   { label: "Key Rotation", val: "Daily", icon: Key }
                 ].map((stat, i) => (
                    <div key={i} className="text-center group/stat">
                       <stat.icon size={24} className="mx-auto mb-4 text-slate-600 group-hover/stat:text-emerald-400 transition-colors" />
                       <div className="text-2xl font-bold text-white mb-1">{stat.val}</div>
                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
