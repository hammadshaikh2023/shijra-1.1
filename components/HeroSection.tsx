import React from 'react';
import { motion } from 'framer-motion';
import { HeroTree } from './HeroTree';
import { Button } from './Button';
import { Mic, Share2, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onStartRecord: () => void;
  onViewDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartRecord, onViewDemo }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
      
      {/* --- CONTENT CONTAINER --- */}
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT: TEXT CONTENT */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-emerald-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 hover:bg-white/10 transition-colors cursor-default shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>The Digital Sanctuary</span>
          </div>
          
          {/* Headline - STATIC (No Animation) */}
          <div className="relative mb-6">
            <h1 
              className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-white to-gold-200 leading-[1.1] tracking-tight filter drop-shadow-lg"
            >
              Unravel Your <br />
              <span className="text-white">Constellation of Kin</span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-slate-300/80 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light"
          >
            Don't let your family's stories fade into the past. Record voices, map lineages, and grow a timeless digital tree in a sanctuary built for generations.
          </p>
          
          {/* Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
          >
            <div className="transition-transform hover:scale-105 active:scale-95">
              <Button 
                variant="secondary" 
                className="w-full sm:w-auto min-w-[180px] !bg-gradient-to-r from-gold-400 to-gold-500 !text-navy-950 font-bold shadow-[0_0_30px_rgba(251,191,36,0.25)] hover:shadow-[0_0_50px_rgba(251,191,36,0.4)] border-none"
                onClick={onStartRecord}
              >
                <Mic className="w-5 h-5 mr-2" />
                Record Memory
              </Button>
            </div>

            <div className="transition-transform hover:scale-105 active:scale-95">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto min-w-[180px] border-white/20 hover:bg-white/5 backdrop-blur-md text-slate-200"
                onClick={onViewDemo}
              >
                <Share2 className="w-5 h-5 mr-2" />
                View Demo Tree
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: HERO TREE VISUALIZATION - STATIC (No Floating) */}
        <div className="order-1 lg:order-2 flex justify-center relative">
          {/* Glowing Aura behind tree - Static */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px]" />
          
          {/* Static Wrapper */}
          <div className="relative z-10">
             <HeroTree />
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
           <ChevronDown className="w-8 h-8 text-slate-500" />
      </div>
    </section>
  );
};