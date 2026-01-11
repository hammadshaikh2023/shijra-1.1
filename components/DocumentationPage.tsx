
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Add missing Waves and Fingerprint icons to lucide-react imports
import { 
  Book, FileText, Code, Settings, User, Database, Search, 
  ChevronRight, Layout, Info, Sparkles, Mic, Dna, Wand2, 
  ShieldCheck, Share2, Terminal, History, ArrowRight, Zap,
  Cpu, Lock, Globe, HardDrive, Waves, Fingerprint
} from 'lucide-react';

type DocSection = 
  | 'Getting Started' 
  | 'Building Your Tree' 
  | 'Oral History Tips' 
  | 'Photo Restoration' 
  | 'DNA Integration' 
  | 'GEDCOM Export' 
  | 'API Reference' 
  | 'Data Security';

interface Category {
  title: string;
  items: DocSection[];
}

export const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('Getting Started');

  const categories: Category[] = [
    { title: 'The Initiation', items: ['Getting Started', 'Building Your Tree'] },
    { title: 'Archival Mastery', items: ['Oral History Tips', 'Photo Restoration', 'DNA Integration'] },
    { title: 'Systems & Data', items: ['GEDCOM Export', 'API Reference', 'Data Security'] }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'Getting Started':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-gold-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <Sparkles size={14} /> The Architect's Initiation
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">Getting Started</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Your journey into the sanctuary begins with a single node. Shijra is designed to be as intuitive as a memory and as secure as a vault.</p>
            </header>
            
            <div className="grid md:grid-cols-3 gap-6">
               {[
                 { step: "01", title: "Initialize Vault", desc: "Create your unique ancestral ID and set your secondary security pin." },
                 { step: "02", title: "Primary Anchor", desc: "Add yourself or your oldest known ancestor as the root node of the constellation." },
                 { step: "03", title: "Invite Kin", desc: "Securely share access with family keepers to collaboratively grow the tree." }
               ].map((item, i) => (
                 <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group">
                    <div className="text-3xl font-serif text-gold-500/30 mb-6 group-hover:text-gold-500 transition-colors font-bold">{item.step}</div>
                    <h4 className="text-white font-bold mb-3">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-start gap-6">
               <div className="shrink-0 p-3 bg-emerald-500/20 rounded-2xl text-emerald-400"><Info size={24} /></div>
               <div>
                  <h5 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-widest">Pro Architect Tip</h5>
                  <p className="text-slate-300 text-sm font-light">Start with oral histories before gathering dates. Memories are ephemeral; dates are recorded in archives. Capture the whispers first.</p>
               </div>
            </div>
          </div>
        );

      case 'Building Your Tree':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  {/* Fix: Waves is now imported */}
                  <Waves size={14} /> Mapping the Constellation
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">Building Your Tree</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Navigate the complexities of lineage through our D3-powered topological engine.</p>
            </header>

            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-navy-950 shadow-2xl group">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-full border-2 border-gold-500/50 animate-pulse-glow" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gold-500 rounded-full shadow-[0_0_20px_#fbbf24]" />
                     {[0, 72, 144, 216, 288].map(deg => (
                        <div key={deg} className="absolute top-1/2 left-1/2 w-40 h-px bg-gradient-to-r from-gold-500/40 to-transparent origin-left" style={{ transform: `rotate(${deg}deg)` }} />
                     ))}
                  </div>
               </div>
               <div className="absolute bottom-6 left-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/5">Topology Preview v4.2</div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
               <div>
                  <h4 className="text-white text-xl font-serif font-bold mb-6 italic">Relationship Logic</h4>
                  <ul className="space-y-6">
                     <li className="flex gap-4">
                        <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-1"><ChevronRight size={14} /></div>
                        <div><strong className="text-white block mb-1">Anchor Nodes</strong><span className="text-slate-500 text-sm">Primary lineage carriers.</span></div>
                     </li>
                     <li className="flex gap-4">
                        <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1"><ChevronRight size={14} /></div>
                        <div><strong className="text-white block mb-1">Affinity Links</strong><span className="text-slate-500 text-sm">Spousal and adoption connections.</span></div>
                     </li>
                  </ul>
               </div>
               <div className="p-8 rounded-[2rem] bg-navy-900/50 border border-white/5">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4">Schematic Exports</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">Export your constellation as high-fidelity RAW Vector (SVG) or Large Format Architectural PDF (A0-A3).</p>
                  <button className="text-[10px] font-black uppercase text-gold-400 hover:text-white transition-colors flex items-center gap-2">View Print Specs <Share2 size={12} /></button>
               </div>
            </div>
          </div>
        );

      case 'Oral History Tips':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <Mic size={14} /> Whispers of the Past
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">Oral History Tips</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Preserving the timbre of a voice is preserving a soul. Use these professional protocols to archive high-fidelity memories.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="p-10 rounded-[3rem] bg-navy-900/60 border border-white/10 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 scale-150 group-hover:rotate-0 transition-transform duration-1000"><Mic size={120} /></div>
                  <h4 className="text-white font-bold text-xl mb-6">Environment Protocols</h4>
                  <div className="space-y-4">
                     {["Minimize Hard Surfaces", "Check for Ambient Hum (AC/Fans)", "Microphone distance: 6-8 inches"].map(t => (
                        <div key={t} className="flex items-center gap-3 text-sm text-slate-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" /> {t}
                        </div>
                     ))}
                  </div>
               </div>
               <div className="p-10 rounded-[3rem] bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-500/20">
                  <h4 className="text-white font-bold text-xl mb-6">Interview Catalyst</h4>
                  <p className="text-slate-400 text-sm mb-6 font-light italic">"Tell me about the smell of the kitchen in your childhood home..."</p>
                  <p className="text-slate-400 text-sm mb-6 font-light">Sensory questions unlock deeper neural pathways for memory retrieval than factual questions.</p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-gold-400 flex items-center gap-2">Download Question Bank <ArrowRight size={12} /></button>
               </div>
            </div>

            <div className="relative h-20 bg-white/5 rounded-2xl overflow-hidden flex items-center px-8 gap-1">
               {[...Array(60)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: "10%" }}
                    animate={{ height: `${20 + Math.random() * 80}%` }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", delay: i * 0.05 }}
                    className="flex-1 bg-emerald-500/30 rounded-full" 
                  />
               ))}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[1em]">Acoustic Profile Active</span>
               </div>
            </div>
          </div>
        );

      case 'Photo Restoration':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <Wand2 size={14} /> Light from Shadows
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">Photo Restoration</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Our proprietary AI engines go beyond simple filters. We reconstruct missing pixels using deep historical context and facial geometry synthesis.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500" className="w-full h-full object-cover grayscale opacity-40 blur-[1px]" alt="Original" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-px h-full bg-gold-400/50 relative shadow-[0_0_20px_#fbbf24]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-400 p-2 rounded-full text-navy-950 shadow-2xl">
                           <RefreshCcw size={16} className="animate-spin-slow" />
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-6 left-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Original Scan</div>
                  <div className="absolute top-6 right-6 text-[10px] font-black text-gold-400 uppercase tracking-widest">Neural Render</div>
               </div>
               <div className="space-y-8">
                  <div>
                     <h4 className="text-white text-2xl font-serif font-bold mb-4 italic">Neural Upscaling</h4>
                     <p className="text-slate-400 text-sm leading-relaxed font-light">Increase resolution up to 8x while preserving the unique skin texture and grain of historical film stocks.</p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
                     <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Supported Artifacts</h5>
                     <div className="flex flex-wrap gap-3">
                        {["Daguerreotypes", "Tintypes", "Polaroids", "Kodachrome", "Raw Digital Scans"].map(t => (
                           <span key={t} className="text-[10px] text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{t}</span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'DNA Integration':
        return (
          <div className="space-y-12">
             <header>
               <div className="flex items-center gap-3 text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <Dna size={14} /> The Molecular Archive
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">DNA Integration</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Sync raw genomic data to find smart matches across the global Shijra sanctuary. We use SNP-based hashing for absolute privacy.</p>
            </header>

            <div className="p-10 rounded-[3rem] bg-navy-900/60 border border-white/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
               <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="shrink-0 w-32 h-32 rounded-full border-4 border-purple-500/20 flex items-center justify-center text-purple-400">
                     {/* Fix: Fingerprint is now imported */}
                     <Fingerprint size={64} className="group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-white text-xl font-bold mb-4">Differential Privacy Engine</h4>
                     <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">Our matching logic never stores your raw DNA. Instead, it generates a unique cryptographic "Genomic Signature" that is used to cross-reference potential kin.</p>
                     <div className="flex gap-4">
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck size={12} className="text-emerald-400" /> HIPAA Compliant
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Lock size={12} className="text-purple-400" /> Zero-Knowledge
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-white font-serif text-lg italic">Supported Kits</h4>
                  <div className="grid grid-cols-2 gap-3">
                     {["23andMe", "AncestryDNA", "MyHeritage", "LivingDNA"].map(k => (
                        <div key={k} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 font-bold tracking-wider">{k}</div>
                     ))}
                  </div>
               </div>
               <div className="p-8 rounded-[2rem] bg-purple-500/5 border border-purple-500/20">
                  <h5 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4">Proximity Alerts</h5>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">Enable Proximity Alerts to be notified when a match over 30cM (Centimorgans) is detected within the sanctuary.</p>
               </div>
            </div>
          </div>
        );

      case 'GEDCOM Export':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <Share2 size={14} /> Universal Blueprints
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">GEDCOM Export</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">The global standard for genealogy data. Shijra fully supports GEDCOM v5.5.1 and v7.0 protocols for maximum portability.</p>
            </header>

            <div className="bg-white/5 border border-white/5 rounded-[3.5rem] p-16 flex flex-col items-center text-center group">
               <div className="w-24 h-24 rounded-[2rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-10 border border-cyan-500/20 shadow-2xl group-hover:scale-110 transition-transform">
                  <Database size={42} />
               </div>
               <h4 className="text-white text-2xl font-serif font-bold mb-6">Data Sovereignty</h4>
               <p className="text-slate-400 text-base max-w-lg mb-10 font-light leading-relaxed">You own your lineage. At any moment, you can export your entire tree as a universal GEDCOM file to use with any other professional genealogy software.</p>
               <div className="flex flex-wrap justify-center gap-4">
                  <span className="bg-black/20 text-cyan-300 px-5 py-2 rounded-full border border-cyan-500/20 text-[10px] font-black tracking-widest uppercase">GEDCOM v7.0 Support</span>
                  <span className="bg-black/20 text-cyan-300 px-5 py-2 rounded-full border border-cyan-500/20 text-[10px] font-black tracking-widest uppercase">UTF-8 Encoded</span>
               </div>
            </div>
          </div>
        );

      case 'API Reference':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <Terminal size={14} /> Neural Interface
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">API Reference</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Integrate your family archives with custom applications. Our REST API provides secure, granular access to tree nodes and oral history buckets.</p>
            </header>

            <div className="bg-navy-950 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-white/5 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <span className="text-[10px] font-mono text-slate-500 ml-4 uppercase tracking-widest font-bold">fetch_ancestor.js</span>
               </div>
               <div className="p-10 font-mono text-sm leading-relaxed overflow-x-auto">
                  <pre className="text-emerald-400">
{`// Initialize the Shijra Protocol
const shijra = new SanctuaryClient({
  apiKey: process.env.VAULT_KEY,
  region: 'asia-south-1'
});

// Retrieve deep-branch nodes
const lineage = await shijra.nodes.get({
  id: 'Ahmed_Karim_Root',
  depth: 12,
  includeMedia: true
});

console.log(\`Retrieved \${lineage.count} kin from the archive.\`);`}
                  </pre>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4">Endpoints</h4>
                  <div className="space-y-4">
                     {["/v1/lineage", "/v1/audio-archive", "/v1/photo-restoration", "/v1/biometrics"].map(e => (
                        <div key={e} className="flex items-center justify-between">
                           <span className="text-xs font-mono text-slate-400">{e}</span>
                           <span className="text-[10px] text-emerald-400 font-bold">GET / POST</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4">Rate Limits</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-light">Archivist tier: 10k requests/mo.<br/>Legacy tier: Unlimited with secondary biometric auth.</p>
               </div>
            </div>
          </div>
        );

      case 'Data Security':
        return (
          <div className="space-y-12">
            <header>
               <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <ShieldCheck size={14} /> The Citadel Protocol
               </div>
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 italic">Data Security</h2>
               <p className="text-slate-400 text-xl font-light leading-relaxed">Your family records are treated as high-value intellectual property. We employ a multi-layered defense architecture.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { icon: Lock, title: "AES-256", desc: "Encryption at rest and in transit." },
                 { icon: Cpu, title: "HSM Keys", desc: "Root keys stored in physical hardware modules." },
                 { icon: Globe, title: "Tri-Node", desc: "Redundant syncing across three continents." },
                 { icon: HardDrive, title: "Air-Gap", desc: "Cold storage options for premium vaults." }
               ].map((item, i) => (
                 <div key={i} className="p-8 rounded-[2rem] bg-navy-900/50 border border-white/10 text-center group hover:bg-emerald-500/5 transition-all">
                    <item.icon className="mx-auto mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500" size={32} />
                    <h5 className="text-white font-bold mb-2">{item.title}</h5>
                    <p className="text-slate-500 text-xs font-light">{item.desc}</p>
                 </div>
               ))}
            </div>

            <div className="bg-navy-950/80 rounded-[3rem] p-12 border border-emerald-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5"><Zap size={120} /></div>
               <h4 className="text-2xl font-serif font-bold text-white mb-6">Archival Sovereignty</h4>
               <p className="text-slate-400 leading-relaxed font-light max-w-2xl">
                  If Shijra ever ceases operations, our "Endowment Protocol" kicks in, triggering a decentralized release of your data to your pre-configured heirs using a "Dead Man's Switch" mechanism, ensuring your legacy is never lost to corporate failure.
               </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-20 relative overflow-hidden font-sans flex flex-col lg:flex-row">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.02)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(#ffffff01_1px,transparent_1px),linear-gradient(90deg,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/5 bg-navy-950/50 backdrop-blur-3xl lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] p-10 overflow-y-auto z-20 shrink-0">
         <div className="mb-12 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-400 transition-colors" size={16} />
            <input 
               type="text" 
               placeholder="Search Codex..." 
               className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-white/10 transition-all placeholder-slate-700 font-bold uppercase tracking-widest" 
            />
         </div>

         {categories.map((cat, i) => (
            <div key={i} className="mb-12">
               <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">{cat.title}</h5>
               <ul className="space-y-5">
                  {cat.items.map(item => (
                    <li key={item}>
                       <button 
                         onClick={() => {
                            setActiveSection(item);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                         className={`text-sm flex items-center justify-between w-full group transition-all ${activeSection === item ? 'text-gold-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                       >
                          <span className="group-hover:translate-x-1 transition-transform tracking-wide">{item}</span>
                          {activeSection === item && (
                            <motion.div 
                               layoutId="activeDocIndicator"
                               className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_15px_#fbbf24]" 
                            />
                          )}
                       </button>
                    </li>
                  ))}
               </ul>
            </div>
         ))}

         <div className="mt-20 pt-10 border-t border-white/5">
            <div className="flex items-center gap-3 text-slate-600">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Codex Connected</span>
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 lg:p-24 relative z-10 overflow-y-auto">
         <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
               <motion.div 
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               >
                  {renderContent()}

                  <div className="mt-32 pt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full text-slate-500"><History size={16} /></div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Last Modified: Oct 2024</span>
                     </div>
                     <div className="flex gap-4">
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-full">Share Link</button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors bg-gold-400/10 px-6 py-3 rounded-full border border-gold-400/20">Ask Vault AI</button>
                     </div>
                  </div>
               </motion.div>
            </AnimatePresence>
         </div>

         {/* Decorative Schematic Background Accents */}
         <div className="absolute top-40 right-20 opacity-5 pointer-events-none hidden xl:block">
            <svg width="600" height="600" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.1" fill="none" strokeDasharray="1 2" />
               <path d="M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.05" />
               <rect x="20" y="20" width="60" height="60" stroke="white" strokeWidth="0.1" fill="none" />
            </svg>
         </div>
      </main>

      <style>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-glow {
           animation: pulse-glow 3s infinite ease-in-out;
        }
        @keyframes pulse-glow {
           0%, 100% { opacity: 0.3; transform: scale(1); }
           50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

const RefreshCcw = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);
