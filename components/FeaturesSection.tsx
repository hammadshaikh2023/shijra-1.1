import React from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, Sparkles, Mic, Dna, Printer, ShieldCheck, 
  Share2, Wand2, Search, LayoutTemplate, Heart, Globe,
  Cpu, Zap, Database, ArrowUpRight, History, Layers
} from 'lucide-react';
// Added missing Button component import
import { Button } from './Button';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tag: string;
  specs: string[];
}

export const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Interactive Topology",
      description: "Navigate your lineage through a cosmic focal-point engine. Experience family connections as a living, breathing constellation of data.",
      icon: <Waves size={24} />,
      color: "text-blue-400",
      tag: "D3 CORE ENGINE",
      specs: ["Real-time Force Layout", "Vector Export Support", "Cross-Branch Rendering"]
    },
    {
      title: "Oral History Vault",
      description: "Record the wisdom of elders in a military-grade encrypted sanctuary. Preserve the actual timbre of ancestral voices for eternity.",
      icon: <Mic size={24} />,
      color: "text-gold-400",
      tag: "VOICE ARCHIVE",
      specs: ["High-Fidelity RAW PCM", "AI Transcription ready", "256-bit AES Encryption"]
    },
    {
      title: "Deep Nostalgia™ AI",
      description: "Witness the past blink and smile. Our proprietary AI reconstructs facial geometry to breathe life into silent, static portraits.",
      icon: <Wand2 size={24} />,
      color: "text-emerald-400",
      tag: "FACIAL NEURAL SYNTH",
      specs: ["Landmark Mesh Mapping", "Temporal Smoothing", "4K Frame Enhancement"]
    },
    {
      title: "Genetic Intelligence",
      description: "Integrate raw DNA data to find smart matches across global archives. Map the luminous path of your genetic inheritance through centuries.",
      icon: <Dna size={24} />,
      color: "text-purple-400",
      tag: "GENOMIC MAPPING",
      specs: ["SNP Profile Comparison", "Centimorgan Heatmaps", "Privacy-first Hashing"]
    },
    {
      title: "Blueprint Schematic",
      description: "Generate high-resolution architectural tree prints. Perfect for ancestral havelis and framing your family’s technical roadmap.",
      icon: <LayoutTemplate size={24} />,
      color: "text-cyan-400",
      tag: "PDF EXPORT ENGINE",
      specs: ["A0/A1 Large Format", "Custom Font Pairing", "Vector Line Precision"]
    },
    {
      title: "Collaborative Haveli",
      description: "A private digital sanctuary where multiple branches can contribute memories and verify dates in a unified, synchronized environment.",
      icon: <Globe size={24} />,
      color: "text-rose-400",
      tag: "FAMILY MULTI-SYNC",
      specs: ["Conflict Resolution", "Admin Permissions", "Real-time Presence"]
    }
  ];

  return (
    <div className="relative pt-20 pb-32 overflow-hidden bg-[#020617] animate-fade-in">
      {/* Schematic Global Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Intro Hero */}
        <div className="max-w-4xl mx-auto text-center mb-32 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-10 shadow-xl"
          >
            <Cpu size={14} className="animate-pulse" /> Engineering Ancestry
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-10 tracking-tight leading-[1.1]">
            Capabilities of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-gold-200 italic">Sanctuary</span>
          </h1>
          
          <p className="text-slate-400 text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Traditional lineage meets deep-tech architecture. Shijra provides the professional framework to archive, visualize, and protect your family's digital soul.
          </p>
        </div>

        {/* Feature Matrix */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-40">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
              
              <div className="relative h-full glass-card p-10 rounded-[3rem] border border-white/5 bg-navy-900/40 backdrop-blur-3xl flex flex-col transition-all duration-700 hover:translate-y-[-12px] hover:border-white/20">
                
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-5 rounded-2xl bg-navy-950 border border-white/10 ${feature.color} shadow-2xl transition-all duration-1000 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_30px_currentColor]`}>
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase block mb-1 group-hover:text-gold-400">
                      Module
                    </span>
                    <span className="text-[11px] font-mono text-white/40">{idx + 1}.0.ARCH</span>
                  </div>
                </div>

                <h3 className="text-3xl font-serif font-bold text-white mb-6 group-hover:text-gold-100 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 text-base font-light leading-relaxed mb-10">
                  {feature.description}
                </p>

                {/* Micro Specs List */}
                <div className="mt-auto pt-8 border-t border-white/5">
                   <div className="flex items-center gap-2 mb-4">
                      <Zap size={10} className="text-gold-500" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Specs</span>
                   </div>
                   <div className="space-y-2">
                      {feature.specs.map(spec => (
                        <div key={spec} className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           {spec}
                        </div>
                      ))}
                   </div>
                </div>

                <button className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ArrowUpRight className="text-gold-400" size={24} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Security Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative rounded-[4rem] border border-white/5 bg-navy-950/50 p-16 md:p-24 overflow-hidden shadow-2xl mb-40"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
             <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
                  <ShieldCheck size={14} /> Security Architecture
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 italic">A Citadel for Your <span className="text-slate-500 not-italic font-light">Ancestors</span></h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed mb-10">
                   We treat family records as high-value intellectual property. From decentralized storage to biometric access, every pixel of your legacy is protected.
                </p>
                
                <div className="grid grid-cols-2 gap-8">
                   <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400"><Database size={24} /></div>
                      <div>
                         <h5 className="text-white text-sm font-bold mb-1">Encrypted RAW</h5>
                         <p className="text-slate-500 text-xs">AES-256 at-rest protection.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400"><Layers size={24} /></div>
                      <div>
                         <h5 className="text-white text-sm font-bold mb-1">Redundant Sync</h5>
                         <p className="text-slate-500 text-xs">Tri-node server mirroring.</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="bg-navy-900/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-12 relative group overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="flex justify-between items-center mb-10">
                   <h4 className="text-white font-serif text-xl font-bold">Real-time Node Status</h4>
                   <span className="flex items-center gap-2 text-[10px] text-emerald-400 font-black tracking-widest uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Systems
                   </span>
                </div>
                
                <div className="space-y-8">
                   {[
                      { label: "Global Archival Speed", value: "24.2 TB/s", icon: Zap },
                      { label: "Uptime Multi-region", value: "99.999%", icon: History },
                      { label: "Neural Render Load", value: "12% Stable", icon: Cpu }
                   ].map((stat, i) => (
                      <div key={i} className="group-hover:translate-x-2 transition-transform duration-500">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                               <stat.icon size={12} className="text-gold-500" /> {stat.label}
                            </span>
                            <span className="text-white font-mono text-sm font-bold">{stat.value}</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: "85%" }}
                               className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>

        {/* Closing CTA */}
        <div className="text-center pb-20">
          <h2 className="text-4xl font-serif text-white mb-8 italic">Ready to Initialize Your Legacy?</h2>
          <div className="flex justify-center gap-6">
             <Button variant="secondary" className="!px-12 !py-5 shadow-2xl shadow-gold-500/20 text-xs font-black uppercase tracking-[0.3em]">Open My Vault</Button>
          </div>
        </div>

      </div>
    </div>
  );
};
