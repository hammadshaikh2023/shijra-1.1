
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Languages as LangIcon, Calendar, X, ChevronDown, Sparkles, History, User, Dna, Mic, BookOpen, Fingerprint, Users } from 'lucide-react';
import { Button } from './Button';

interface AdvancedSearchFilterProps {
  onClose: () => void;
}

// Mock Options
const RELIGIONS = ['Any Religion', 'Islam', 'Christianity', 'Hinduism', 'Sikhism', 'Judaism', 'Other'];
const LANGUAGES = ['Any Language', 'Urdu', 'Punjabi', 'Arabic', 'Farsi', 'English', 'Sindhi', 'Pashto'];

// Mock Results
const MOCK_RESULTS = [
  { id: 1, name: 'Tariq Mahmood', location: 'Lahore, Pakistan', language: 'Punjabi', relation: 'Great Uncle', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50', hasDna: true, hasAudio: true },
  { id: 2, name: 'Al-Hassan Ibn Ali', location: 'Baghdad, Middle East', language: 'Arabic', relation: 'Ancestor (12th Gen)', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50', hasDna: false, hasAudio: false },
  { id: 3, name: 'Ranjeet Singh', location: 'Amritsar, India', language: 'Punjabi', relation: 'Distant Cousin', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50', hasDna: true, hasAudio: false },
];

export const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({ onClose }) => {
  // Filter States
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [language, setLanguage] = useState('Any Language');
  const [religion, setReligion] = useState('Any Religion');
  const [khandaan, setKhandaan] = useState(''); // Clan/Gotra
  const [hasDna, setHasDna] = useState(false);
  const [hasOralHistory, setHasOralHistory] = useState(false);

  // Search States
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSearch = () => {
    setIsSearching(true);
    setResults(null);
    
    // Simulate API Call delay
    setTimeout(() => {
      setIsSearching(false);
      setResults(MOCK_RESULTS);
    }, 1500);
  };

  const clearFilters = () => {
    setName('');
    setLocation('');
    setYearFrom('');
    setYearTo('');
    setLanguage('Any Language');
    setReligion('Any Religion');
    setKhandaan('');
    setHasDna(false);
    setHasOralHistory(false);
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]" 
        onClick={onClose}
      />

      {/* Main Panel */}
      <div className="relative w-full max-w-4xl bg-navy-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)] flex flex-col max-h-[90vh]">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="p-8 pb-6 border-b border-white/5 relative z-10 flex justify-between items-center bg-navy-950/30">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
              <Search className="text-gold-400" size={24} /> 
              Ancestral Archive Search
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-light tracking-wide">Filter through generations to find lost connections.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- FILTER BODY (2 Columns) --- */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* COLUMN 1: BASIC FILTERS */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                <User size={14} /> Basic Archives
              </h3>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium ml-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Grandfather Ahmed"
                    className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-all focus:bg-navy-900"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium ml-1">Ancestral Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="City, Village, or Region"
                    className="w-full bg-navy-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-all focus:bg-navy-900"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Birth Year Range */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium ml-1">Birth Year Range</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="number"
                      placeholder="From"
                      className="w-full bg-navy-950/50 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                    />
                  </div>
                  <span className="text-slate-500">-</span>
                  <div className="relative flex-1">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="number"
                      placeholder="To"
                      className="w-full bg-navy-950/50 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: ADVANCED FILTERS */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                <BookOpen size={14} /> Deep Lineage
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium ml-1">Language</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 appearance-none focus:outline-none focus:border-purple-500/50"
                    >
                      {LANGUAGES.map(l => <option key={l} value={l} className="bg-navy-900">{l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Religion */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium ml-1">Religion</label>
                  <div className="relative">
                    <select 
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className="w-full bg-navy-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 appearance-none focus:outline-none focus:border-purple-500/50"
                    >
                      {RELIGIONS.map(r => <option key={r} value={r} className="bg-navy-900">{r}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Khandaan / Gotra */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium ml-1">Khandaan / Gotra / Clan</label>
                <div className="relative">
                  <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Malik, Rajput, Syeds"
                    className="w-full bg-navy-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all focus:bg-navy-900"
                    value={khandaan}
                    onChange={(e) => setKhandaan(e.target.value)}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-4">
                
                {/* DNA Toggle */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${hasDna ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-navy-950/30 border-white/5 hover:bg-white/5'}`}
                  onClick={() => setHasDna(!hasDna)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${hasDna ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500'}`}>
                      <Dna size={18} />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${hasDna ? 'text-white' : 'text-slate-400'}`}>Has DNA Data</div>
                      <div className="text-[10px] text-slate-500">Only show profiles with genetic links</div>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${hasDna ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${hasDna ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>

                {/* Oral History Toggle */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${hasOralHistory ? 'bg-gold-500/10 border-gold-500/30' : 'bg-navy-950/30 border-white/5 hover:bg-white/5'}`}
                  onClick={() => setHasOralHistory(!hasOralHistory)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${hasOralHistory ? 'bg-gold-500/20 text-gold-400' : 'bg-white/5 text-slate-500'}`}>
                      <Mic size={18} />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${hasOralHistory ? 'text-white' : 'text-slate-400'}`}>Has Oral History</div>
                      <div className="text-[10px] text-slate-500">Profiles with voice recordings</div>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${hasOralHistory ? 'bg-gold-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${hasOralHistory ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RESULTS AREA (Only show if searching or results exist) */}
          {(isSearching || results) && (
            <div className="mt-8 pt-8 border-t border-white/5">
               <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                 {isSearching ? 'Searching Archives...' : `${results?.length} Records Found`}
               </h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {isSearching ? (
                    // Skeleton Loaders
                    [1,2].map(i => (
                      <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                    ))
                 ) : (
                    results?.map((res) => (
                      <div key={res.id} className="flex items-center gap-4 p-4 bg-navy-950/50 hover:bg-white/5 border border-white/5 hover:border-gold-500/20 rounded-xl cursor-pointer group transition-all">
                          <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-white/10 group-hover:border-gold-400/50 transition-colors shrink-0">
                            <img src={res.img} alt={res.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-slate-200 font-bold group-hover:text-white truncate">{res.name}</h4>
                              <div className="flex gap-1">
                                {res.hasDna && <Fingerprint size={12} className="text-cyan-400" />}
                                {res.hasAudio && <Mic size={12} className="text-gold-400" />}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">{res.relation}</span>
                              <span className="truncate">{res.location}</span>
                            </div>
                          </div>
                          <ChevronDown size={16} className="-rotate-90 text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                    ))
                 )}
               </div>
            </div>
          )}

        </div>
        
        {/* --- FOOTER ACTIONS --- */}
        <div className="p-6 bg-navy-950/80 border-t border-white/10 flex justify-between items-center backdrop-blur-xl">
          <button 
            onClick={clearFilters}
            className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Clear Filters
          </button>
          
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            variant="secondary" 
            className="!py-3 !px-8 !text-sm !font-bold !rounded-full shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] border-none"
          >
            {isSearching ? (
              <span className="flex items-center gap-2"><Sparkles size={16} className="animate-spin" /> Scanning...</span>
            ) : (
              <span className="flex items-center gap-2"><Search size={16} /> Find Records</span>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
