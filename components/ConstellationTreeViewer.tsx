
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, ShieldCheck, Waves, Sparkles, CircleDot, LayoutTemplate, BookOpen, Compass, Zap, Cpu, History } from 'lucide-react';
import { Button } from './Button';

interface Props {
  onClose: () => void;
}

type ViewMode = 'COSMIC' | 'RADIAL' | 'BLUEPRINT' | 'FLOW';

const flatData = [
  { id: "1", name: "Great Grandfather", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&fit=crop", dob: "1910", bio: "The patriarch of the Ahmed lineage." },
  { id: "2", name: "Grandfather Ahmed", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&fit=crop", dob: "1942", rishta_type: "Paternal" },
  { id: "3", name: "Father Karim", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop", dob: "1970" },
  { id: "4", name: "Uncle Yusuf", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&fit=crop", dob: "1972" },
  { id: "5", name: "Grandmother Zara", img: "https://images.unsplash.com/photo-1554151228-14d9def656ec?w=150&fit=crop", dob: "1915" },
  { id: "6", name: "Brother Ali", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&fit=crop", dob: "1995" },
  { id: "7", name: "Sister Sana", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&fit=crop", dob: "1998" },
  { id: "8", name: "Cousin Zayd", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&fit=crop", dob: "2000" }
];

const RELATIONS = [
  { p: "1", c: "2" }, { p: "1", c: "5" },
  { p: "2", c: "3" }, { p: "2", c: "4" },
  { p: "3", c: "6" }, { p: "3", c: "7" },
  { p: "4", c: "8" }
];

export const ConstellationTreeViewer: React.FC<Props> = ({ onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('FLOW');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const simulationRef = useRef<any>(null);

  // Layout logic optimized for speed
  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;
    
    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Standard Zoom Behavior
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);

    // Initial Transform
    svg.call(zoom.transform, d3.zoomIdentity.translate(width/2, height/2).scale(0.8));

    // Data Preparation
    const stratifier = d3.stratify<any>().id(d => d.id).parentId(d => RELATIONS.find(r => r.c === d.id)?.p);
    const root = stratifier(flatData);

    // Stop previous simulation
    if (simulationRef.current) simulationRef.current.stop();

    if (viewMode === 'FLOW') {
      const treeLayout = d3.tree().size([height * 0.8, width * 0.6]);
      treeLayout(root as any);
      
      const links = g.append("g").selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal().x((d: any) => d.y - width/4).y((d: any) => d.x - height/2.5) as any)
        .attr("fill", "none")
        .attr("stroke", "url(#energyGrad)")
        .attr("stroke-width", 2)
        .attr("class", "neural-path")
        .style("filter", "blur(0.5px)");

      renderNodes(g, root.descendants(), width, height, 'FLOW');

    } else if (viewMode === 'RADIAL') {
      const radius = Math.min(width, height) / 2.2;
      const cluster = d3.cluster().size([360, radius]);
      cluster(root as any);

      // Radial Rings
      [0.4, 0.7, 1.0].forEach(m => {
        g.append("circle")
          .attr("r", radius * m)
          .attr("fill", "none")
          .attr("stroke", "rgba(251, 191, 36, 0.05)")
          .attr("stroke-dasharray", "4,4");
      });

      const radialLink = d3.linkRadial<any, any>().angle(d => d.x * Math.PI / 180).radius(d => d.y);
      g.append("g").selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", radialLink as any)
        .attr("fill", "none")
        .attr("stroke", "rgba(251, 191, 36, 0.3)")
        .attr("stroke-width", 1.5);

      const nodes = g.append("g").selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `rotate(${d.x - 90}) translate(${d.y},0)`)
        .attr("class", "cursor-pointer")
        .on("click", (e, d: any) => setSelectedNode(d.data));

      nodes.append("circle").attr("r", 25).attr("fill", "#020617").attr("stroke", "#fbbf24").attr("stroke-width", 2);
      nodes.append("clipPath").attr("id", d => `c-${d.id}`).append("circle").attr("r", 23);
      nodes.append("image")
        .attr("xlink:href", (d: any) => d.data.img)
        .attr("x", -23).attr("y", -23).attr("width", 46).attr("height", 46)
        .attr("clip-path", d => `url(#c-${d.id})`)
        .attr("preserveAspectRatio", "xMidYMid slice");
      
      nodes.append("text")
        .attr("dy", "0.31em")
        .attr("x", (d: any) => d.x < 180 === !d.children ? 35 : -35)
        .attr("text-anchor", (d: any) => d.x < 180 === !d.children ? "start" : "end")
        .attr("transform", (d: any) => d.x >= 180 ? "rotate(180)" : null)
        .text((d: any) => d.data.name)
        .attr("fill", "white").attr("font-size", "10px").attr("font-weight", "bold");

    } else if (viewMode === 'BLUEPRINT') {
      const treeLayout = d3.tree().size([width * 0.9, height * 0.7]);
      treeLayout(root as any);

      g.append("g").selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkVertical().x((d: any) => d.x - width/2).y((d: any) => d.y - height/2.5) as any)
        .attr("fill", "none")
        .attr("stroke", "rgba(59, 130, 246, 0.4)")
        .attr("stroke-width", 1);

      const nodes = g.append("g").selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x - width/2},${d.y - height/2.5})`)
        .attr("class", "cursor-pointer")
        .on("click", (e, d: any) => setSelectedNode(d.data));

      nodes.append("rect").attr("x", -60).attr("y", -20).attr("width", 120).attr("height", 40).attr("fill", "#0a192f").attr("stroke", "#3b82f6").attr("stroke-width", 1);
      nodes.append("text").text((d: any) => d.data.name).attr("text-anchor", "middle").attr("dy", "-2").attr("fill", "white").attr("font-size", "10px").attr("font-family", "monospace");
      nodes.append("text").text((d: any) => `SECURE-ID: ${d.data.id}`).attr("text-anchor", "middle").attr("dy", "12").attr("fill", "#3b82f6").attr("font-size", "7px").attr("font-family", "monospace");

    } else if (viewMode === 'COSMIC') {
      const nodes = root.descendants();
      const links = root.links();
      const simulation = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink(links).distance(150).strength(1))
        .force("charge", d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(0, 0))
        .velocityDecay(0.3); // High performance inertia

      simulationRef.current = simulation;

      const link = g.append("g").selectAll("line")
        .data(links).join("line").attr("stroke", "rgba(255, 255, 255, 0.1)").attr("stroke-width", 1).attr("stroke-dasharray", "5,5");

      const node = g.append("g").selectAll("g")
        .data(nodes).join("g").attr("class", "cursor-pointer")
        .on("click", (e, d: any) => setSelectedNode(d.data))
        .call(d3.drag<any, any>()
          .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

      node.append("circle").attr("r", 30).attr("fill", "#0f172a").attr("stroke", "#10b981").attr("stroke-width", 1.5).style("filter", "url(#nebulaGlow)");
      node.append("clipPath").attr("id", d => `cosmic-c-${d.id}`).append("circle").attr("r", 27);
      node.append("image")
        .attr("xlink:href", (d: any) => d.data.img)
        .attr("x", -27).attr("y", -27).attr("width", 54).attr("height", 54)
        .attr("clip-path", d => `url(#cosmic-c-${d.id})`)
        .attr("preserveAspectRatio", "xMidYMid slice");

      simulation.on("tick", () => {
        link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      });
    }

    // Gradient Defs
    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "energyGrad").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#fbbf24").attr("stop-opacity", 0.1);
    grad.append("stop").attr("offset", "50%").attr("stop-color", "#fbbf24").attr("stop-opacity", 0.8);
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#fbbf24").attr("stop-opacity", 0.1);

    const filter = defs.append("filter").attr("id", "nebulaGlow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

  }, [viewMode]);

  const renderNodes = (g: any, nodesData: any[], width: number, height: number, mode: string) => {
    const node = g.append("g").selectAll("g")
      .data(nodesData)
      .join("g")
      .attr("transform", (d: any) => `translate(${d.y - width/4},${d.x - height/2.5})`)
      .attr("class", "cursor-pointer group")
      .on("click", (e: any, d: any) => setSelectedNode(d.data));

    node.append("circle")
      .attr("r", 40)
      .attr("fill", "rgba(255, 255, 255, 0.02)")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("class", "transition-all duration-500 group-hover:stroke-gold-400 group-hover:scale-110");

    node.append("clipPath").attr("id", (d: any) => `n-${d.id}`).append("circle").attr("r", 35);
    
    node.append("image")
      .attr("xlink:href", (d: any) => d.data.img)
      .attr("x", -35).attr("y", -35).attr("width", 70).attr("height", 70)
      .attr("clip-path", (d: any) => `url(#n-${d.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice");

    node.append("text")
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("class", "text-[10px] font-bold fill-white tracking-widest uppercase")
      .text((d: any) => d.data.name);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#020617] font-sans flex flex-col md:flex-row overflow-hidden">
      <style>{`
        @keyframes flowPulse { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
        .neural-path { stroke-dasharray: 20, 10; animation: flowPulse 5s linear infinite; }
        .blueprint-grid { background-image: linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px); background-size: 40px 40px; }
      `}</style>

      {/* Main Canvas Area */}
      <div ref={wrapperRef} className={`flex-1 relative ${viewMode === 'BLUEPRINT' ? 'blueprint-grid bg-[#020617]' : 'bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]'}`}>
        <svg ref={svgRef} className="w-full h-full block" />

        {/* Floating Toolbars */}
        <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
           <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-navy-900/80 backdrop-blur rounded-full text-slate-400 hover:text-white border border-white/10 transition-all shadow-2xl">
             <X size={24} />
           </button>
           
           <div className="bg-navy-900/80 backdrop-blur-xl p-2 rounded-3xl border border-white/10 flex flex-col gap-2 shadow-2xl">
              {[
                { id: 'FLOW', icon: <Waves size={18} />, label: 'Neural Flow' },
                { id: 'RADIAL', icon: <CircleDot size={18} />, label: 'Sovereign' },
                { id: 'BLUEPRINT', icon: <LayoutTemplate size={18} />, label: 'Schematic' },
                { id: 'COSMIC', icon: <Sparkles size={18} />, label: 'Nebula' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id as any)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${viewMode === m.id ? 'bg-gold-500 text-navy-950 shadow-lg scale-110' : 'text-slate-500 hover:text-white'}`}
                  title={m.label}
                >
                  {m.icon}
                </button>
              ))}
           </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute bottom-8 left-8 bg-navy-950/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewMode} ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Ancestor Intelligence Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="w-full md:w-[420px] bg-navy-950 border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-30 flex flex-col h-full"
          >
            <div className="h-64 relative shrink-0">
               <img src={selectedNode.img} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
               <button onClick={() => setSelectedNode(null)} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-white/20 rounded-full text-white z-10"><X size={18} /></button>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-8">
                  <div className="w-32 h-32 rounded-full border-4 border-navy-950 p-1 bg-gradient-to-br from-gold-400 to-emerald-600 shadow-2xl">
                    <img src={selectedNode.img} className="w-full h-full rounded-full object-cover border-2 border-navy-900" />
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-10 pb-12 pt-4 scrollbar-thin scrollbar-thumb-white/5">
               <div className="text-center mb-10">
                  <h2 className="text-4xl font-serif text-white font-bold mb-2">{selectedNode.name}</h2>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gold-400 uppercase tracking-[0.2em]">
                     {selectedNode.rishta_type || "Direct Ancestor"}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-navy-900/50 p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                     <History className="text-emerald-500 mb-2" size={20} />
                     <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Entry Year</span>
                     <div className="text-white font-serif text-xl">{selectedNode.dob || '1900'}</div>
                  </div>
                  <div className="bg-navy-900/50 p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                     <ShieldCheck className="text-blue-500 mb-2" size={20} />
                     <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Status</span>
                     <div className="text-white font-serif text-xl">Verified</div>
                  </div>
               </div>

               <div className="mb-10">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen size={14} /> Sanctuary Archives</h4>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 italic text-slate-300 text-sm leading-relaxed font-light">
                     "{selectedNode.bio || "Generating historical context through neural link..."}"
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                 <Button fullWidth onClick={() => {}} className="!py-4 shadow-xl !bg-gold-500 !text-navy-950 !font-black uppercase tracking-widest">
                    <Edit2 size={16} className="mr-2" /> Modify Profile
                 </Button>
                 <Button fullWidth variant="outline" className="!py-4 text-slate-400">
                    <History size={16} className="mr-2" /> View Audit Log
                 </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
