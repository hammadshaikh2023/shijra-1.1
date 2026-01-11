
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X, Download, Layers, ZoomIn, ZoomOut, User, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { FamilyMember } from '../types';
import { Button } from './Button';

interface FanChartProps {
  data: FamilyMember;
  onClose: () => void;
}

// Helper to expand data to specific depth for demo purposes if tree is shallow
const ensureDepth = (node: FamilyMember, currentDepth: number, maxDepth: number): FamilyMember => {
  if (currentDepth >= maxDepth) return node;
  
  const children = node.children || [];
  // If no children, mock them for visual completeness of the Fan Chart (optional)
  if (children.length === 0) {
     return {
       ...node,
       children: [
         ensureDepth({ id: `${node.id}-1`, name: "Unknown", img: "", gender: "MALE" }, currentDepth + 1, maxDepth),
         ensureDepth({ id: `${node.id}-2`, name: "Unknown", img: "", gender: "FEMALE" }, currentDepth + 1, maxDepth)
       ]
     }
  }

  return {
    ...node,
    children: children.map(c => ensureDepth(c, currentDepth + 1, maxDepth))
  };
};

export const FanChart: React.FC<FanChartProps> = ({ data, onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [generations, setGenerations] = useState(5);
  const [hoveredNode, setHoveredNode] = useState<{ x: number, y: number, data: any } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // 1. Process Data & Layout
    // We treat the data as a hierarchy
    // Note: Fan charts work best when the tree is balanced. 
    // In a real app, you might want to fill gaps with "Unknown" placeholders.
    const hierarchyData = d3.hierarchy(ensureDepth(data, 0, generations))
      .sum(() => 1)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // 2. Dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const radius = Math.min(width, height) / 2 - 60; // Padding

    // 3. Clear Canvas
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // 4. Partition Layout (The Fan Logic)
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);

    const root = partition(hierarchyData);

    // Limit to selected generations
    const nodes = root.descendants().filter(d => d.depth <= generations);

    // 5. Arc Generator
    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    // 6. Color Scale (Deep Navy to Slate)
    const colorScale = d3.scaleLinear<string>()
      .domain([0, generations])
      .range(["#0f172a", "#475569"]); // Navy-900 to Slate-600

    // 7. Draw Arcs
    const path = g.selectAll("path")
      .data(nodes)
      .join("path")
      .attr("fill", d => {
         if(d.depth === 0) return "#fbbf24"; // Center is Gold
         return colorScale(d.depth);
      })
      .attr("fill-opacity", d => d.depth === 0 ? 1 : 0.8)
      .attr("stroke", "#fbbf24") // Gold borders
      .attr("stroke-width", d => d.depth === 0 ? 0 : 0.5)
      .attr("d", arc)
      .style("cursor", "pointer")
      .attr("class", "transition-all duration-300");

    // 8. Hover Interactions
    path.on("mouseenter", function(event, d) {
        // Highlight logic
        d3.select(this)
          .attr("fill", "#10b981") // Emerald highlight
          .attr("transform", "scale(1.02)");

        // Tooltip logic
        setHoveredNode({
          x: event.clientX,
          y: event.clientY,
          data: d.data
        });
    })
    .on("mouseleave", function(event, d) {
        d3.select(this)
          .attr("fill", d.depth === 0 ? "#fbbf24" : colorScale(d.depth))
          .attr("transform", "scale(1)");
        
        setHoveredNode(null);
    });

    // 9. Labels
    const labelGroup = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none");

    labelGroup.selectAll("text")
      .data(nodes.filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10)) // Only label if arc is big enough
      .join("text")
      .attr("transform", function(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .text(d => d.data.name.split(" ")[0]) // First name only to save space
      .attr("fill", "white")
      .attr("font-size", d => `${Math.max(8, 14 - d.depth)}px`)
      .attr("font-family", "serif")
      .attr("font-weight", "bold")
      .style("text-shadow", "0 1px 3px rgba(0,0,0,0.8)");

    // Center Image/Icon
    if (data.img) {
       g.append("clipPath")
         .attr("id", "center-clip")
         .append("circle")
         .attr("r", nodes[0].y1 - 5);
       
       g.append("image")
         .attr("xlink:href", data.img)
         .attr("x", -nodes[0].y1)
         .attr("y", -nodes[0].y1)
         .attr("width", nodes[0].y1 * 2)
         .attr("height", nodes[0].y1 * 2)
         .attr("clip-path", "url(#center-clip)")
         .attr("preserveAspectRatio", "xMidYMid slice")
         .style("pointer-events", "none");
    }

  }, [generations, data]);

  // --- EXPORT LOGIC ---
  const handleExport = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 4, // High Res (4x)
        backgroundColor: '#020617', // Ensure navy background
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `Shijra-Fan-Chart-${generations}Gen.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 font-sans flex flex-col animate-fade-in-up">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/30">
               <Layers className="text-gold-400" size={20} />
             </div>
             <h2 className="text-2xl font-serif text-white font-bold tracking-wide shadow-black drop-shadow-md">Radial Ancestry</h2>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Generational Fan Chart</p>
        </div>

        <div className="flex gap-4 pointer-events-auto">
           {/* GENERATION CONTROL */}
           <div className="flex items-center gap-3 bg-navy-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase">Generations</span>
              <button onClick={() => setGenerations(Math.max(3, generations - 1))} className="p-1 hover:text-white text-slate-400"><ZoomOut size={16} /></button>
              <span className="text-gold-400 font-mono font-bold w-4 text-center">{generations}</span>
              <button onClick={() => setGenerations(Math.min(8, generations + 1))} className="p-1 hover:text-white text-slate-400"><ZoomIn size={16} /></button>
           </div>

           <Button variant="secondary" onClick={handleExport} disabled={isExporting} className="!py-2 !px-4 !text-xs !bg-gold-500 hover:!bg-gold-400 !text-navy-950 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
             {isExporting ? <span className="animate-spin">Processing...</span> : <><Printer size={16} className="mr-2" /> Print Poster</>}
           </Button>

           <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5">
             <X size={24} />
           </button>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#020617] flex items-center justify-center">
         {/* Background Texture */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy-900/50 via-navy-950 to-black pointer-events-none" />
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

         <svg ref={svgRef} className="w-full h-full block relative z-10" />
      </div>

      {/* FROSTED GLASS TOOLTIP */}
      {hoveredNode && (
        <div 
          className="fixed z-50 pointer-events-none animate-[fadeIn_0.15s_ease-out]"
          style={{ 
            left: hoveredNode.x + 20, 
            top: hoveredNode.y + 20,
          }}
        >
           <div className="bg-navy-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[200px] text-left">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent rounded-xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-2 relative z-10">
                 {hoveredNode.data.img ? (
                   <img src={hoveredNode.data.img} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-white/10">
                     <User size={16} className="text-slate-400" />
                   </div>
                 )}
                 <div>
                    <h4 className="text-white font-serif font-bold text-sm">{hoveredNode.data.name}</h4>
                    <span className="text-[10px] text-gold-400 uppercase tracking-wider">{hoveredNode.data.gender || 'Ancestor'}</span>
                 </div>
              </div>
              
              <div className="space-y-1 relative z-10">
                 <div className="flex justify-between text-[10px] text-slate-300">
                    <span>Born:</span> <span className="text-white">{hoveredNode.data.dob ? new Date(hoveredNode.data.dob).getFullYear() : 'Unknown'}</span>
                 </div>
                 <div className="flex justify-between text-[10px] text-slate-300">
                    <span>Location:</span> <span className="text-white">{hoveredNode.data.place_of_birth || 'Unknown'}</span>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
