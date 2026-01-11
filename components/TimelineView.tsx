
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Calendar, MapPin, User, Star, Heart, Plane, Baby, BookOpen, Filter } from 'lucide-react';
import { FamilyMember } from '../types';

// --- TYPES ---
type EventType = 'BIRTH' | 'DEATH' | 'MARRIAGE' | 'MIGRATION' | 'STORY' | 'MILESTONE';

interface TimelineEvent {
  id: string;
  date: string; // YYYY-MM-DD
  year: string;
  type: EventType;
  title: string;
  description: string;
  location?: string;
  peopleIds: string[]; // IDs of people involved
  img?: string;
}

interface Props {
  onClose: () => void;
  data?: FamilyMember; // Optional: to filter events by specific person if needed
}

// --- MOCK DATA ---
const EVENTS: TimelineEvent[] = [
  { id: '1', date: '1920-05-15', year: '1920', type: 'BIRTH', title: 'Birth of Great Grandfather', description: 'Born in the quiet village of Kotli, amidst the changing political landscape.', location: 'Kotli, District Lahore', peopleIds: ['1'] },
  { id: '2', date: '1942-08-10', year: '1942', type: 'MARRIAGE', title: 'Wedding: Ahmed & Zara', description: 'A grand celebration uniting two prominent families of the region.', location: 'Amritsar', peopleIds: ['2', '8'] },
  { id: '3', date: '1947-08-14', year: '1947', type: 'MIGRATION', title: 'The Great Migration', description: 'The family migrated via train during the Partition, leaving behind their ancestral haveli.', location: 'Lahore Railway Station', peopleIds: ['1', '2', '8'], img: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=200&fit=crop' },
  { id: '4', date: '1955-03-22', year: '1955', type: 'BIRTH', title: 'Birth of Father Karim', description: 'The first child born in the new homeland.', location: 'Lahore', peopleIds: ['3'] },
  { id: '5', date: '1965-09-01', year: '1965', type: 'STORY', title: 'Karim\'s First Bicycle', description: 'Recorded Story: Karim recalls saving up coins for 2 years to buy a red bicycle.', location: 'Gulberg, Lahore', peopleIds: ['3'] },
  { id: '6', date: '1980-12-10', year: '1980', type: 'MARRIAGE', title: 'Wedding: Karim & Spouse', description: 'Held at the PC Hotel, attended by over 500 guests.', location: 'Lahore', peopleIds: ['3'] },
  { id: '7', date: '1985-06-15', year: '1985', type: 'MILESTONE', title: 'Family Textile Mill Opens', description: 'Grandfather Ahmed inaugurates the family business foundation.', location: 'Faisalabad', peopleIds: ['2', '3'] },
  { id: '8', date: '1994-02-28', year: '1994', type: 'BIRTH', title: 'Birth of Daughter Layla', description: 'A joyous occasion.', location: 'Karachi', peopleIds: ['5'] },
  { id: '9', date: '2005-11-02', year: '2005', type: 'DEATH', title: 'Passing of Grandfather Ahmed', description: 'He left a legacy of resilience and unity. Buried in the family graveyard.', location: 'Lahore', peopleIds: ['2'] },
];

// --- CONFIGURATION ---
const EVENT_CONFIG: Record<EventType, { color: string, icon: React.ReactNode, label: string }> = {
  BIRTH: { color: '#10b981', icon: <Baby size={16} />, label: 'Births' }, // Emerald
  DEATH: { color: '#64748b', icon: <User size={16} />, label: 'Deaths' }, // Slate
  MARRIAGE: { color: '#ec4899', icon: <Heart size={16} />, label: 'Marriages' }, // Pink
  MIGRATION: { color: '#3b82f6', icon: <Plane size={16} />, label: 'Migration' }, // Blue
  STORY: { color: '#fbbf24', icon: <BookOpen size={16} />, label: 'Stories' }, // Gold
  MILESTONE: { color: '#8b5cf6', icon: <Star size={16} />, label: 'Milestones' }, // Purple
};

export const TimelineView: React.FC<Props> = ({ onClose }) => {
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(['BIRTH', 'MARRIAGE', 'MIGRATION', 'STORY', 'MILESTONE', 'DEATH']));
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sorting
  const filteredEvents = EVENTS
    .filter(e => activeFilters.has(e.type))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const toggleFilter = (type: EventType) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) newSet.delete(type);
      else newSet.add(type);
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 font-sans flex flex-col animate-fade-in-up overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-start md:items-center z-20 bg-gradient-to-b from-navy-950 via-navy-950/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto mb-4 md:mb-0">
          <h2 className="text-2xl font-serif text-white font-bold tracking-wide flex items-center gap-3">
            <HistoryIcon /> Chronology
          </h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest pl-1">Interactive Family Timeline</p>
        </div>

        {/* Filter Bar */}
        <div className="pointer-events-auto flex flex-wrap gap-2 items-center bg-navy-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl">
           <div className="px-3 text-slate-500 border-r border-white/10 mr-1">
              <Filter size={16} />
           </div>
           {Object.entries(EVENT_CONFIG).map(([key, config]) => (
             <button
               key={key}
               onClick={() => toggleFilter(key as EventType)}
               className={`
                 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                 ${activeFilters.has(key as EventType) 
                   ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/20' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
               `}
               style={{ 
                 color: activeFilters.has(key as EventType) ? config.color : undefined 
               }}
             >
                {config.icon}
                {config.label}
             </button>
           ))}
        </div>

        <button onClick={onClose} className="pointer-events-auto absolute top-6 right-6 p-2 bg-navy-900/80 rounded-full text-slate-400 hover:text-white border border-white/10 hover:border-red-500/50 transition-all">
          <X size={24} />
        </button>
      </div>

      {/* --- DRAGGABLE TIMELINE TRACK --- */}
      <div ref={containerRef} className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden">
         {/* Background Ambience */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-900/30 via-navy-950 to-black pointer-events-none" />
         
         <motion.div 
           drag="y"
           dragConstraints={containerRef}
           className="min-h-full w-full py-32 relative"
         >
            {/* The Luminous Trail Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.3)]" />

            {/* Event Nodes */}
            <div className="max-w-4xl mx-auto px-4 relative">
               <AnimatePresence>
                 {filteredEvents.map((event, index) => {
                    const isLeft = index % 2 === 0;
                    const config = EVENT_CONFIG[event.type];
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`
                          relative flex md:items-center mb-16
                          ${isLeft ? 'md:justify-end' : 'md:justify-start'}
                          pl-8 md:pl-0
                        `}
                      >
                         {/* Connection Dot on Line (Mobile: Left aligned, Desktop: Center) */}
                         <div 
                           className="absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full -translate-x-1/2 border-2 z-10 bg-navy-950 transition-all duration-300 shadow-[0_0_15px_currentColor]"
                           style={{ borderColor: config.color, color: config.color }}
                         >
                            <div className="absolute inset-0 bg-current opacity-20 rounded-full animate-ping" />
                         </div>

                         {/* Content Card */}
                         <div 
                           onClick={() => setSelectedEvent(event)}
                           className={`
                             w-full md:w-[45%] bg-navy-900/60 backdrop-blur-sm border border-white/5 p-5 rounded-2xl 
                             hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group relative
                             ${isLeft ? 'md:mr-12' : 'md:ml-12'}
                           `}
                         >
                            {/* Decorative Line to Center */}
                            <div 
                              className={`hidden md:block absolute top-2 w-12 h-px bg-white/10 group-hover:bg-white/30 transition-colors
                                ${isLeft ? '-right-12' : '-left-12'}
                              `} 
                            />

                            <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg bg-navy-950 border border-white/10`} style={{ color: config.color }}>
                                     {config.icon}
                                  </div>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{event.year}</span>
                               </div>
                               {event.type === 'STORY' && <span className="text-[10px] bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-full border border-gold-500/20">Audio</span>}
                            </div>

                            <h3 className="text-white font-serif font-bold text-lg mb-1 group-hover:text-gold-300 transition-colors">{event.title}</h3>
                            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                            
                            {event.location && (
                              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                                <MapPin size={12} /> {event.location}
                              </div>
                            )}
                         </div>
                      </motion.div>
                    );
                 })}
               </AnimatePresence>
            </div>
         </motion.div>
      </div>

      {/* --- FROSTED GLASS DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
             >
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-br from-navy-800 to-navy-950 relative">
                   {selectedEvent.img ? (
                     <img src={selectedEvent.img} className="w-full h-full object-cover opacity-60 mask-image-gradient" />
                   ) : (
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent" />
                   
                   <button 
                     onClick={() => setSelectedEvent(null)} 
                     className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-white/10 rounded-full text-white transition-colors"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="p-8 relative -mt-12">
                   {/* Event Icon Badge */}
                   <div 
                     className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg border-4 border-navy-900 mb-6"
                     style={{ backgroundColor: EVENT_CONFIG[selectedEvent.type].color }}
                   >
                      {EVENT_CONFIG[selectedEvent.type].icon}
                   </div>

                   <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">{selectedEvent.date}</span>
                      <span className="text-xs font-bold" style={{ color: EVENT_CONFIG[selectedEvent.type].color }}>{selectedEvent.type}</span>
                   </div>

                   <h3 className="text-3xl font-serif font-bold text-white mb-4">{selectedEvent.title}</h3>
                   
                   <p className="text-slate-300 leading-relaxed text-sm mb-6">
                      {selectedEvent.description}
                   </p>

                   {selectedEvent.location && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 bg-navy-950/50 p-3 rounded-lg border border-white/5">
                         <MapPin size={16} className="text-gold-400" />
                         {selectedEvent.location}
                      </div>
                   )}

                   {/* Associated People */}
                   {selectedEvent.peopleIds.length > 0 && (
                      <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Family Present</h4>
                         <div className="flex -space-x-2">
                            {selectedEvent.peopleIds.map((pid, i) => (
                               <div key={i} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-navy-900 flex items-center justify-center text-xs font-bold text-slate-300 relative z-10" title="Person Name">
                                  {/* In real app, fetch avatar by ID */}
                                  <User size={16} />
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Simple Icon Component
const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
