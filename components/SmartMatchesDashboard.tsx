
import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, ChevronRight, User, MapPin, Calendar, Activity, GitMerge, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import { Button } from './Button';

// --- MOCK DATA ---
const MATCHES = [
  {
    id: 1,
    ancestorName: "Grandfather Ahmed",
    matchName: "Ahmed Khan (Late)",
    source: "Punjab Archives 1940",
    confidence: 94,
    matchDate: "2 days ago",
    userProps: { birth: "1920", loc: "Lahore" },
    matchProps: { birth: "1920", loc: "District Lahore" },
    generationGap: "2 Generations Up"
  },
  {
    id: 2,
    ancestorName: "Unknown Father of Karim",
    matchName: "Karim Baksh",
    source: "British India Census",
    confidence: 78,
    matchDate: "5 days ago",
    userProps: { birth: "Approx 1890", loc: "Unknown" },
    matchProps: { birth: "1888", loc: "Amritsar" },
    generationGap: "3 Generations Up"
  },
  {
    id: 3,
    ancestorName: "Aunt Fatima",
    matchName: "Fatima Bibi",
    source: "Family Tree: 'Raja Lineage'",
    confidence: 65,
    matchDate: "1 week ago",
    userProps: { birth: "1955", loc: "Karachi" },
    matchProps: { birth: "1958", loc: "Karachi South" },
    generationGap: "Same Generation"
  }
];

interface Props {
  onClose: () => void;
}

// --- SUB-COMPONENT: CONFIDENCE DIAL ---
const ConfidenceDial = ({ score }: { score: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 90) return '#10b981'; // Emerald
    if (s >= 70) return '#fbbf24'; // Gold
    return '#94a3b8'; // Slate
  };

  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx="28" cy="28" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="transparent" />
        <circle 
          cx="28" cy="28" r={radius} 
          stroke={getColor(score)} 
          strokeWidth="3" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] font-bold text-white">{score}%</span>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CONNECTION GRAPH VISUALIZATION ---
const ConnectionGraph = ({ activeMatch }: { activeMatch: any }) => {
  return (
    <div className="relative w-full h-64 bg-navy-950/50 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center mb-6">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
       
       <div className="relative z-10 w-full max-w-md flex items-center justify-between px-8">
          
          {/* User Node (Left) */}
          <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-full bg-navy-800 border-2 border-gold-500 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)] z-10 relative">
                <User className="text-gold-400" size={20} />
                <div className="absolute -bottom-1 w-20 h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent blur-sm" />
             </div>
             <span className="text-[10px] text-gold-400 font-bold tracking-wider uppercase">Your Tree</span>
          </div>

          {/* Connection Lines (Animated SVG) */}
          <div className="flex-1 relative h-20 mx-4">
             <svg className="absolute inset-0 w-full h-full overflow-visible">
                {/* Left Path */}
                <path 
                  d="M0,40 C30,40 30,20 60,20 H80" 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                  className="animate-[dash_20s_linear_infinite]"
                  opacity="0.6"
                />
                {/* Right Path */}
                <path 
                  d="M100,20 H120 C150,20 150,40 180,40" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                  className="animate-[dash_20s_linear_infinite_reverse]"
                  opacity="0.6"
                />
                
                {/* Central Pulse Node */}
                <circle cx="90" cy="20" r="6" fill="#fff" className="animate-ping opacity-20" />
                <circle cx="90" cy="20" r="4" fill="#fbbf24" />
             </svg>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[9px] text-slate-300 border border-white/10">
                {activeMatch.generationGap}
             </div>
          </div>

          {/* Source Node (Right) */}
          <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-full bg-navy-800 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10 relative">
                <Layers className="text-emerald-400" size={20} />
             </div>
             <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">External Record</span>
          </div>

       </div>
    </div>
  );
};

export const SmartMatchesDashboard: React.FC<Props> = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [activeMatches, setActiveMatches] = useState(MATCHES);

  const selectedMatch = activeMatches.find(m => m.id === selectedId) || activeMatches[0];

  const handleAction = (id: number, action: 'accept' | 'reject') => {
    // Animation/Logic placeholder
    setTimeout(() => {
        setActiveMatches(prev => prev.filter(m => m.id !== id));
        if (selectedId === id && activeMatches.length > 1) {
            setSelectedId(activeMatches.find(m => m.id !== id)?.id || 0);
        }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy-950 flex flex-col animate-fade-in-up font-sans">
      
      {/* 1. TOP SUMMARY PANEL */}
      <div className="h-24 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-20 shrink-0">
         <div>
            <div className="flex items-center gap-3 mb-1">
               <div className="p-2 bg-gradient-to-br from-gold-500 to-orange-600 rounded-lg shadow-lg">
                  <Activity size={20} className="text-navy-950" />
               </div>
               <h1 className="text-2xl font-serif font-bold text-white">Ancestral Discoveries</h1>
            </div>
            <p className="text-slate-400 text-sm">
               We found <span className="text-white font-bold">{activeMatches.length} potential matches</span> that connect to your lineage.
            </p>
         </div>
         <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5">
            <X size={24} />
         </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* 2. LEFT: SCROLLABLE MATCH LIST */}
         <div className="w-full md:w-[450px] border-r border-white/5 bg-navy-900/30 overflow-y-auto p-4 space-y-4">
            {activeMatches.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <ShieldCheck size={48} className="mb-4 opacity-20" />
                  <p>All caught up!</p>
               </div>
            ) : (
               activeMatches.map((match) => (
                  <div 
                    key={match.id}
                    onClick={() => setSelectedId(match.id)}
                    className={`
                       group relative p-5 rounded-2xl border cursor-pointer transition-all duration-300
                       ${selectedId === match.id 
                          ? 'bg-gradient-to-r from-white/10 to-transparent border-gold-500/50 shadow-lg' 
                          : 'bg-navy-900/40 border-white/5 hover:border-white/10 hover:bg-white/5'}
                    `}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                              <User size={24} className="text-slate-500 m-2" />
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-white leading-tight">{match.matchName}</h3>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                 Matched with <span className="text-gold-400">{match.ancestorName}</span>
                              </p>
                           </div>
                        </div>
                        <ConfidenceDial score={match.confidence} />
                     </div>
                     
                     <div className="flex items-center gap-4 text-[10px] text-slate-500 pl-1">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {match.matchProps.birth}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} /> {match.matchProps.loc}</span>
                     </div>

                     {/* Hover Action Hint */}
                     <div className={`absolute right-4 bottom-4 text-gold-400 transition-opacity ${selectedId === match.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                        <ChevronRight size={16} />
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* 3. RIGHT: VISUALIZATION & DETAILS */}
         {activeMatches.length > 0 && selectedMatch && (
            <div className="flex-1 bg-navy-950 relative overflow-y-auto">
               {/* Background Aurora */}
               <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
               
               <div className="max-w-3xl mx-auto p-12">
                  
                  {/* Visualization Component */}
                  <ConnectionGraph activeMatch={selectedMatch} />

                  {/* Detailed Comparison Table */}
                  <div className="bg-navy-900/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden mb-8">
                     <div className="grid grid-cols-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10">
                        <div className="p-4 bg-white/5">Attribute</div>
                        <div className="p-4 border-l border-white/5 text-gold-400">Your Tree</div>
                        <div className="p-4 border-l border-white/5 text-emerald-400">Found Record</div>
                     </div>
                     
                     <div className="grid grid-cols-3 border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <div className="p-4 text-sm text-slate-300 font-medium">Name</div>
                        <div className="p-4 border-l border-white/5 text-sm text-white">{selectedMatch.ancestorName}</div>
                        <div className="p-4 border-l border-white/5 text-sm text-white flex items-center gap-2">
                           {selectedMatch.matchName}
                           {selectedMatch.confidence > 90 && <ShieldCheck size={14} className="text-emerald-500" />}
                        </div>
                     </div>

                     <div className="grid grid-cols-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                        <div className="p-4 text-sm text-slate-300 font-medium">Birth Year</div>
                        <div className="p-4 border-l border-white/5 text-sm text-slate-400">{selectedMatch.userProps.birth}</div>
                        <div className="p-4 border-l border-white/5 text-sm text-emerald-300 bg-emerald-500/5">{selectedMatch.matchProps.birth}</div>
                     </div>

                     <div className="grid grid-cols-3 hover:bg-white/5 transition-colors">
                        <div className="p-4 text-sm text-slate-300 font-medium">Location</div>
                        <div className="p-4 border-l border-white/5 text-sm text-slate-400">{selectedMatch.userProps.loc}</div>
                        <div className="p-4 border-l border-white/5 text-sm text-emerald-300 bg-emerald-500/5">{selectedMatch.matchProps.loc}</div>
                     </div>
                  </div>

                  {/* Source Info */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-900/10 border border-blue-500/20 text-blue-300 text-sm mb-8">
                     <Activity size={18} />
                     <span>Source: <strong>{selectedMatch.source}</strong> • Verified via 3 datapoints.</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                     <Button 
                        onClick={() => handleAction(selectedMatch.id, 'accept')}
                        variant="secondary" 
                        className="flex-1 !py-4 text-base !bg-emerald-600 hover:!bg-emerald-500 !text-white shadow-lg shadow-emerald-900/50 border-none"
                     >
                        <Check size={20} className="mr-2" /> Confirm Match & Merge
                     </Button>
                     <Button 
                        onClick={() => handleAction(selectedMatch.id, 'reject')}
                        variant="outline" 
                        className="flex-1 !py-4 text-base text-slate-400 hover:text-white border-white/10 hover:bg-white/5"
                     >
                        <XCircle size={20} className="mr-2" /> Ignore Hint
                     </Button>
                  </div>

               </div>
            </div>
         )}
      </div>
    </div>
  );
};
