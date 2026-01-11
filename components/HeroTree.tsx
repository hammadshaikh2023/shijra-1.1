
import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sparkle Particle Type
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const HeroTree: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- FRACTAL GENERATION (The "Khila hua" Tree) ---
  const branches = useMemo(() => {
    const list: any[] = [];
    const maxDepth = 6;
    
    // Wider spread for "Khila hua" (blooming) look
    const grow = (x: number, y: number, len: number, angle: number, depth: number) => {
      if (depth === 0) return;
      const x2 = x + len * Math.cos(angle);
      const y2 = y + len * Math.sin(angle);
      
      list.push({ x1: x, y1: y, x2, y2, depth, id: `${depth}-${x.toFixed(0)}-${y.toFixed(0)}` });
      
      const nextLen = len * 0.75;
      const spread = 0.65; // Wide angle for blooming effect
      
      grow(x2, y2, nextLen, angle - spread, depth - 1);
      grow(x2, y2, nextLen, angle + spread, depth - 1);
    };
    
    // Start from bottom center
    grow(250, 550, 100, -Math.PI/2, maxDepth);
    return list;
  }, []);

  // --- MOUSE INTERACTION (The "Stars Barasna" Effect) ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new sparkles
    const newSparkles = Array.from({ length: 2 }).map(() => ({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 20, // Slight spread
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 3 + 2,
      color: Math.random() > 0.5 ? '#fbbf24' : '#ffffff' // Gold or White
    }));

    setSparkles(prev => [...prev.slice(-30), ...newSparkles]); // Limit to last 30 to keep performance high
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-[400px] md:w-[500px] h-[500px] md:h-[600px] flex items-center justify-center cursor-pointer group"
      onMouseMove={handleMouseMove}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-emerald-500/5 blur-[70px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-1000" />

      {/* Raining Stars Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 1, x: s.x, y: s.y, scale: 0.5 }}
              animate={{ 
                y: s.y + 150, // Fall down (Rain effect)
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 360
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeIn" }}
              className="absolute rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"
              style={{ 
                width: s.size, 
                height: s.size,
                backgroundColor: s.color 
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* The Tree SVG */}
      <svg viewBox="0 0 500 600" className="w-full h-full overflow-visible relative z-10">
        <defs>
          <filter id="hero-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="branchGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#065f46" /> {/* Dark Emerald */}
            <stop offset="60%" stopColor="#10b981" /> {/* Bright Emerald */}
            <stop offset="100%" stopColor="#fbbf24" /> {/* Gold Tips */}
          </linearGradient>
        </defs>

        <g stroke="url(#branchGradient)" strokeLinecap="round" filter="url(#hero-glow)">
          {branches.map((b, i) => (
            <motion.line
              key={b.id}
              x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
              strokeWidth={b.depth * 1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ 
                duration: 1.5, 
                delay: (6 - b.depth) * 0.2, // Growth sequence
                ease: "easeOut" 
              }}
            />
          ))}
        </g>

        {/* Blooming Leaves/Stars on Tips */}
        {branches.filter(b => b.depth <= 2).map((b, i) => (
           <motion.circle
             key={`leaf-${i}`}
             cx={b.x2}
             cy={b.y2}
             r={b.depth === 1 ? 3 : 2}
             fill="#fbbf24"
             initial={{ scale: 0 }}
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ 
                delay: 2 + Math.random(), 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
             }}
             className="drop-shadow-[0_0_8px_rgba(251,191,36,1)]"
           />
        ))}
      </svg>
    </div>
  );
};
