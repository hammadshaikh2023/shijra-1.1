import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Save, X, Clock, Disc } from 'lucide-react';

interface AudioRecorderProps {
  onClose: () => void;
  onSave?: (blob: Blob | null, notes: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onClose, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Add initial value to useRef to fix argument error
  const animationRef = useRef<number | undefined>(undefined);
  const audioDataRef = useRef<number>(0); // Mock audio amplitude (0 to 1)

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // --- NEBULA VISUALIZATION LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to HD
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Particle System
    const particles: { 
      angle: number; 
      radius: number; 
      speed: number; 
      size: number; 
      color: string; 
      offset: number; 
    }[] = [];

    const colors = ['#10b981', '#fbbf24', '#3b82f6', '#ffffff']; // Emerald, Gold, Blue, White

    // Create Particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 30 + Math.random() * 80,
        speed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        offset: Math.random() * 100
      });
    }

    const render = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Navy-950 with transparency
      ctx.fillRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      // Update Simulated Audio Data
      if (isRecording) {
        // Randomly fluctuate amplitude to simulate voice
        const target = Math.random() * 0.8 + 0.2;
        audioDataRef.current += (target - audioDataRef.current) * 0.1;
      } else {
        // Decay to 0
        audioDataRef.current += (0 - audioDataRef.current) * 0.1;
      }

      const amplitude = audioDataRef.current;
      const baseScale = 1 + amplitude * 0.5;

      // Draw Center Core (The "Black Hole" or "Star")
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 * baseScale);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.2, 'rgba(251, 191, 36, 0.4)'); // Gold
      gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.1)'); // Emerald
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 * baseScale, 0, Math.PI * 2);
      ctx.fill();

      // Draw Particles (Nebula Swirl)
      particles.forEach(p => {
        p.angle += p.speed + (amplitude * 0.02); // Spin faster when loud
        
        // Expand radius based on amplitude (Waveform effect)
        const wave = Math.sin(Date.now() * 0.005 + p.offset) * (20 * amplitude);
        const currentRadius = p.radius * baseScale + wave;

        const x = cx + Math.cos(p.angle) * currentRadius;
        const y = cy + Math.sin(p.angle) * currentRadius;

        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 + amplitude), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Add Glow
        ctx.shadowBlur = 10 * amplitude;
        ctx.shadowColor = p.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
      });

      // Rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 50 * baseScale, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.beginPath();
      ctx.arc(cx, cy, 100 * baseScale, 0, Math.PI * 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    // Trigger fade out animation
    setIsClosing(true);
    setTimeout(() => {
       if (onSave) onSave(null, notes); // Pass mock blob
       onClose();
    }, 800);
  };

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-lg bg-navy-900/40 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col items-center p-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        <h3 className="text-white font-serif text-xl tracking-widest uppercase mb-2 z-10">Oral History</h3>
        <div className={`text-xs font-mono tracking-[0.3em] mb-4 z-10 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
           {isRecording ? 'RECORDING IN PROGRESS' : 'READY TO RECORD'}
        </div>

        {/* NEBULA VISUALIZATION CONTAINER */}
        <div className="relative w-[300px] h-[300px] mb-8 flex items-center justify-center">
            {/* The Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 rounded-full" />
            
            {/* Center Timer */}
            <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
                <div className="font-mono text-3xl text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                   {formatTime(duration)}
                </div>
            </div>

            {/* Record Controls (Centered in visualization) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 z-30">
               <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center border-2 
                    transition-all duration-300 transform hover:scale-110 active:scale-95
                    ${isRecording 
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'}
                  `}
                >
                  {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={28} />}
               </button>
            </div>
        </div>

        {/* Note Input Area */}
        <div className="w-full space-y-2 mt-6 z-10">
            <input 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Title: e.g. Grandma's Wedding Story..."
              className="w-full bg-navy-950/50 border-b border-white/10 p-3 text-center text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-all bg-transparent"
            />
        </div>

        {/* Save Action */}
        {!isRecording && (duration > 0 || notes.length > 0) && (
           <button 
             onClick={handleSave}
             className="mt-8 px-8 py-3 bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/50 rounded-full text-slate-300 hover:text-gold-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all group"
           >
             <Save size={14} className="group-hover:scale-110 transition-transform" />
             Save to Legacy
           </button>
        )}

      </div>
    </div>
  );
};