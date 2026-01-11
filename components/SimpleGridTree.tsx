
import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Calendar, MapPin, ShieldCheck, User, ArrowRight, Briefcase, Users, Link as LinkIcon, Dna, Mic, Image as ImageIcon, FileText } from 'lucide-react';
import { FamilyMember } from '../types';
import { Button } from './Button';

// --- TYPES ---
interface SimpleGridTreeProps {
  data: FamilyMember;
  onClose: () => void;
}

interface DetailedProfile extends FamilyMember {
  bio: string;
  timeline: { year: string; event: string }[];
  media: { type: 'PHOTO' | 'AUDIO'; url: string; title: string; duration?: string }[];
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  occupation?: string;
}

// --- HELPER: FLATTEN TREE ---
const flattenTree = (node: FamilyMember): FamilyMember[] => {
  let list = [node];
  if (node.children) {
    node.children.forEach(child => {
      list = list.concat(flattenTree(child));
    });
  }
  if (node.spouses) {
    node.spouses.forEach(spouse => {
        // Avoid duplicates if spouses are linked circularly in real app, 
        // but for this tree structure, just add them.
        list.push(spouse); 
    });
  }
  return list;
};

export const SimpleGridTree: React.FC<SimpleGridTreeProps> = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  
  // Detail Panel State
  const [detailedProfile, setDetailedProfile] = useState<DetailedProfile | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MEDIA' | 'SOURCES'>('OVERVIEW');

  // --- 1. DATA PREPARATION (Memoized for Performance) ---
  const allMembers = useMemo(() => {
    const flat = flattenTree(data);
    // Remove duplicates based on ID just in case
    const unique = new Map();
    flat.forEach(m => unique.set(m.id, m));
    return Array.from(unique.values());
  }, [data]);

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return allMembers;
    const lowerTerm = searchTerm.toLowerCase();
    return allMembers.filter(m => 
      m.name.toLowerCase().includes(lowerTerm) || 
      (m.dob && m.dob.includes(lowerTerm)) ||
      (m.placeOfBirth && m.placeOfBirth.toLowerCase().includes(lowerTerm))
    );
  }, [allMembers, searchTerm]);

  // --- 2. DETAIL PANEL LOGIC (Simulated Backend) ---
  useEffect(() => {
    if (!selectedMember) {
      setDetailedProfile(null);
      return;
    }
    setLoadingDetails(true);
    // Simulate API Fetch
    setTimeout(() => {
      setDetailedProfile({
        ...selectedMember,
        occupation: "Historical Figure",
        bio: `${selectedMember.name} lived during a time of great change. This is a placeholder biography generated for the grid view demo.`,
        verificationStatus: (selectedMember.confidenceScore || 0) > 80 ? 'VERIFIED' : 'PENDING',
        timeline: [
          { year: selectedMember.dob ? new Date(selectedMember.dob).getFullYear().toString() : '19XX', event: 'Born' },
          { year: '19XX', event: 'Major Life Event' },
          { year: selectedMember.dod ? new Date(selectedMember.dod).getFullYear().toString() : '20XX', event: 'Passed Away' }
        ],
        media: [
           { type: 'PHOTO', url: selectedMember.img, title: 'Portrait' },
           { type: 'PHOTO', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', title: 'Family Gathering' }
        ]
      });
      setLoadingDetails(false);
    }, 300);
  }, [selectedMember]);

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 flex flex-col animate-fade-in-up font-sans overflow-hidden">
      
      {/* --- HEADER & SEARCH --- */}
      <div className="relative z-20 bg-navy-900/80 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
             <Users className="text-emerald-400" size={24} />
           </div>
           <div>
             <h2 className="text-xl font-serif font-bold text-white">Family Directory</h2>
             <p className="text-xs text-slate-400 uppercase tracking-widest">{allMembers.length} Records found</p>
           </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl w-full relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-400 transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="Search by name, year, or location..." 
             className="w-full bg-navy-950 border border-white/10 rounded-full py-3 pl-12 pr-12 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             autoFocus
           />
           {searchTerm && (
             <button 
               onClick={() => setSearchTerm('')}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
             >
               <X size={16} />
             </button>
           )}
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-white border border-white/5 transition-all">
          <X size={24} />
        </button>
      </div>

      {/* --- GRID CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#020617] relative">
         {/* Background Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

         {filteredMembers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
               <Search size={64} className="text-slate-600 mb-4" />
               <p className="text-slate-400 text-lg">No family members found matching "{searchTerm}"</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 relative z-10 pb-20">
               {filteredMembers.map((member) => (
                  <div 
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`
                      group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer
                      bg-white/5 backdrop-blur-sm border border-white/10
                      hover:border-gold-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]
                      transition-all duration-300 transform hover:-translate-y-2
                      ${selectedMember?.id === member.id ? 'ring-2 ring-gold-400 border-transparent' : ''}
                    `}
                  >
                     {/* Image */}
                     <div className="absolute inset-0 bg-navy-900">
                        <img 
                          src={member.img} 
                          alt={member.name} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-90" />
                     </div>

                     {/* Content Overlay */}
                     <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end h-full">
                        
                        {/* Top Right Icons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                           {member.confidenceScore && member.confidenceScore > 80 && (
                             <div className="p-1.5 bg-emerald-500 rounded-full text-navy-950 shadow-lg" title="Verified">
                               <ShieldCheck size={12} />
                             </div>
                           )}
                        </div>

                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                           <h3 className="text-white font-serif font-bold text-lg leading-tight mb-1 drop-shadow-md">
                             {member.name}
                           </h3>
                           
                           <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
                              <span className="bg-white/10 px-2 py-0.5 rounded text-gold-200">
                                {member.dob ? new Date(member.dob).getFullYear() : 'Unknown'}
                              </span>
                              {member.placeOfBirth && (
                                <span className="truncate max-w-[80px]" title={member.placeOfBirth}>
                                  {member.placeOfBirth}
                                </span>
                              )}
                           </div>

                           <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1 hover:text-emerald-300">
                                View Profile <ArrowRight size={10} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* --- RIGHT SIDE DETAIL PANEL (Integrated) --- */}
      <div 
         className={`
            fixed top-0 right-0 h-full w-full md:w-[400px] lg:w-[450px]
            bg-navy-900/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl
            transform transition-transform duration-500 ease-in-out z-30 flex flex-col
            ${selectedMember ? 'translate-x-0' : 'translate-x-full'}
         `}
      >
         {selectedMember && (
           <>
             {/* Panel Header */}
             <div className="h-60 relative shrink-0">
               <img src={selectedMember.img} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent" />
               
               <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all border border-white/10">
                 <X size={20} />
               </button>

               <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                     {detailedProfile?.verificationStatus === 'VERIFIED' ? <ShieldCheck size={12} /> : null}
                     {detailedProfile?.verificationStatus || 'Unknown'}
                  </div>
                  <h2 className="text-4xl font-serif text-white font-bold leading-none mb-2 drop-shadow-xl">
                    {selectedMember.name}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                     <span className="flex items-center gap-1"><Calendar size={14} className="text-gold-400" /> {selectedMember.dob ? new Date(selectedMember.dob).getFullYear() : '????'} - {selectedMember.dod ? new Date(selectedMember.dod).getFullYear() : 'Present'}</span>
                     <span className="w-1 h-1 bg-slate-500 rounded-full" />
                     {detailedProfile?.occupation && (
                        <span className="flex items-center gap-1"><Briefcase size={14} className="text-gold-400" /> {detailedProfile.occupation}</span>
                     )}
                  </div>
               </div>
             </div>

             {/* Navigation */}
             <div className="flex border-b border-white/5 p-1 bg-navy-950/50 mx-6 rounded-xl mt-4 mb-2">
                {['OVERVIEW', 'MEDIA', 'SOURCES'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             {/* Panel Content */}
             <div className="flex-1 overflow-y-auto p-8 pt-2">
               {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center py-10">
                     <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin mb-2" />
                     <p className="text-xs text-slate-500 uppercase tracking-widest">Loading Archives...</p>
                  </div>
               ) : detailedProfile ? (
                  <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                     
                     {activeTab === 'OVERVIEW' && (
                       <>
                         <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <FileText size={14} /> Biography
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed font-light">
                              {detailedProfile.bio}
                            </p>
                         </div>

                         <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Timeline</h4>
                            <div className="space-y-0 relative border-l border-white/10 ml-2">
                               {detailedProfile.timeline.map((event, i) => (
                                  <div key={i} className="mb-6 pl-6 relative group">
                                     <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-navy-900 border-2 border-slate-600 group-hover:border-gold-400 group-hover:bg-gold-400 transition-colors" />
                                     <div className="text-gold-400 font-mono text-xs font-bold mb-0.5">{event.year}</div>
                                     <div className="text-slate-300 text-sm">{event.event}</div>
                                  </div>
                               ))}
                            </div>
                         </div>
                       </>
                     )}

                     {activeTab === 'MEDIA' && (
                        <div className="grid grid-cols-2 gap-3">
                           {detailedProfile.media.map((item, i) => (
                              <div key={i} className="group relative aspect-square bg-navy-800 rounded-xl overflow-hidden border border-white/5 cursor-pointer">
                                 {item.type === 'PHOTO' && <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">{item.title}</span>
                                 </div>
                              </div>
                           ))}
                           <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                              <ImageIcon size={24} className="mb-2" />
                              <span className="text-[10px] uppercase font-bold">Add Photo</span>
                           </div>
                        </div>
                     )}

                     {activeTab === 'SOURCES' && (
                        <div className="space-y-3">
                           <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                              <LinkIcon size={16} className="text-slate-500 group-hover:text-emerald-400" />
                              <span className="text-sm text-slate-300">Birth Certificate Archive</span>
                              <ArrowRight size={14} className="ml-auto text-slate-600" />
                           </a>
                           <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                              <Dna size={16} className="text-slate-500 group-hover:text-pink-400" />
                              <span className="text-sm text-slate-300">DNA Match Confirmation</span>
                              <ArrowRight size={14} className="ml-auto text-slate-600" />
                           </a>
                        </div>
                     )}

                  </div>
               ) : null}
             </div>

             {/* Footer Actions */}
             <div className="p-6 border-t border-white/10 bg-navy-900/80 backdrop-blur-xl">
               <Button fullWidth variant="secondary" className="!py-3 !bg-gold-500 text-navy-950 font-bold hover:!bg-gold-400 shadow-lg shadow-gold-500/20">
                 View Full Tree Topology
               </Button>
             </div>
           </>
         )}
      </div>

    </div>
  );
};
