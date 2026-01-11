
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../types';
import { 
  X, Calendar, MapPin, ShieldCheck, Download, ChevronRight, 
  Image as ImageIcon, FileText, Users, Edit3, 
  UserPlus, Megaphone, Link as LinkIcon, Fingerprint, Mic, AlertCircle, Dna, Briefcase, Play
} from 'lucide-react';
import { Button } from './Button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- TYPES ---

interface StaticRootTreeProps {
  data: FamilyMember;
  onClose: () => void;
}

// Extend D3 Hierarchy Node for layout coordinates
interface HierarchyNode extends d3.HierarchyNode<FamilyMember> {
  x0?: number;
  y0?: number;
  x?: number;
  y?: number;
}

// Extended Profile Interface for the Detail Panel
interface DetailedProfile extends FamilyMember {
  bio: string;
  timeline: { year: string; event: string }[];
  extendedRelations: { 
    id: string; 
    name: string; 
    relation: string; 
    customUrduName: string; 
    img: string; 
  }[];
  media: { type: 'PHOTO' | 'AUDIO'; url: string; title: string; duration?: string }[];
  dnaMatches: { name: string; cM: number; relation: string }[];
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  occupation?: string; // Added for the card view
}

export const StaticRootTree: React.FC<StaticRootTreeProps> = ({ data, onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null); // Ref specifically for capturing screenshot
  
  // State
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [detailedProfile, setDetailedProfile] = useState<DetailedProfile | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [rootNode, setRootNode] = useState<HierarchyNode | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FAMILY' | 'MEDIA' | 'TRUST' | 'DNA'>('OVERVIEW');
  const [isExporting, setIsExporting] = useState(false);

  // --- CONFIGURATION ---
  // Horizontal Layout Settings
  const nodeWidth = 260;  // Card Width
  const nodeHeight = 90;  // Card Height
  const horizontalGap = 80; // Gap between generations
  const verticalGap = 20;   // Gap between siblings

  // Effective D3 Layout Settings (Tree is rotated 90deg, so x=vertical, y=horizontal in calculation)
  const dx = nodeHeight + verticalGap; 
  const dy = nodeWidth + horizontalGap; 
  
  const margin = { top: 60, right: 120, bottom: 60, left: 120 };

  // --- 1. DATA SIMULATION (Backend Fetching Logic) ---
  useEffect(() => {
    if (!selectedMember) {
      setDetailedProfile(null);
      return;
    }

    setLoadingDetails(true);
    
    // Simulate API Call: GET /api/individual/:id/details
    setTimeout(() => {
      const mockDetails: DetailedProfile = {
        ...selectedMember,
        occupation: "Merchant / Landowner", // Mock occupation
        bio: `${selectedMember.name} was a pillar of the community in ${selectedMember.placeOfBirth || 'the region'}. Known for their resilience and wisdom, they navigated significant historical shifts during the mid-20th century.`,
        verificationStatus: (selectedMember.confidenceScore || 0) > 80 ? 'VERIFIED' : 'PENDING',
        timeline: [
          { year: '1920', event: 'Born in District Lahore' },
          { year: '1947', event: 'Migrated during Partition' },
          { year: '1955', event: 'Established Family Textile Business' },
          { year: '1988', event: 'Performed Hajj' },
          { year: '2005', event: 'Passed away peacefully' }
        ],
        extendedRelations: [
          { id: 'p1', name: 'Unknown Father', relation: 'Parent', customUrduName: 'Walid', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop' },
          { id: 's1', name: 'Grandmother Zara', relation: 'Spouse', customUrduName: 'Begum / Biwi', img: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&fit=crop' },
          { id: 'c1', name: 'Uncle Yusuf', relation: 'Child', customUrduName: 'Bara Beta', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop' },
          { id: 'c2', name: 'Aunt Fatima', relation: 'Child', customUrduName: 'Beti', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop' }
        ],
        media: [
          { type: 'PHOTO', url: selectedMember.img, title: 'Portrait 1960' },
          { type: 'AUDIO', url: '#', title: 'Stories of Village Life', duration: '4:20' },
          { type: 'PHOTO', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', title: 'Wedding Day' },
          { type: 'PHOTO', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', title: 'Family Reunion 1990' }
        ],
        dnaMatches: [
          { name: 'Tariq Mahmood', cM: 3400, relation: 'Parent/Child' },
          { name: 'Sarah Khan', cM: 1800, relation: 'Niece' },
          { name: 'Dr. Alvi', cM: 500, relation: '2nd Cousin' }
        ]
      };
      setDetailedProfile(mockDetails);
      setLoadingDetails(false);
    }, 600); 

  }, [selectedMember]);

  // --- 2. D3 TREE PREPARATION ---
  useEffect(() => {
    if (!data) return;
    const root = d3.hierarchy<FamilyMember>(data) as HierarchyNode;
    // Initial position for animation start
    root.x0 = 0;
    root.y0 = 0;
    setRootNode(root);
  }, [data]);

  // --- 3. D3 RENDERING LOGIC ---
  useEffect(() => {
    if (!rootNode || !svgRef.current || !wrapperRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    // Groups
    const gLink = svg.append("g").attr("fill", "none").attr("stroke", "#94a3b8").attr("stroke-opacity", 0.4).attr("stroke-width", 1.5);
    const gNode = svg.append("g").attr("cursor", "pointer").attr("pointer-events", "all");

    const update = (source: HierarchyNode) => {
      const duration = 750;
      
      // Calculate Tree Layout (Swapping size x/y makes it horizontal logic)
      const treeLayout = d3.tree<FamilyMember>().nodeSize([dx, dy]);
      const root = treeLayout(rootNode);

      // Auto-resize Logic
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      
      root.each((d: any) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
        if (d.y > y1) y1 = d.y;
        if (d.y < y0) y0 = d.y;
      });

      // Horizontal: d.x is vertical coordinate, d.y is horizontal coordinate
      const height = x1 - x0 + dx * 2;
      const width = y1 - y0 + dy * 2; 

      // Apply Transition to ViewBox
      svg.transition().duration(duration)
        .attr("viewBox", [y0 - margin.left, x0 - margin.top, width, height].join(" "))
        .attr("width", width)
        .attr("height", height);

      const nodes = root.descendants() as HierarchyNode[];
      const links = root.links();

      // Normalize Depth for Horizontal Layout
      nodes.forEach((d: any) => { 
          d.y = d.depth * dy; // Horizontal spacing
          // d.x is handled by tree layout (Vertical spacing)
      });

      // --- NODE RENDER ---
      const node = gNode.selectAll<SVGGElement, HierarchyNode>("g.node")
        .data(nodes, (d) => d.data.id);

      // Enter Phase
      const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`) // Start from parent's previous position
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
           event.stopPropagation();
           setSelectedMember(d.data); 
           setActiveTab('OVERVIEW');
        });

      // --- CARD DESIGN (The "Professional" Look) ---
      
      // 1. Drop Shadow Filter
      const defs = svg.append("defs");
      const filter = defs.append("filter").attr("id", "cardShadow");
      filter.append("feDropShadow").attr("dx", "0").attr("dy", "4").attr("stdDeviation", "6").attr("flood-color", "#000").attr("flood-opacity", "0.1");

      // 2. Card Background
      nodeEnter.append("rect")
        .attr("y", -nodeHeight / 2)
        .attr("x", 0)
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 10) // Rounded Corners
        .attr("fill", "#f8fafc") // Slate-50 (White/Grey)
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 1)
        .style("filter", "url(#cardShadow)")
        .attr("class", "transition-all duration-300 hover:stroke-gold-400");

      // 3. Left Accent Strip (Generation Color)
      nodeEnter.append("rect")
        .attr("y", -nodeHeight / 2)
        .attr("x", 0)
        .attr("width", 6)
        .attr("height", nodeHeight)
        .attr("rx", 0)
        .attr("clip-path", "inset(0 0 0 0 round 10px 0 0 10px)") // Only round left corners
        .attr("fill", (d) => d.depth === 0 ? "#fbbf24" : d.depth === 1 ? "#10b981" : "#3b82f6"); // Gold, Emerald, Blue

      // 4. Avatar Image
      const avatarSize = 56;
      const avatarX = 24;
      const clipId = (d: any) => `clip-card-${d.data.id}`;
      
      nodeEnter.append("clipPath")
        .attr("id", clipId)
        .append("circle")
        .attr("cx", avatarX + avatarSize/2)
        .attr("cy", 0)
        .attr("r", avatarSize/2);

      nodeEnter.append("image")
        .attr("xlink:href", (d) => d.data.img)
        .attr("x", avatarX)
        .attr("y", -avatarSize/2)
        .attr("width", avatarSize)
        .attr("height", avatarSize)
        .attr("clip-path", (d) => `url(#${clipId(d)})`)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("class", "grayscale-[20%]");
      
      // Avatar Border Ring
      nodeEnter.append("circle")
        .attr("cx", avatarX + avatarSize/2)
        .attr("cy", 0)
        .attr("r", avatarSize/2)
        .attr("fill", "none")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 1);

      // 5. Text Content
      const textX = 96; // Right of Avatar

      // Name
      nodeEnter.append("text")
        .attr("x", textX)
        .attr("y", -10)
        .text((d) => d.data.name)
        .attr("font-family", "'Playfair Display', serif")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#0f172a"); // Navy-900

      // Professional Title / Relation
      nodeEnter.append("text")
        .attr("x", textX)
        .attr("y", 8)
        .text((d) => d.data.rishtaTypeTitle || "Family Member")
        .attr("font-family", "Inter, sans-serif")
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .attr("fill", "#64748b") // Slate-500
        .style("text-transform", "uppercase")
        .style("letter-spacing", "0.5px");

      // Birth Year Badge
      const badgeGroup = nodeEnter.append("g")
        .attr("transform", `translate(${textX}, 24)`);
      
      badgeGroup.append("rect")
        .attr("width", 50)
        .attr("height", 18)
        .attr("rx", 4)
        .attr("fill", "#f1f5f9"); // Slate-100

      badgeGroup.append("text")
        .attr("x", 25)
        .attr("y", 12)
        .attr("text-anchor", "middle")
        .text((d) => d.data.dob ? new Date(d.data.dob).getFullYear() : "????")
        .attr("font-family", "monospace")
        .attr("font-size", "10px")
        .attr("fill", "#475569");

      // --- TRANSITIONS ---
      
      // Update nodes to new positions
      const nodeUpdate = node.merge(nodeEnter).transition().duration(duration)
        .attr("transform", (d) => `translate(${d.y},${d.x})`) // Horizontal: y=x, x=y
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Selected State Styling
      nodeUpdate.select("rect")
         .attr("stroke", (d: any) => d.data.id === selectedMember?.id ? "#fbbf24" : "#e2e8f0")
         .attr("stroke-width", (d: any) => d.data.id === selectedMember?.id ? 2 : 1)
         .attr("fill", (d: any) => d.data.id === selectedMember?.id ? "#fffbeb" : "#f8fafc"); // Light Amber if selected

      // Remove exiting nodes
      node.exit().transition().duration(duration).remove()
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // --- LINKS RENDER ---
      const link = gLink.selectAll<SVGPathElement, d3.HierarchyLink<FamilyMember>>("path.link")
        .data(links, (d) => d.target.data.id);

      // Enter Links
      const linkEnter = link.enter().append("path")
        .attr("class", "link")
        .attr("d", (d) => {
          // Start from parent's previous position
          const o = { x: source.x0 || 0, y: source.y0 || 0 };
          return d3.linkHorizontal()({ source: o, target: o });
        });

      // Update Links to new positions
      link.merge(linkEnter).transition().duration(duration)
        .attr("d", d3.linkHorizontal<any, any>()
            .x(d => d.y) // Swap x/y for horizontal
            .y(d => d.x)
        );

      // Remove Exiting Links
      link.exit().transition().duration(duration).remove()
        .attr("d", (d) => {
          const o = { x: source.x || 0, y: source.y || 0 };
          return d3.linkHorizontal()({ source: o, target: o });
        });

      // Stash positions for next transition
      root.eachBefore((d: any) => { 
        d.x0 = d.x; 
        d.y0 = d.y; 
      });
    };

    update(rootNode);
  }, [rootNode, selectedMember]);

  // --- EXPORT LOGIC ---
  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    
    try {
      // Use html2canvas to capture the visual container
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a' // Match background
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate A3 Landscape Dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      pdf.save('Shijra-Sitemap-Family-Tree.pdf');

    } catch (err) {
      console.error("Export Failed", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 font-sans flex animate-fade-in-up overflow-hidden print:bg-white print:text-black">
      
      {/* --- LEFT: CANVAS (Chart) --- */}
      <div className="flex-1 relative h-full flex flex-col">
        {/* Toolbar */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 print:hidden pointer-events-none">
           <div className="pointer-events-auto">
             <h2 className="text-xl font-serif text-white font-bold tracking-wide">Family Sitemap</h2>
             <p className="text-slate-400 text-xs uppercase tracking-widest">Professional Report View</p>
           </div>
           <div className="flex gap-3 pointer-events-auto">
             <Button variant="secondary" onClick={handleExportPDF} disabled={isExporting} className="!py-2 !px-4 !text-xs !bg-white/10 !text-white hover:!bg-white/20 !border-white/10">
               {isExporting ? <span className="animate-spin">...</span> : <><Download size={16} className="mr-2" /> PDF Export</>}
             </Button>
             <button onClick={onClose} className="p-2 bg-navy-900/80 rounded-full text-slate-400 hover:text-white border border-white/10 hover:border-red-500/50 transition-all">
               <X size={24} />
             </button>
           </div>
        </div>

        {/* Scrollable Container (Print Target) */}
        <div ref={printRef} className="flex-1 overflow-hidden bg-[#020617] relative">
          <div ref={wrapperRef} className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing print:bg-white print:overflow-visible">
            {/* Grid Background (Hidden on Print) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none print:hidden" style={{ minWidth: '100%', minHeight: '100%' }} />
            
            <svg ref={svgRef} className="w-full min-h-full block print:w-full print:h-auto" />
          </div>
        </div>
      </div>

      {/* --- RIGHT: DETAIL PANEL (Existing Implementation with updates) --- */}
      <div 
         className={`
            fixed top-0 right-0 h-full
            w-full md:w-[35vw] min-w-[400px]
            bg-navy-900/95 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] 
            transform transition-transform duration-500 ease-in-out z-20 flex flex-col
            ${selectedMember ? 'translate-x-0' : 'translate-x-full'}
            print:hidden
         `}
      >
         {selectedMember && (
           <>
             {/* 1. HERO HEADER */}
             <div className="relative pt-12 pb-6 px-8 border-b border-white/5 bg-gradient-to-b from-navy-800/80 to-transparent">
               <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                 <X size={20} />
               </button>

               <div className="flex items-center gap-6">
                 <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-full border-[3px] border-gold-500/50 shadow-2xl p-1 bg-navy-950">
                        <img src={selectedMember.img} className="w-full h-full rounded-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    {detailedProfile?.verificationStatus === 'VERIFIED' && (
                        <div className="absolute bottom-1 right-1 bg-emerald-500 text-navy-950 p-1.5 rounded-full border-2 border-navy-950 shadow-lg" title="Verified Ancestor">
                            <ShieldCheck size={16} fill="currentColor" />
                        </div>
                    )}
                 </div>
                 
                 <div className="flex-1">
                    <h2 className="text-3xl font-serif text-white font-bold leading-none mb-2 drop-shadow-md">{selectedMember.name}</h2>
                    <div className="flex flex-col gap-1">
                      <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                          {selectedMember.rishtaTypeTitle || "Family Member"}
                      </div>
                      {detailedProfile?.occupation && (
                        <div className="inline-flex items-center gap-2 text-slate-400 text-xs">
                           <Briefcase size={12} /> {detailedProfile.occupation}
                        </div>
                      )}
                    </div>
                 </div>
               </div>
             </div>

             {/* 2. NAVIGATION TABS */}
             <div className="flex border-b border-white/5 px-2 bg-navy-950/30">
                {[
                  { id: 'OVERVIEW', label: 'Overview', icon: FileText },
                  { id: 'FAMILY', label: 'Family', icon: Users },
                  { id: 'MEDIA', label: 'Media', icon: ImageIcon },
                  { id: 'TRUST', label: 'Sources', icon: ShieldCheck },
                  { id: 'DNA', label: 'DNA', icon: Dna }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex-1 flex flex-col items-center justify-center gap-1.5 py-4 text-[10px] font-bold uppercase tracking-wider transition-all relative
                      ${activeTab === tab.id ? 'text-gold-400 bg-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                    `}
                  >
                    <tab.icon size={16} className={activeTab === tab.id ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-500'} />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-400 shadow-[0_-2px_10px_rgba(251,191,36,0.5)]" />
                    )}
                  </button>
                ))}
             </div>

             {/* 3. CONTENT AREA */}
             <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {loadingDetails ? (
                   <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" />
                      <p className="text-xs text-slate-500 animate-pulse uppercase tracking-widest">Retrieving Archives...</p>
                   </div>
                ) : detailedProfile ? (
                   <>
                     {/* TAB: OVERVIEW */}
                     {activeTab === 'OVERVIEW' && (
                       <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                          
                          {/* Vital Stats */}
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-gold-500/20 transition-all">
                               <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                                 <Calendar size={14} className="text-gold-400" /> Born
                               </div>
                               <div className="text-white font-serif text-lg">{new Date(detailedProfile.dob || '').getFullYear() || 'Unknown'}</div>
                               <div className="text-slate-500 text-xs mt-1">{detailedProfile.placeOfBirth || 'Unknown Location'}</div>
                             </div>
                             <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-gold-500/20 transition-all">
                               <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                                 <MapPin size={14} className="text-gold-400" /> Died
                               </div>
                               <div className="text-white font-serif text-lg">{detailedProfile.dod ? new Date(detailedProfile.dod).getFullYear() : 'Living'}</div>
                               <div className="text-slate-500 text-xs mt-1">{detailedProfile.placeOfDeath || '-'}</div>
                             </div>
                          </div>

                          {/* Biography */}
                          <div>
                            <h4 className="text-white font-serif text-xl mb-4 flex items-center gap-2">
                              <span className="w-1 h-6 bg-gold-400 rounded-full" /> Life Story
                            </h4>
                            <p className="text-slate-300 text-sm leading-7 font-light tracking-wide">
                              {detailedProfile.bio}
                            </p>
                          </div>

                          {/* Timeline */}
                          <div>
                             <h4 className="text-white font-serif text-xl mb-4 flex items-center gap-2">
                               <span className="w-1 h-6 bg-emerald-500 rounded-full" /> Timeline
                             </h4>
                             <div className="space-y-0 relative border-l-2 border-white/5 ml-2">
                                {detailedProfile.timeline.map((event, i) => (
                                   <div key={i} className="mb-6 pl-6 relative group">
                                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-navy-900 border-2 border-slate-600 group-hover:border-gold-400 group-hover:bg-gold-400/20 transition-all" />
                                      <div className="text-gold-400 font-mono text-xs font-bold mb-1">{event.year}</div>
                                      <div className="text-slate-300 text-sm">{event.event}</div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                     )}

                     {/* TAB: FAMILY */}
                     {activeTab === 'FAMILY' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                           {['Parents', 'Spouse', 'Child'].map((relType) => {
                              const kin = detailedProfile.extendedRelations.filter(r => r.relation === relType);
                              if (kin.length === 0) return null;
                              
                              return (
                                <div key={relType}>
                                   <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">{relType === 'Child' ? 'Children' : relType + 's'}</h5>
                                   <div className="space-y-2">
                                      {kin.map(k => (
                                         <div key={k.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-gold-500/20 transition-all cursor-pointer group">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                                               <img src={k.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1">
                                               <div className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors">{k.name}</div>
                                               <div className="text-xs text-emerald-400 font-medium">{k.customUrduName}</div>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-600 group-hover:text-white" />
                                         </div>
                                      ))}
                                   </div>
                                </div>
                              );
                           })}
                        </div>
                     )}

                     {/* TAB: MEDIA & STORIES */}
                     {activeTab === 'MEDIA' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                           
                           {/* Audio Section */}
                           <div>
                              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Mic size={12} /> Oral History
                              </h5>
                              <div className="space-y-3">
                                 {detailedProfile.media.filter(m => m.type === 'AUDIO').map((audio, i) => (
                                    <div key={i} className="p-4 bg-gradient-to-r from-navy-800 to-navy-900 rounded-xl border border-white/10 flex items-center gap-4 hover:border-gold-500/30 transition-all group">
                                       <button className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-navy-950 shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform">
                                          <Play size={16} fill="currentColor" />
                                       </button>
                                       <div className="flex-1">
                                          <div className="text-sm font-bold text-white mb-1">{audio.title}</div>
                                          {/* Mock Waveform */}
                                          <div className="flex items-end gap-0.5 h-4 opacity-50">
                                             {[...Array(30)].map((_, j) => (
                                                <div 
                                                  key={j} 
                                                  className="w-1 bg-gold-400 rounded-t-sm group-hover:bg-emerald-400 transition-colors" 
                                                  style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.5 + Math.random() * 0.5 }} 
                                                />
                                             ))}
                                          </div>
                                       </div>
                                       <div className="text-xs text-slate-400 font-mono">{audio.duration}</div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* Photos Grid */}
                           <div>
                              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ImageIcon size={12} /> Gallery
                              </h5>
                              <div className="grid grid-cols-2 gap-3">
                                 {detailedProfile.media.filter(m => m.type === 'PHOTO').map((photo, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group cursor-pointer">
                                       <img src={photo.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                          <span className="text-xs text-white font-medium truncate">{photo.title}</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}

                     {/* TAB: TRUST / SOURCES */}
                     {activeTab === 'TRUST' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                           {/* Animated Dial */}
                           <div className="bg-navy-800/50 rounded-2xl p-6 border border-white/5 text-center relative overflow-hidden">
                              <div className="relative z-10 flex flex-col items-center">
                                 <div className="w-32 h-32 relative flex items-center justify-center mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                       <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="8" fill="none" />
                                       <circle 
                                          cx="64" cy="64" r="56" 
                                          stroke={detailedProfile.confidenceScore && detailedProfile.confidenceScore > 80 ? "#10b981" : "#fbbf24"} 
                                          strokeWidth="8" fill="none" 
                                          strokeDasharray={2 * Math.PI * 56} 
                                          strokeDashoffset={2 * Math.PI * 56 * (1 - (detailedProfile.confidenceScore || 100) / 100)} 
                                          strokeLinecap="round"
                                          className="transition-all duration-1000 ease-out"
                                       />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                       <span className="text-3xl font-bold text-white">{detailedProfile.confidenceScore || 100}%</span>
                                       <span className="text-[9px] uppercase tracking-widest text-slate-400">Confidence</span>
                                    </div>
                                 </div>
                                 <div className="text-xs text-slate-300">
                                    Verified via <strong className="text-white">Birth Certificate</strong> and <strong className="text-white">Census 1942</strong>.
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Source Links</h5>
                              <a href={detailedProfile.sourceVerificationUrl || '#'} target="_blank" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                 <LinkIcon size={16} className="text-slate-500 group-hover:text-emerald-400" />
                                 <span className="text-sm text-slate-300 truncate">Archive.org Record #8821</span>
                                 <ChevronRight size={14} className="ml-auto text-slate-600" />
                              </a>
                           </div>
                        </div>
                     )}

                     {/* TAB: DNA */}
                     {activeTab === 'DNA' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                           {detailedProfile.dnaMatches.length > 0 ? (
                              detailedProfile.dnaMatches.map((match, i) => (
                                 <div key={i} className="p-4 bg-gradient-to-br from-indigo-900/20 to-navy-900 rounded-xl border border-indigo-500/20 flex items-center gap-4 hover:border-indigo-500/50 transition-all">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                                       <Fingerprint size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="text-sm font-bold text-white truncate">{match.name}</div>
                                       <div className="text-xs text-indigo-300">{match.relation}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                       <div className="text-sm font-mono font-bold text-white">{match.cM} cM</div>
                                       <div className="text-[9px] text-slate-500 uppercase">Shared DNA</div>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="text-center py-10 text-slate-500 text-xs border-2 border-dashed border-white/5 rounded-2xl">
                                 <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                                 No DNA links found for this individual.
                              </div>
                           )}
                        </div>
                     )}
                   </>
                ) : null}
             </div>

             {/* 4. FOOTER ACTIONS */}
             <div className="p-6 bg-navy-900/80 border-t border-white/10 flex gap-3 shrink-0 backdrop-blur-xl">
               <Button variant="secondary" className="flex-1 !py-3 !text-xs !bg-gold-500 hover:!bg-gold-400 !text-navy-950 font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] border-none">
                 <Edit3 size={14} className="mr-2" /> Edit Details
               </Button>
               <Button variant="outline" className="flex-1 !py-3 !text-xs border-white/10 hover:bg-white/5 text-slate-300">
                 <UserPlus size={14} className="mr-2" /> Add Relation
               </Button>
               <button className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 hover:bg-emerald-500 hover:text-navy-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                 <Megaphone size={18} />
               </button>
             </div>

           </>
         )}
      </div>

    </div>
  );
};
