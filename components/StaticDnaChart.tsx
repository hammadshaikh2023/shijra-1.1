
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X, Dna, Layers, ChevronDown, Info, Share2, ZoomIn } from 'lucide-react';

// --- TYPES ---
interface DnaSegment {
  chromosome: number;
  start: number; // Base pair position
  end: number;
  cM: number;
  snps: number;
}

interface MatchProfile {
  id: string;
  name: string;
  relation: string;
  segments: DnaSegment[];
  color: string;
}

interface StaticDnaChartProps {
  onClose: () => void;
}

// --- MOCK DATA ---
// Approx length of human chromosomes in millions of base pairs (Mbp)
const CHROMOSOME_LENGTHS = [
  248, 242, 198, 190, 181, 171, 159, 145, 138, 133, 
  135, 133, 114, 107, 101, 90, 83, 80, 58, 64, 46, 50
];

const MOCK_MATCHES: MatchProfile[] = [
  {
    id: "m1",
    name: "Uncle Yusuf",
    relation: "Paternal Uncle",
    color: "#fbbf24", // Gold
    segments: [
      { chromosome: 1, start: 10000000, end: 45000000, cM: 45.2, snps: 3200 },
      { chromosome: 1, start: 80000000, end: 120000000, cM: 30.5, snps: 2100 },
      { chromosome: 3, start: 0, end: 198000000, cM: 120.0, snps: 8500 }, // Full chrom match
      { chromosome: 5, start: 50000000, end: 90000000, cM: 40.1, snps: 2900 },
      { chromosome: 12, start: 10000000, end: 60000000, cM: 55.4, snps: 4100 },
      { chromosome: 19, start: 5000000, end: 25000000, cM: 28.2, snps: 1800 },
    ]
  },
  {
    id: "m2",
    name: "Cousin Sara",
    relation: "1st Cousin",
    color: "#f472b6", // Pink
    segments: [
      { chromosome: 1, start: 15000000, end: 30000000, cM: 18.5, snps: 1200 },
      { chromosome: 2, start: 40000000, end: 80000000, cM: 42.0, snps: 3100 },
      { chromosome: 8, start: 20000000, end: 50000000, cM: 35.2, snps: 2400 },
      { chromosome: 15, start: 10000000, end: 40000000, cM: 29.8, snps: 2000 },
      { chromosome: 21, start: 0, end: 20000000, cM: 15.1, snps: 900 },
    ]
  },
  {
    id: "m3",
    name: "Grandmother Zara",
    relation: "Maternal Grandmother",
    color: "#34d399", // Emerald
    segments: [
      { chromosome: 2, start: 0, end: 242000000, cM: 260.0, snps: 15000 },
      { chromosome: 4, start: 0, end: 190000000, cM: 190.0, snps: 12000 },
      { chromosome: 6, start: 0, end: 171000000, cM: 180.0, snps: 11500 },
      { chromosome: 10, start: 20000000, end: 100000000, cM: 90.5, snps: 6000 },
      { chromosome: 14, start: 0, end: 107000000, cM: 115.0, snps: 7200 },
      { chromosome: 22, start: 0, end: 50000000, cM: 60.0, snps: 4000 },
    ]
  }
];

export const StaticDnaChart: React.FC<StaticDnaChartProps> = ({ onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [selectedMatchId, setSelectedMatchId] = useState<string>(MOCK_MATCHES[0].id);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, data: DnaSegment } | null>(null);

  const selectedMatch = MOCK_MATCHES.find(m => m.id === selectedMatchId) || MOCK_MATCHES[0];

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    // --- SETUP DIMENSIONS ---
    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    const margin = { top: 60, right: 40, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // --- SCALES ---
    // Y Axis: Chromosomes 1 to 22
    const yScale = d3.scaleBand()
      .domain(d3.range(1, 23).map(String))
      .range([margin.top, height - margin.bottom])
      .padding(0.4);

    // X Axis: Base Pairs (0 to max chromosome length)
    const maxBp = Math.max(...CHROMOSOME_LENGTHS) * 1000000;
    const xScale = d3.scaleLinear()
      .domain([0, maxBp])
      .range([margin.left, width - margin.right]);

    // --- DEFS (GLOW FILTERS) ---
    const defs = svg.append("defs");
    
    // Segment Glow (Neon Effect)
    const glowFilter = defs.append("filter").attr("id", "segmentGlow");
    glowFilter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Base Bar Gradient (Glass Tube effect)
    const barGradient = defs.append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    barGradient.append("stop").attr("offset", "0%").attr("stop-color", "#0f172a").attr("stop-opacity", 0.9); // Dark edges
    barGradient.append("stop").attr("offset", "50%").attr("stop-color", "#334155").attr("stop-opacity", 0.5); // Lighter center
    barGradient.append("stop").attr("offset", "100%").attr("stop-color", "#0f172a").attr("stop-opacity", 0.9);

    // --- DRAW LAYERS ---
    const gBase = svg.append("g").attr("class", "base-chromosomes");
    const gSegments = svg.append("g").attr("class", "dna-segments");
    const gLabels = svg.append("g").attr("class", "labels");

    // 1. Draw Base Chromosomes (The Glass Tubes)
    CHROMOSOME_LENGTHS.forEach((lenMbp, i) => {
      const chromNum = i + 1;
      const barWidth = xScale(lenMbp * 1000000) - margin.left;
      const yPos = yScale(String(chromNum)) || 0;
      const barHeight = yScale.bandwidth();

      // Entrance Animation for Tubes
      gBase.append("rect")
        .attr("x", margin.left)
        .attr("y", yPos)
        .attr("width", 0) // Start width 0
        .attr("height", barHeight)
        .attr("rx", barHeight / 2)
        .attr("fill", "url(#barGradient)")
        .attr("stroke", "#475569")
        .attr("stroke-width", 0.5)
        .transition().duration(1000).delay(i * 30) // Staggered
        .attr("width", barWidth);

      // Label (Chr Number)
      gLabels.append("text")
        .attr("x", margin.left - 15)
        .attr("y", yPos + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .attr("opacity", 0)
        .text(chromNum)
        .transition().duration(1000).delay(i * 30)
        .attr("opacity", 1);
    });

    // 2. Draw Matching Segments
    gSegments.selectAll("rect")
      .data(selectedMatch.segments)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.start))
      .attr("y", d => (yScale(String(d.chromosome)) || 0) + 1) // +1 padding for border
      .attr("width", 0) // Animate width from 0
      .attr("height", yScale.bandwidth() - 2)
      .attr("rx", (yScale.bandwidth() - 2) / 2)
      .attr("fill", selectedMatch.color)
      .attr("filter", "url(#segmentGlow)")
      .attr("cursor", "crosshair")
      .on("mouseenter", function(event, d) {
         d3.select(this)
           .attr("fill", "#ffffff") // Flash white on hover
           .attr("filter", "url(#segmentGlow)"); 
           
         const rect = this.getBoundingClientRect();
         setTooltip({
           x: rect.left + rect.width / 2,
           y: rect.top,
           data: d
         });
      })
      .on("mouseleave", function(event, d) {
         d3.select(this).attr("fill", selectedMatch.color);
         setTooltip(null);
      })
      .transition().duration(800).delay(500).ease(d3.easeCubicOut)
      .attr("width", d => Math.max(3, xScale(d.end) - xScale(d.start))); // Min width 3px for visibility

    // Axis Labels
    gLabels.append("text")
      .attr("x", width - margin.right)
      .attr("y", height - 10)
      .attr("text-anchor", "end")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text("Genomic Position (Millions of Base Pairs)");

  }, [selectedMatch, selectedMatchId]); // Re-run when match changes

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 font-sans flex flex-col animate-fade-in-up">
      
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 bg-navy-900/80 backdrop-blur-xl flex justify-between items-center z-10 shadow-lg">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Dna className="text-emerald-400" /> Chromosome Browser
          </h2>
          <p className="text-xs text-slate-400 mt-1">Visualize shared DNA segments across chromosomes 1-22.</p>
        </div>
        
        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          
          {/* Custom Frosted Dropdown */}
          <div className="relative group">
             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl cursor-pointer hover:border-gold-500/30 hover:bg-white/10 transition-all shadow-inner">
               <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {selectedMatch.name[0]}
               </div>
               <select 
                 className="appearance-none bg-transparent outline-none text-sm text-white font-medium cursor-pointer pr-8 min-w-[150px]"
                 value={selectedMatchId}
                 onChange={(e) => setSelectedMatchId(e.target.value)}
               >
                 {MOCK_MATCHES.map(m => (
                   <option key={m.id} value={m.id} className="bg-navy-900 text-white">
                     {m.name} ({m.relation})
                   </option>
                 ))}
               </select>
               <ChevronDown size={14} className="absolute right-4 text-gold-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
             </div>
          </div>

          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors border border-white/5">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* CHART AREA */}
      <div ref={wrapperRef} className="flex-1 relative overflow-hidden bg-[#020617]">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] pointer-events-none" />

        <svg ref={svgRef} className="w-full h-full block relative z-10" />

        {/* TOOLTIP */}
        {tooltip && (
          <div 
            className="fixed z-50 pointer-events-none animate-[fadeIn_0.15s_cubic-bezier(0.16,1,0.3,1)]"
            style={{ 
              left: tooltip.x, 
              top: tooltip.y - 15,
              transform: 'translate(-50%, -100%)' 
            }}
          >
            <div className="bg-navy-900/90 backdrop-blur-2xl border border-white/10 p-4 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] min-w-[200px] ring-1 ring-gold-500/30">
               <div className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 pb-2 border-b border-white/5">
                 <Info size={12} /> Chromosome {tooltip.data.chromosome}
               </div>
               
               <div className="space-y-1.5">
                 <div className="flex justify-between items-center text-xs gap-4">
                   <span className="text-slate-400 font-medium">Position</span> 
                   <span className="font-mono text-slate-200">{(tooltip.data.start/1000000).toFixed(1)}M - {(tooltip.data.end/1000000).toFixed(1)}M</span>
                 </div>
                 <div className="flex justify-between items-center text-xs gap-4">
                   <span className="text-slate-400 font-medium">Size</span> 
                   <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 rounded">{tooltip.data.cM} cM</span>
                 </div>
                 <div className="flex justify-between items-center text-xs gap-4">
                   <span className="text-slate-400 font-medium">Density</span> 
                   <span className="font-mono text-white">{tooltip.data.snps.toLocaleString()} SNPs</span>
                 </div>
               </div>
               
               {/* Arrow */}
               <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-navy-900 border-r border-b border-white/10 transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      {/* LEGEND FOOTER */}
      <div className="p-4 bg-navy-950 border-t border-white/5 flex justify-center gap-8 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
         <div className="flex items-center gap-2">
           <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600"></span> 
           Unmatched Region
         </div>
         <div className="flex items-center gap-2 text-white">
           <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px] shadow-current" style={{ backgroundColor: selectedMatch.color, color: selectedMatch.color }}></span> 
           Shared Segment ({selectedMatch.name})
         </div>
      </div>

    </div>
  );
};
