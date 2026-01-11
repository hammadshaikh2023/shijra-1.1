
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X, Download, User, Shield, Bell, GitGraph, CircleDot, Sprout, Sparkles, ZoomIn, ZoomOut, Maximize, Image as ImageIcon, Edit2, ChevronRight, Mic, Play, MoreHorizontal, LayoutTemplate, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FamilyMember, EditRequest, UserRole } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { AudioRecorder } from './AudioRecorder';

// --- INITIAL DATA ---
const initialFamilyData: FamilyMember = {
  id: "1",
  name: "Great Grandfather",
  img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop",
  children: [
    {
      id: "2",
      name: "Grandfather Ahmed",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop",
      children: [
        {
          id: "3",
          name: "Father Karim",
          img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
          children: [
            { id: "4", name: "Son Omar", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop" },
            { id: "5", name: "Daughter Layla", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" }
          ]
        },
        {
          id: "6",
          name: "Uncle Yusuf",
          img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop",
          children: [
            { id: "7", name: "Cousin Zayd", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=150&h=150&auto=format&fit=crop" }
          ]
        }
      ]
    },
    {
      id: "8",
      name: "Grandmother Zara",
      img: "https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=150&h=150&auto=format&fit=crop",
      children: [
        {
          id: "9",
          name: "Aunt Fatima",
          img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
          children: [
             { id: "10", name: "Cousin Sara", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop" }
          ]
        }
      ]
    }
  ]
};

// --- TEMPLATE CONFIGURATION ---
type TemplateType = 'cosmic' | 'royal' | 'botanical' | 'legacy';

interface TemplateConfig {
  id: TemplateType;
  label: string;
  description: string;
  icon: React.ReactNode;
  colors: {
    background: string;
    link: string;
    nodeBorder: string;
    text: string;
    accent: string;
  };
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: 'cosmic',
    label: 'Cosmic',
    description: 'Dynamic constellation map',
    icon: <Sparkles size={18} />,
    colors: {
      background: 'bg-[#020617]', // Handled via CSS mostly
      link: '#fbbf24', // Gold
      nodeBorder: '#fbbf24',
      text: '#fbbf24',
      accent: '#a855f7' // Purple
    }
  },
  {
    id: 'royal',
    label: 'Royal',
    description: 'Radial fan chart',
    icon: <CircleDot size={18} />,
    colors: {
      background: 'bg-gradient-to-br from-[#2a0a18] to-[#0f172a]', // Deep Burgundy/Navy
      link: '#d4af37', // Metallic Gold
      nodeBorder: '#d4af37',
      text: '#f8fafc',
      accent: '#d4af37'
    }
  },
  {
    id: 'botanical',
    label: 'Botanical',
    description: 'Organic vertical tree',
    icon: <Sprout size={18} />,
    colors: {
      background: 'bg-gradient-to-b from-[#064e3b] to-[#022c22]', // Deep Emerald
      link: '#4ade80', // Light Green
      nodeBorder: '#86efac',
      text: '#f0fdf4',
      accent: '#22c55e'
    }
  },
  {
    id: 'legacy',
    label: 'Legacy',
    description: 'Classic hierarchy',
    icon: <GitGraph size={18} />,
    colors: {
      background: 'bg-[#0f172a]', // Slate Navy
      link: '#94a3b8', // Slate
      nodeBorder: '#cbd5e1',
      text: '#f1f5f9',
      accent: '#38bdf8' // Sky
    }
  }
];

interface Props {
  onClose: () => void;
}

interface SavedStory {
  id: string;
  title: string;
  date: string;
  duration: string;
}

export const FamilyTreeViewer: React.FC<Props> = ({ onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);
  
  // Refs for Zoom Control
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const svgSelectionRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
  
  // State
  const [treeData, setTreeData] = useState<FamilyMember>(initialFamilyData);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('cosmic'); 
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Role & Notification State
  const [userRole, setUserRole] = useState<UserRole>('EDITOR');
  const [notifications, setNotifications] = useState<EditRequest[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [editForm, setEditForm] = useState<{ name: string; img: string }>({ name: '', img: '' });
  
  // Recording State
  const [showRecorder, setShowRecorder] = useState(false);
  const [memberStories, setMemberStories] = useState<Record<string, SavedStory[]>>({});

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Helper to deep update tree
  const updateTreeMember = (root: FamilyMember, id: string, changes: Partial<FamilyMember>): FamilyMember => {
    if (root.id === id) return { ...root, ...changes };
    if (root.children) {
      return { ...root, children: root.children.map(child => updateTreeMember(child, id, changes)) };
    }
    return root;
  };

  // Reset edit mode when selection changes
  useEffect(() => {
    if (selectedMember) {
      setEditForm({ name: selectedMember.name, img: selectedMember.img });
      setIsEditing(false);
    }
  }, [selectedMember]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    // Stop any existing simulation
    if (simulationRef.current) simulationRef.current.stop();

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    
    // ViewBox centered at 0,0
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    
    svgSelectionRef.current = svg;

    // --- DEFS (Filters & Gradients) ---
    const defs = svg.append("defs");
    
    // 1. Glow Filter (Orb Glow)
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // 2. Gradients per template
    // Botanical
    const botanicalGrad = defs.append("linearGradient").attr("id", "botanicalLink").attr("gradientUnits", "userSpaceOnUse");
    botanicalGrad.append("stop").attr("offset", "0%").attr("stop-color", "#22c55e"); 
    botanicalGrad.append("stop").attr("offset", "100%").attr("stop-color", "#14532d"); 

    // Cosmic
    const energyGrad = defs.append("linearGradient").attr("id", "energyGradient");
    energyGrad.append("stop").attr("offset", "0%").attr("stop-color", "#fbbf24").attr("stop-opacity", "0.1"); 
    energyGrad.append("stop").attr("offset", "50%").attr("stop-color", "#fbbf24").attr("stop-opacity", "0.8"); 
    energyGrad.append("stop").attr("offset", "100%").attr("stop-color", "#fbbf24").attr("stop-opacity", "0.1");

    const orbGrad = defs.append("radialGradient").attr("id", "orbGradient");
    orbGrad.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", "1");
    orbGrad.append("stop").attr("offset", "40%").attr("stop-color", "#fbbf24").attr("stop-opacity", "0.6");
    orbGrad.append("stop").attr("offset", "100%").attr("stop-color", "#d97706").attr("stop-opacity", "0");

    // Group for Content and Zoom
    const g = svg.append("g");
    
    // ZOOM BEHAVIOR
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8]) 
      .on("zoom", (event) => g.attr("transform", event.transform));
    
    svg.call(zoom)
       .on("dblclick.zoom", null); 
    
    zoomBehaviorRef.current = zoom;

    // --- DATA PROCESSING ---
    const root = d3.hierarchy(treeData);

    // --- RENDER LOGIC ---
    let initialTranslateX = 0;
    let initialTranslateY = 0;
    let initialScale = 0.9;

    if (activeTemplate === 'cosmic') {
      renderCosmic(root, g, width, height);
    } else {
      renderTreeLayout(root, g, width, height, activeTemplate);
      if (activeTemplate === 'legacy') {
        initialTranslateX = -root.y - (width * 0.1); 
        initialTranslateY = -root.x; 
        initialScale = 0.9; 
      } else if (activeTemplate === 'botanical') {
        initialTranslateX = -root.x;
        initialTranslateY = root.y + (height * 0.3); 
        initialScale = 0.9;
      } else if (activeTemplate === 'royal') {
        initialTranslateX = 0;
        initialTranslateY = 0;
      }
    }

    svg.transition().duration(1000).call(
      zoom.transform, 
      d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale)
    );

    setLoading(false);

  }, [activeTemplate, treeData]);

  // --- CINEMATIC ZOOM HANDLERS ---
  const handleZoomIn = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current.transition()
        .duration(1200) 
        .ease(d3.easeCubicOut) 
        .call(zoomBehaviorRef.current.scaleBy, 1.6);
    }
  };

  const handleZoomOut = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current.transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .call(zoomBehaviorRef.current.scaleBy, 0.6);
    }
  };

  const handleResetZoom = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current.transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.scale(1));
    }
  };

  // --- RENDERERS ---

  const renderTreeLayout = (root: d3.HierarchyNode<FamilyMember>, g: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number, mode: TemplateType) => {
    let treeLayout;
    
    if (mode === 'royal') {
      treeLayout = d3.tree<FamilyMember>()
        .size([2 * Math.PI, Math.min(width, height) * 0.4]) 
        .separation((a, b) => (a.parent === b.parent ? 0.8 : 1.3) / a.depth); 
    } else if (mode === 'botanical') {
      treeLayout = d3.tree<FamilyMember>()
        .size([width * 1.0, height * 1.0]) 
        .separation((a, b) => (a.parent === b.parent ? 0.8 : 1.2)); 
    } else {
      // Legacy
      treeLayout = d3.tree<FamilyMember>()
        .size([height * 1.0, width * 0.9]) 
        .separation((a, b) => (a.parent === b.parent ? 0.7 : 1.2)); 
    }

    treeLayout(root);

    const linkGen = g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link") 
      .attr("fill", "none")
      .style("opacity", 0);

    const templateConfig = TEMPLATES.find(t => t.id === mode);
    const linkColor = templateConfig?.colors.link || '#94a3b8';

    if (mode === 'royal') {
      linkGen.attr("d", d3.linkRadial<any, any>().angle(d => d.x).radius(d => d.y) as any)
        .attr("stroke", linkColor) 
        .attr("stroke-width", 1.5);
    } else if (mode === 'botanical') {
       linkGen.attr("d", d3.linkVertical<any, any>().x(d => d.x).y(d => -d.y) as any)
         .attr("stroke", "url(#botanicalLink)") 
         .attr("stroke-width", d => Math.max(1, 6 - d.target.depth * 1.5))
         .attr("stroke-opacity", 0.6); 
    } else {
       // Legacy
       linkGen.attr("d", d3.linkHorizontal<any, any>().x(d => d.y).y(d => d.x) as any)
         .attr("stroke", linkColor) 
         .attr("stroke-width", 1)
         .attr("stroke-dasharray", "1,0"); // Solid line
    }

    linkGen.transition().duration(1000).style("opacity", mode === 'royal' ? 0.4 : 0.8);

    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node cursor-pointer")
      .style("opacity", 0);

    if (mode === 'royal') {
      node.attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);
    } else if (mode === 'botanical') {
      node.attr("transform", d => `translate(${d.x}, ${-d.y})`);
    } else {
      node.attr("transform", d => `translate(${d.y},${d.x})`);
    }

    node.transition().duration(1000).style("opacity", 1);
    renderNodeContent(node, mode);
  };

  const renderCosmic = (root: d3.HierarchyNode<FamilyMember>, g: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number) => {
    const nodes = root.descendants();
    const links = root.links();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.data.id).distance(100)) 
      .force("charge", d3.forceManyBody().strength(-300)) 
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide(50)); 
    
    simulationRef.current = simulation;

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "energy-link") 
      .attr("stroke", "url(#energyGradient)")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6);

    const node = g.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node cursor-pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    renderNodeContent(node, 'cosmic');

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  };

  const renderNodeContent = (nodeSelection: any, mode: TemplateType) => {
    const config = TEMPLATES.find(t => t.id === mode)!;
    const contentGroup = nodeSelection.append("g")
      .attr("class", "node-content transition-transform duration-500 ease-out"); 

    // Hover Interaction
    contentGroup.on("mouseenter", function(event: any, d: any) {
      d3.select(this)
        .transition().duration(400).ease(d3.easeBackOut)
        .attr("transform", "scale(1.5)"); 
      
      d3.select(this).append("circle")
        .attr("class", "hover-glow")
        .attr("r", 45)
        .attr("fill", "none")
        .attr("stroke", config.colors.accent)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4 2")
        .attr("stroke-opacity", 0)
        .transition().duration(200)
        .attr("stroke-opacity", 1);
      
      const allNodes = d3.selectAll('.node');
      const allLinks = d3.selectAll('.energy-link, .link'); 

      allNodes.classed('dimmed', true);
      allLinks.classed('dimmed', true);

      const connectedIds = new Set([d.data.id]);

      allLinks
        .filter((l: any) => {
            const isConnected = l.source.data.id === d.data.id || l.target.data.id === d.data.id;
            if (isConnected) {
                connectedIds.add(l.source.data.id);
                connectedIds.add(l.target.data.id);
            }
            return isConnected;
        })
        .classed('dimmed', false) 
        .classed('highlighted-link', true) 
        .raise(); 

      allNodes
        .filter((n: any) => connectedIds.has(n.data.id))
        .classed('dimmed', false)
        .classed('active-node', true) 
        .raise(); 

      d3.select(this.parentNode).raise(); 

    }).on("mouseleave", function(event: any, d: any) {
      d3.select(this)
        .transition().duration(400).ease(d3.easeCubicOut)
        .attr("transform", "scale(1)");
        
      d3.select(this).selectAll(".hover-glow").remove();

      d3.selectAll('.node')
        .classed('dimmed', false)
        .classed('active-node', false);

      d3.selectAll('.energy-link, .link')
        .classed('dimmed', false)
        .classed('highlighted-link', false);
    });

    // Custom Shapes/Colors per template
    if (mode === 'cosmic') {
        contentGroup.append("circle")
            .attr("r", 30)
            .attr("fill", "url(#orbGradient)")
            .style("opacity", 0.3);

        const clipId = (d: any) => `clip-cosmic-${d.data.id}`;
        
        contentGroup.append("defs")
            .append("clipPath")
            .attr("id", clipId)
            .append("circle")
            .attr("r", 18);

        contentGroup.append("circle")
            .attr("r", 18)
            .attr("fill", "#0f172a"); 

        contentGroup.append("image")
            .attr("xlink:href", (d: any) => d.data.img)
            .attr("x", -18)
            .attr("y", -18)
            .attr("width", 36)
            .attr("height", 36)
            .attr("clip-path", `url(#${clipId})`)
            .attr("preserveAspectRatio", "xMidYMid slice");

        contentGroup.append("circle")
            .attr("r", 22)
            .attr("fill", "none")
            .attr("stroke", config.colors.nodeBorder)
            .attr("stroke-width", 1.5)
            .attr("stroke-opacity", 0.6)
            .style("filter", "url(#glow)");

    } else {
        // Standard Circle for Royal/Botanical/Legacy
        contentGroup.append("circle")
          .attr("r", 24)
          .attr("fill", "#0f172a") 
          .attr("stroke", config.colors.nodeBorder)
          .attr("stroke-width", 2);

        const clipId = (d: any) => `clip-${d.data.id}-${mode}`;
        contentGroup.append("clipPath")
          .attr("id", d => clipId(d))
          .append("circle")
          .attr("r", 20);

        contentGroup.append("image")
          .attr("xlink:href", (d: any) => d.data.img)
          .attr("x", -20)
          .attr("y", -20)
          .attr("width", 40)
          .attr("height", 40)
          .attr("clip-path", (d: any) => `url(#${clipId(d)})`)
          .attr("preserveAspectRatio", "xMidYMid slice");
    }

    const labelGroup = contentGroup.append("g").attr("class", "label-group");
    const getTextWidth = (text: string) => Math.max(60, text.length * 7 + 24); 

    labelGroup.each(function(d: any) {
        const g = d3.select(this);
        const name = d.data.name;
        const width = getTextWidth(name);
        const height = 24;
        const isRadial = mode === 'royal';
        let y = 35; 
        
        if (!isRadial) {
             const pill = g.append("g").attr("class", "pill");
             
             if (mode === 'legacy') {
                // Rectangular styling for Legacy
                pill.append("rect")
                  .attr("x", -width / 2)
                  .attr("y", y - height/2)
                  .attr("width", width)
                  .attr("height", height)
                  .attr("fill", "#1e293b")
                  .attr("stroke", config.colors.nodeBorder)
                  .attr("stroke-width", 0.5);
             } else {
                // Rounded for others
                pill.append("rect")
                  .attr("x", -width / 2)
                  .attr("y", y - height/2)
                  .attr("width", width)
                  .attr("height", height)
                  .attr("rx", 12)
                  .attr("ry", 12)
                  .attr("fill", "#0f172a") 
                  .attr("fill-opacity", "0.85")
                  .attr("stroke", config.colors.nodeBorder) 
                  .attr("stroke-width", "1")
                  .attr("stroke-opacity", "0.4");
             }
                
             pill.append("text")
                .text(name)
                .attr("x", 0)
                .attr("y", y)
                .attr("dy", "0.35em") 
                .attr("text-anchor", "middle")
                .attr("font-family", "'Playfair Display', serif")
                .attr("font-size", "11px")
                .attr("font-weight", "600")
                .attr("fill", config.colors.text) 
                .attr("letter-spacing", "0.02em");
                
        } else {
             // Radial Text
             const isFlipped = d.x >= Math.PI;
             const xPos = d.x < Math.PI === !d.children ? 30 : -30;
             g.append("text")
                .text(name)
                .attr("x", xPos)
                .attr("y", 0)
                .attr("dy", "0.31em")
                .attr("text-anchor", d.x < Math.PI === !d.children ? "start" : "end")
                .attr("transform", isFlipped ? "rotate(180)" : null)
                .attr("font-family", "'Playfair Display', serif")
                .attr("font-size", "11px")
                .attr("font-weight", "600")
                .attr("fill", config.colors.text) 
                .style("text-shadow", "0 2px 4px rgba(0,0,0,0.9)");
        }
    });

    nodeSelection.on("click", (event: any, d: any) => {
      event.stopPropagation();
      setSelectedMember(d.data);
      setEditForm({ name: d.data.name, img: d.data.img });
    });
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#020617', logging: false, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.save(`shijra-${activeTemplate}-legacy.pdf`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedMember) return;
    if (userRole === 'ADMIN') {
      const newData = updateTreeMember(treeData, selectedMember.id, editForm);
      setTreeData(newData);
      setIsEditing(false); 
    } else {
      const newRequest: EditRequest = {
        id: `req_${Date.now()}`,
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        requesterRole: userRole,
        changes: editForm,
        status: 'PENDING',
        timestamp: new Date()
      };
      setNotifications(prev => [newRequest, ...prev]);
      setIsEditing(false); 
      alert("Validation: Request Sent to Admin for Approval");
    }
  };

  const handleApprove = (req: EditRequest) => {
    const newData = updateTreeMember(treeData, req.memberId, req.changes);
    setTreeData(newData);
    setNotifications(prev => prev.filter(r => r.id !== req.id));
  };
  
  const handleSaveRecording = (blob: Blob | null, notes: string) => {
     if (!selectedMember) return;
     const newStory: SavedStory = {
       id: Date.now().toString(),
       title: notes || "Untitled Memory",
       date: new Date().toLocaleDateString(),
       duration: "1:23" // Mock
     };
     
     setMemberStories(prev => ({
       ...prev,
       [selectedMember.id]: [newStory, ...(prev[selectedMember.id] || [])]
     }));
     
     setShowRecorder(false);
  };

  // Get active configuration
  const currentConfig = TEMPLATES.find(t => t.id === activeTemplate)!;

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col animate-fade-in-up font-sans transition-colors duration-1000 ${currentConfig.colors.background}`}>
      
      {/* Styles for animation */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.6; }
          66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.4; }
        }
        .animate-blob {
          animation: blob 20s infinite ease-in-out alternate;
        }
        @keyframes float-dust {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .dust-particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: float-dust 15s infinite linear;
        }
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes energyFlow {
           0% { stroke-dashoffset: 20; opacity: 0.3; }
           50% { opacity: 1; stroke: #fbbf24; }
           100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
        .energy-link {
           stroke-dasharray: 6, 4;
           animation: energyFlow 8s linear infinite; 
           transition: stroke 0.4s, stroke-width 0.4s, opacity 0.4s;
        }
        
        .dimmed {
          opacity: 0.1 !important;
          transition: opacity 0.5s ease;
        }
        .active-node {
          opacity: 1 !important;
          filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.3));
        }
        .highlighted-link {
          stroke: ${currentConfig.colors.accent} !important;
          stroke-opacity: 1 !important;
          stroke-width: 2.5px !important;
          animation: none !important; 
          filter: drop-shadow(0 0 5px ${currentConfig.colors.accent}80);
          opacity: 1 !important;
        }
      `}</style>
      
      {/* --- INTEGRATED RECORDER --- */}
      {showRecorder && (
        <AudioRecorder onClose={() => setShowRecorder(false)} onSave={handleSaveRecording} />
      )}

      {/* --- TOP BAR (Admin & Export) --- */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-20 pointer-events-none">
         
         <div className="pointer-events-auto flex flex-wrap items-center gap-4">
             {/* Role & Notifications */}
             <div className="bg-navy-900/50 backdrop-blur-md p-1.5 rounded-lg border border-white/10 flex gap-2 items-center shadow-2xl">
               <button onClick={() => setUserRole('EDITOR')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${userRole === 'EDITOR' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                 <User size={14} /> Editor
               </button>
               <button onClick={() => setUserRole('ADMIN')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${userRole === 'ADMIN' ? 'bg-gold-500 text-navy-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                 <Shield size={14} /> Admin
               </button>
               <div className="h-4 w-px bg-white/10 mx-1" />
               <button onClick={() => setShowNotifications(!showNotifications)} className="p-1.5 relative text-slate-300 hover:text-white">
                  <Bell size={16} />
                  {notifications.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
               </button>
             </div>

             {/* NOTIFICATION DROPDOWN */}
             {showNotifications && (
               <div className="absolute top-16 left-4 w-80 bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                 <div className="p-3 border-b border-white/5"><h4 className="text-xs font-bold text-slate-400 uppercase">Requests</h4></div>
                 <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? <div className="p-4 text-center text-slate-500 text-xs">No pending requests</div> : 
                      notifications.map(req => (
                        <div key={req.id} className="p-3 border-b border-white/5 hover:bg-white/5">
                           <div className="flex justify-between text-xs text-white mb-1"><span>{req.changes.name}</span><span className="text-slate-500">{new Date(req.timestamp).toLocaleTimeString()}</span></div>
                           {userRole === 'ADMIN' ? (
                             <div className="flex gap-2 mt-2"><button onClick={() => handleApprove(req)} className="flex-1 bg-emerald-600/20 text-emerald-400 text-[10px] py-1 rounded border border-emerald-500/30">Approve</button></div>
                           ) : <div className="text-[10px] text-gold-400 italic">Waiting for approval...</div>}
                        </div>
                      ))
                    }
                 </div>
               </div>
             )}

             <button onClick={handleExportPDF} disabled={isExporting} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors border border-white/10 shadow-lg">
               {isExporting ? <span className="animate-spin text-xs">...</span> : <Download size={18} />}
             </button>
         </div>

         <button onClick={onClose} className="pointer-events-auto p-3 rounded-full bg-navy-800 text-white hover:bg-red-500/80 transition-colors border border-white/10 shadow-lg z-50">
           <X size={24} />
         </button>
      </div>
      
      {/* --- ZOOM CONTROLS --- */}
      <div className="absolute top-24 right-6 z-20 flex flex-col gap-3 pointer-events-auto">
        <button onClick={handleZoomIn} className="p-3 bg-navy-900/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all shadow-xl active:scale-95 group">
          <ZoomIn size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={handleResetZoom} className="p-3 bg-navy-900/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all shadow-xl active:scale-95 group">
          <Maximize size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={handleZoomOut} className="p-3 bg-navy-900/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all shadow-xl active:scale-95 group">
          <ZoomOut size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* --- TEMPLATE DOCK (BOTTOM NAVIGATION) --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
         <div className="flex items-center gap-2 bg-navy-950/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
            <div className="px-3 border-r border-white/10 flex flex-col justify-center items-center text-slate-500">
               <Palette size={16} />
               <span className="text-[9px] font-bold uppercase tracking-wide mt-1">Theme</span>
            </div>
            {TEMPLATES.map((template) => (
               <button
                 key={template.id}
                 onClick={() => setActiveTemplate(template.id)}
                 className={`
                   relative group flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300
                   ${activeTemplate === template.id ? 'bg-white/10 shadow-lg scale-105' : 'hover:bg-white/5 hover:scale-105'}
                 `}
               >
                 <div className={`transition-colors ${activeTemplate === template.id ? 'text-gold-400' : 'text-slate-400 group-hover:text-white'}`}>
                    {template.icon}
                 </div>
                 <span className={`text-[10px] mt-1 font-medium ${activeTemplate === template.id ? 'text-white' : 'text-slate-500'}`}>
                    {template.label}
                 </span>
                 
                 {/* Tooltip Description */}
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-md">
                    {template.description}
                 </div>
               </button>
            ))}
         </div>
      </div>

      {/* MEMBER DETAILS PANEL (Full Height Right Sidebar) */}
      {selectedMember && (
        <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-navy-950/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-in overflow-y-auto z-50 flex flex-col font-sans">
           {/* ... (Existing Panel Content remains same) ... */}
           {/* Header Image / Gradient */}
           <div className="h-40 bg-gradient-to-br from-emerald-900 via-navy-800 to-navy-900 relative shrink-0">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
              <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-all z-10 border border-white/10">
                <X size={18} />
              </button>
           </div>
           
           {/* Profile Content */}
           <div className="px-8 pb-8 flex-1 flex flex-col relative -mt-16">
              
              {/* Avatar */}
              <div className="self-center relative group cursor-pointer mb-4" onClick={() => setLightboxImage(selectedMember.img)}>
                  <div className="w-32 h-32 rounded-full border-4 border-navy-950 shadow-2xl p-1 bg-gradient-to-br from-gold-400 to-emerald-600">
                     <img src={selectedMember.img} className="w-full h-full rounded-full object-cover border-2 border-navy-900" />
                  </div>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <Maximize className="text-white drop-shadow-md" size={24} />
                  </div>
              </div>
              
              {/* Name & Title */}
              <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif text-white font-bold leading-tight mb-2 drop-shadow-lg">{selectedMember.name}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-gold-400 uppercase">
                    Family Member
                  </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">{selectedMember.children?.length || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Direct Descendants</div>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-bold text-gold-400 mb-1">3</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Generation</div>
                 </div>
              </div>
              
              {/* Dynamic Content: Edit vs View */}
              <div className="flex-1">
                  {isEditing ? (
                      <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                          <div className="space-y-1">
                             <label className="text-xs text-slate-400 ml-1 uppercase font-bold tracking-wider">Display Name</label>
                             <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="!bg-navy-900 !border-slate-700" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs text-slate-400 ml-1 uppercase font-bold tracking-wider">Profile Image URL</label>
                             <Input value={editForm.img} onChange={e => setEditForm({...editForm, img: e.target.value})} className="!bg-navy-900 !border-slate-700" />
                          </div>
                          
                          <div className="pt-4 flex flex-col gap-3">
                              <Button fullWidth onClick={handleSaveEdit} variant="primary" className="!py-3 !text-sm">
                                {userRole === 'ADMIN' ? 'Save Changes' : 'Submit Request'}
                              </Button>
                              <Button fullWidth onClick={() => setIsEditing(false)} variant="ghost" className="!py-3 !text-sm !text-slate-400 hover:!text-white hover:bg-white/5">
                                Cancel
                              </Button>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                          
                          {/* Memories Section */}
                          <div className="relative">
                              <div className="flex items-center gap-2 mb-4">
                                 <div className="h-px flex-1 bg-white/10" />
                                 <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Oral Histories</span>
                                 <div className="h-px flex-1 bg-white/10" />
                              </div>

                              {/* Story List or Empty State */}
                              {(memberStories[selectedMember.id] && memberStories[selectedMember.id].length > 0) ? (
                                  <div className="space-y-3">
                                      {memberStories[selectedMember.id].map((story, i) => (
                                          <div key={story.id} className="group relative flex items-center gap-4 bg-navy-900/50 p-3 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all hover:bg-navy-800/60 animate-[fadeInUp_0.3s_ease-out]" style={{animationDelay: `${i * 0.1}s`}}>
                                              <div className="w-10 h-10 rounded-full bg-navy-950 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.1)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all">
                                                 <Play size={14} className="text-gold-400 ml-0.5" />
                                              </div>
                                              <div className="flex-1">
                                                 <h4 className="text-slate-200 text-sm font-medium leading-none mb-1.5">{story.title}</h4>
                                                 <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <span>{story.date}</span>
                                                    <span>•</span>
                                                    <span>{story.duration}</span>
                                                 </div>
                                              </div>
                                              <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                                                 <MoreHorizontal size={16} />
                                              </button>
                                              
                                              {/* Glow effect on hover */}
                                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                          </div>
                                      ))}
                                      
                                      <button 
                                        onClick={() => setShowRecorder(true)} 
                                        className="w-full py-2.5 mt-2 rounded-lg border border-dashed border-white/10 text-xs text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
                                      >
                                         <Mic size={12} /> Record Another Memory
                                      </button>
                                  </div>
                              ) : (
                                  <div className="bg-gradient-to-br from-navy-900 to-navy-800 p-5 rounded-2xl border border-white/5 relative overflow-hidden group text-center">
                                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Mic size={40} className="text-white" />
                                      </div>
                                      <h4 className="text-white text-sm font-bold mb-2 flex items-center justify-center gap-2">
                                        <Sparkles size={14} className="text-gold-400" /> Start the Legacy
                                      </h4>
                                      <p className="text-xs text-slate-400 mb-4">No voice recordings yet. Be the first to add one.</p>
                                      <button 
                                        onClick={() => setShowRecorder(true)}
                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1 mx-auto border border-emerald-500/30 px-4 py-2 rounded-full hover:bg-emerald-500/10 transition-colors"
                                      >
                                        Record Memory <ChevronRight size={12} />
                                      </button>
                                  </div>
                              )}
                          </div>

                          <Button fullWidth onClick={() => setIsEditing(true)} variant="secondary" className="!py-3 !text-sm shadow-none border border-gold-500/30 bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-navy-950 mt-4">
                              <Edit2 size={14} className="mr-2" /> Edit Profile
                          </Button>
                      </div>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]" onClick={() => setLightboxImage(null)}>
           <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
             <X size={32} />
           </button>
           <img 
             src={lightboxImage} 
             alt="Full View" 
             className="max-w-full max-h-[85vh] rounded-lg shadow-[0_0_50px_rgba(251,191,36,0.3)] border border-gold-500/30"
             onClick={(e) => e.stopPropagation()} 
           />
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/5">
             Click anywhere to close
           </div>
        </div>
      )}

      {/* CANVAS */}
      <div ref={printRef} className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {/* Animated Backgrounds - Dynamic based on activeTemplate */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000">
           {activeTemplate === 'cosmic' && (
             <>
               <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]" />
               <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-900/20 rounded-full blur-[130px] animate-blob" />
               <div className="absolute bottom-[10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-900/10 rounded-full blur-[150px] animate-blob" style={{ animationDelay: '5s', animationDuration: '25s' }} />
               {[...Array(20)].map((_, i) => (
                 <div key={i} className="dust-particle" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`, animationDelay: `${Math.random() * 15}s` }} />
               ))}
             </>
           )}
           
           {activeTemplate === 'royal' && (
             <>
               <div className="absolute inset-0 bg-gradient-to-br from-[#2a0a18] via-[#1e1b4b] to-[#020617]" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)]" />
               <div className="absolute inset-8 border border-gold-500/10 rounded-[3rem] z-10 shadow-[inset_0_0_100px_rgba(251,191,36,0.05)]" />
             </>
           )}

           {activeTemplate === 'botanical' && (
             <>
                <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b] via-[#065f46] to-[#022c22]" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
             </>
           )}

           {activeTemplate === 'legacy' && (
             <>
               <div className="absolute inset-0 bg-[#0f172a]" />
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
             </>
           )}

           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        <div ref={wrapperRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10 relative transition-opacity duration-500" style={{ opacity: loading ? 0 : 1 }}>
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>

        {/* Template Title Indicator */}
        <div className="absolute bottom-8 left-8 flex flex-col gap-1 pointer-events-none z-10 opacity-70">
          <div className="text-white/30 font-serif text-[10px] tracking-[0.4em] uppercase">Visual Theme</div>
          <div className={`font-serif text-2xl capitalize flex items-center gap-3 drop-shadow-md`} style={{ color: currentConfig.colors.text }}>
             {currentConfig.icon}
             <span>{currentConfig.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
