import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X, Dna, Activity, Share2, Info, Sparkles } from 'lucide-react';
import { Button } from './Button';

// --- TYPES ---
interface DnaMatch {
  id: string;
  name: string;
  cM: number; // Centimorgans (Shared DNA)
  segments: number;
  relationship: string;
  img: string;
}

// --- MOCK DATA ---
const MOCK_MATCHES: DnaMatch[] = [
  { id: '1', name: "Father", cM: 3450, segments: 25, relationship: "Parent", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
  { id: '2', name: "Sarah A.", cM: 2600, segments: 45, relationship: "Sibling", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
  { id: '3', name: "Uncle John", cM: 1700, segments: 35, relationship: "Uncle", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
  { id: '4', name: "Cousin Ali", cM: 850, segments: 18, relationship: "1st Cousin", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
  { id: '5', name: "Zara K.", cM: 400, segments: 9, relationship: "2nd Cousin", img: "https://images.unsplash.com/photo-1554151228-14d9def656ec?w=150&h=150&fit=crop" },
  { id: '6', name: "R. Singh", cM: 150, segments: 4, relationship: "3rd Cousin", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
  { id: '7', name: "Mr. Unknown", cM: 60, segments: 2, relationship: "Distant", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
];

interface Props {
  onClose: () => void;
}

export const DnaVisualizer: React.FC<Props> = ({ onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, data: DnaMatch } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // --- SETUP ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", "transparent");

    svg.selectAll("*").remove(); 

    // --- DEFINITIONS (Glow Filters) ---
    const defs = svg.append("defs");
    
    // 1. Electric Blue Glow (For Connection Lines)
    const blueGlow = defs.append("filter").attr("id", "blueGlow");
    blueGlow.append("feGaussianBlur").attr("stdDeviation", "2").attr("result", "coloredBlur");
    const feMergeBlue = blueGlow.append("feMerge");
    feMergeBlue.append("feMergeNode").attr("in", "coloredBlur");
    feMergeBlue.append("feMergeNode").attr("in", "SourceGraphic");

    // 2. Gold Glow (For Central Node)
    const goldGlow = defs.append("filter").attr("id", "goldGlow");
    goldGlow.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "coloredBlur");
    const feMergeGold = goldGlow.append("feMerge");
    feMergeGold.append("feMergeNode").attr("in", "coloredBlur");
    feMergeGold.append("feMergeNode").attr("in", "SourceGraphic");

    // --- SCALES ---
    // Map cM (0 to 3500) to Radius distance from center
    // High cM = Closer (Small Radius)
    // Low cM = Farther (Large Radius)
    const maxRadius = Math.min(width, height) / 2 - 60;
    const minRadius = 100;
    
    const radiusScale = d3.scaleLinear()
      .domain([3500, 0]) 
      .range([minRadius, maxRadius]);

    // Map cM to Rotation Speed (Closer = Faster)
    const speedScale = d3.scaleLinear()
      .domain([3500, 0])
      .range([0.003, 0.0005]); 

    // Map cM to Node Size
    const sizeScale = d3.scaleSqrt()
      .domain([0, 3500])
      .range([6, 20]);

    // --- LAYERS ---
    const orbitsLayer = svg.append("g").attr("class", "orbits");
    const connectionsLayer = svg.append("g").attr("class", "connections");
    const nodesLayer = svg.append("g").attr("class", "nodes");
    const centerLayer = svg.append("g").attr("class", "center-node");

    // --- 1. ORBIT TRACKS (Static Rings) ---
    MOCK_MATCHES.forEach(d => {
      const r = radiusScale(d.cM);
      orbitsLayer.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#94a3b8") // Slate-400
        .attr("stroke-opacity", 0.08)
        .attr("stroke-width", 1)
        .style("pointer-events", "none");
    });

    // --- 2. CENTRAL NODE (Bright Gold) ---
    const centerGroup = centerLayer.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Outer Glow
    centerGroup.append("circle")
      .attr("r", 35)
      .attr("fill", "#fbbf24") // Gold
      .attr("fill-opacity", 0.1)
      .attr("filter", "url(#goldGlow)");
    
    // Core
    centerGroup.append("circle")
      .attr("r", 20)
      .attr("fill", "#0f172a") // Navy
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 3)
      .attr("filter", "url(#goldGlow)");
      
    centerGroup.append("text")
      .text("YOU")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fbbf24")
      .attr("font-size", "10px")
      .attr("font-weight", "800")
      .attr("letter-spacing", "0.05em");

    // --- 3. DYNAMIC NODES & LINES ---
    
    // Initialize node state with random angles
    const nodes = MOCK_MATCHES.map(d => ({
      ...d,
      angle: Math.random() * Math.PI * 2, // Random start angle
      radius: radiusScale(d.cM),
      speed: speedScale(d.cM),
      size: sizeScale(d.cM),
      x: 0,
      y: 0
    }));

    // Create Line Elements (Luminous Electric Blue)
    const lines = connectionsLayer.selectAll("line")
      .data(nodes)
      .enter()
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("stroke", "#06b6d4") // Cyan-500 (Electric Blue)
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4)
      .attr("stroke-linecap", "round")
      .attr("filter", "url(#blueGlow)")
      .style("pointer-events", "none");

    // Create Planet Groups
    const planets = nodesLayer.selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "planet cursor-pointer")
      .on("mouseenter", (event, d) => {
         // Tooltip Logic
         const rect = containerRef.current?.getBoundingClientRect();
         if(rect) {
             setTooltip({
                 x: event.clientX,
                 y: event.clientY,
                 data: d
             });
         }
         
         // Highlight Effect on Hover
         d3.select(event.currentTarget).select("circle.core")
            .transition().duration(200)
            .attr("stroke", "#fbbf24") // Turn Gold
            .attr("stroke-width", 3);
            
         // Highlight Line
         lines.filter(l => l.id === d.id)
            .transition().duration(200)
            .attr("stroke", "#fbbf24")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 2);

      })
      .on("mouseleave", (event, d) => {
         setTooltip(null);
         
         // Reset Node
         d3.select(event.currentTarget).select("circle.core")
            .transition().duration(300)
            .attr("stroke", d.cM > 2000 ? "#fbbf24" : "#22d3ee")
            .attr("stroke-width", 2);
            
         // Reset Line
         lines.filter(l => l.id === d.id)
            .transition().duration(300)
            .attr("stroke", "#06b6d4")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);
      });

    // Planet Core Circle
    planets.append("circle")
      .attr("class", "core")
      .attr("r", d => d.size)
      .attr("fill", "#0f172a") // Navy fill to show image behind? Or solid?
      .attr("fill", "#0f172a") 
      .attr("stroke", d => d.cM > 2000 ? "#fbbf24" : "#22d3ee") // Gold for family, Blue for distant
      .attr("stroke-width", 2);

    // Planet Image Clip
    const clipId = (d: any) => `clip-planet-${d.id}`;
    planets.append("clipPath")
      .attr("id", clipId)
      .append("circle")
      .attr("r", d => d.size - 2); // Slightly smaller than border

    planets.append("image")
      .attr("xlink:href", d => d.img)
      .attr("x", d => -d.size)
      .attr("y", d => -d.size)
      .attr("width", d => d.size * 2)
      .attr("height", d => d.size * 2)
      .attr("clip-path", d => `url(#${clipId(d)})`)
      .attr("preserveAspectRatio", "xMidYMid slice");


    // --- ANIMATION LOOP ---
    const timer = d3.timer((elapsed) => {
      // 1. Update Angles based on speed
      nodes.forEach(n => {
        n.angle += n.speed;
        n.x = centerX + Math.cos(n.angle) * n.radius;
        n.y = centerY + Math.sin(n.angle) * n.radius;
      });

      // 2. Move Planets
      planets.attr("transform", d => `translate(${d.x}, ${d.y})`);

      // 3. Update Connecting Lines
      lines
        .attr("x2", d => d.x)
        .attr("y2", d => d.y)
        // Add pulsating opacity effect based on time
        .attr("stroke-opacity", 0.3 + Math.sin(elapsed * 0.003) * 0.2); 
    });

    return () => {
      timer.stop();
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950 flex flex-col animate-fade-in-up">
      
      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <Dna className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" size={24} />
            <h2 className="text-xl font-serif text-white font-bold tracking-wide">DNA Constellation</h2>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Live Genetic Proximity Map</p>
        </div>
        <button onClick={onClose} className="pointer-events-auto p-2 bg-navy-900/80 rounded-full text-slate-400 hover:text-white border border-white/10 hover:border-red-500/50 transition-all">
          <X size={24} />
        </button>
      </div>

      {/* --- CANVAS CONTAINER --- */}
      <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-900 via-navy-950 to-black">
        {/* Deep Space Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        
        {/* The D3 Visualization */}
        <svg ref={svgRef} className="w-full h-full block relative z-10" />

        {/* --- TOOLTIP (Floating) --- */}
        {tooltip && (
            <div 
                className="fixed z-50 pointer-events-none animate-[fadeIn_0.2s_ease-out]"
                style={{ 
                    left: tooltip.x + 20, 
                    top: tooltip.y - 20 
                }}
            >
                <div className="bg-navy-900/90 backdrop-blur-xl border border-gold-500/30 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[200px]">
                    <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-600">
                             <img src={tooltip.data.img} className="w-full h-full rounded-full object-cover border border-navy-900" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">{tooltip.data.name}</h4>
                            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-900/30 px-1.5 py-0.5 rounded inline-block mt-0.5 border border-cyan-500/20">
                                {tooltip.data.relationship}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-[10px] text-slate-400 uppercase">Shared DNA</div>
                            <div className="text-sm font-mono text-gold-400 font-bold">{tooltip.data.cM} <span className="text-[9px]">cM</span></div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-[10px] text-slate-400 uppercase">Segments</div>
                            <div className="text-sm font-mono text-white font-bold">{tooltip.data.segments}</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- LEGEND --- */}
      <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
         <div className="flex items-center gap-4 text-[10px] text-slate-400 bg-navy-950/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24] shadow-[0_0_5px_#fbbf24]"></span>
                <span>Close Family</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_5px_#22d3ee]"></span>
                <span>Distant Matches</span>
            </div>
         </div>
      </div>

    </div>
  );
};
