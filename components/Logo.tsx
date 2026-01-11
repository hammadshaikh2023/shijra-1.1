
import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
  vertical?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", withText = false, vertical = false }) => {
  return (
    <div className={`flex ${vertical ? 'flex-col justify-center' : 'flex-row'} items-center ${vertical ? 'gap-4' : 'gap-3'}`}>
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Professional clean icon - Transparent background for a modern minimal look */}
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Central Trunk */}
          <path 
            d="M50 95V55" 
            stroke="url(#logoGradient)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className="drop-shadow-lg"
          />

          {/* Organic Branches */}
          <path 
            d="M50 75C30 70 20 50 20 30" 
            stroke="url(#logoGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          
          <path 
            d="M50 75C70 70 80 50 80 30" 
            stroke="url(#logoGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Connective Nodes */}
          <path 
            d="M50 55C40 45 35 30 35 15" 
            stroke="url(#logoGradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          <path 
            d="M50 55C60 45 65 30 65 15" 
            stroke="url(#logoGradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.9"
          />

          {/* Stars/Nodes representing Ancestry */}
          <circle cx="20" cy="30" r="5" fill="#fbbf24" filter="url(#logoGlow)" />
          <circle cx="80" cy="30" r="5" fill="#fbbf24" filter="url(#logoGlow)" />
          <circle cx="35" cy="15" r="3.5" fill="#10b981" filter="url(#logoGlow)" />
          <circle cx="65" cy="15" r="3.5" fill="#10b981" filter="url(#logoGlow)" />
          
          <circle cx="50" cy="10" r="6" fill="white" filter="url(#logoGlow)" stroke="#fbbf24" strokeWidth="1.5" />
          
          {/* Base Foundations */}
          <path d="M50 95C42 100 35 98 30 92" stroke="url(#logoGradient)" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M50 95C58 100 65 98 70 92" stroke="url(#logoGradient)" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
        </svg>
      </div>
      
      {withText && (
        <span className={`${vertical ? 'text-sm tracking-[0.4em]' : 'text-xl tracking-[0.1em]'} font-serif font-bold text-white drop-shadow-sm uppercase`}>
          Shijra
        </span>
      )}
    </div>
  );
};
